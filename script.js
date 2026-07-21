// SmartConvert v1
// Основная логика интерфейса


const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");

const fileInfo = document.getElementById("fileInfo");

const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const fileType = document.getElementById("fileType");

const themeButton = document.getElementById("themeButton");


let currentFile = null;



// =======================
// Выбор файла
// =======================


fileInput.addEventListener(
    "change",
    function(){

        if(this.files.length > 0){

            handleMultipleFiles(this.files);

        }

    }
);




// =======================
// Drag & Drop
// =======================


dropZone.addEventListener(
    "dragover",
    function(event){

        event.preventDefault();

        dropZone.style.transform =
        "scale(1.03)";

    }
);



dropZone.addEventListener(
    "dragleave",
    function(){

        dropZone.style.transform =
        "scale(1)";

    }
);



dropZone.addEventListener(
    "drop",
    function(event){

        event.preventDefault();


        dropZone.style.transform =
        "scale(1)";


        const file =
        event.dataTransfer.files[0];


        if(file){

            handleFile(file);

        }

    }
);




// =======================
// Обработка файла
// =======================


function handleFile(file){


    currentFile = file;


    fileName.textContent =
    file.name;


    fileSize.textContent =
    formatSize(file.size);


    fileType.textContent =
    getFileType(file);


    fileInfo.classList.remove(
        "hidden"
    );


}




// =======================
// Размер файла
// =======================


function formatSize(bytes){


    if(bytes === 0)
        return "0 Bytes";


    const sizes = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const index =
    Math.floor(
        Math.log(bytes) /
        Math.log(1024)
    );


    return (
        Math.round(
            bytes /
            Math.pow(1024,index)
        )
        +
        " "
        +
        sizes[index]
    );

}




// =======================
// Тип файла
// =======================


function getFileType(file){


    const extension =
    file.name
    .split(".")
    .pop()
    .toUpperCase();


    const types = {

        PDF:"PDF документ",

        DOC:"Microsoft Word",

        DOCX:"Microsoft Word",

        JPG:"Изображение JPEG",

        JPEG:"Изображение JPEG",

        PNG:"Изображение PNG",

        WEBP:"Изображение WEBP"

    };


    return (
        types[extension]
        ||
        "Неизвестный формат"
    );

}



// =======================
// Тема
// =======================


let darkMode = true;



themeButton.addEventListener(
    "click",
    ()=>{


        darkMode =
        !darkMode;


        if(darkMode){


            document.body.style.background =
            "linear-gradient(135deg,#020617,#1e1b4b)";


            themeButton.textContent =
            "🌙";


        }

        else{


            document.body.style.background =
            "linear-gradient(135deg,#e2e8f0,#ffffff)";


            document.body.style.color =
            "#111827";


            themeButton.textContent =
            "☀️";


        }


    }
);



// =======================
// Кнопка конвертации
// =======================


const convertButton =
document.querySelector(
    ".convert-button"
);
const convertButton =
document.getElementById(
    "convertButton"
);


const preview =
document.getElementById(
    "preview"
);



convertButton.addEventListener(
"click",
async ()=>{


if(!currentFile){

alert(
"Выберите файл"
);

return;

}



const extension =
currentFile.name
.split(".")
.pop()
.toLowerCase();



if(
extension === "jpg" ||
extension === "jpeg" ||
extension === "png"
){

await imageToPDF(currentFile);

}



else if(extension === "pdf"){

await pdfToImage(currentFile);

}







});





// =================
// IMAGE -> PDF
// =================


async function imageToPDF(file){


const bytes =
await file.arrayBuffer();


const pdf =
await PDFLib.PDFDocument.create();



const image =
file.type === "image/png"

?

await pdf.embedPng(bytes)

:

await pdf.embedJpg(bytes);



const page =
pdf.addPage();



const size =
image.scale(1);



page.drawImage(
image,
{

x:50,

y:50,

width:
size.width,

height:
size.height

}

);



const result =
await pdf.save();



saveAs(
new Blob(
[result],
{
type:
"application/pdf"
}
),
"converted.pdf"
);



}





// =================
// PDF -> IMAGE
// =================


async function pdfToImage(file){


const data =
await file.arrayBuffer();


const pdf =
await pdfjsLib
.getDocument(
{
data
}
)
.promise;



const page =
await pdf.getPage(1);



const viewport =
page.getViewport(
{
scale:2
}
);



const canvas =
document.createElement(
"canvas"
);



const context =
canvas.getContext(
"2d"
);



canvas.width =
viewport.width;


canvas.height =
viewport.height;



await page.render({

canvasContext:
context,

viewport

}).promise;



canvas.toBlob(
(blob)=>{


saveAs(
blob,
"page.png"
);


}
);



preview.innerHTML="";


preview.appendChild(
canvas
);



}

// =================
// DOCX -> PDF
// =================


async function docxToPDF(file){


const arrayBuffer =
await file.arrayBuffer();



const result =
await mammoth.extractRawText(
{
arrayBuffer
}
);



const text =
result.value;



const pdf =
await PDFLib.PDFDocument.create();



let page =
pdf.addPage();



const fontSize = 14;


let y =
750;



const lines =
text.split("\n");



for(
const line of lines
){


if(y < 50){

page =
pdf.addPage();

y =
750;

}



page.drawText(
line.substring(0,90),
{

x:50,

y:y,

size:
fontSize

}

);


y -= 20;


}



const bytes =
await pdf.save();



saveAs(

new Blob(
[
bytes
],
{
type:
"application/pdf"
}
),

"document.pdf"

);



}
// =======================
// Несколько файлов
// =======================


function handleMultipleFiles(files){


if(files.length > 1){

alert(
"Выбрано файлов: "
+
files.length
);


}


handleFile(
files[0]
);


}// =======================
// MERGE PDF
// =======================


document
.getElementById("mergePDF")
.addEventListener(
"click",
async function(){


if(!fileInput.files.length){

alert(
"Выберите PDF файлы"
);

return;

}


const mergedPDF =
await PDFLib.PDFDocument.create();



for(
const file of fileInput.files
){


const bytes =
await file.arrayBuffer();



const pdf =
await PDFLib.PDFDocument.load(
bytes
);



const pages =
await mergedPDF.copyPages(
pdf,
pdf.getPageIndices()
);



pages.forEach(
(page)=>
mergedPDF.addPage(page)
);


}



const result =
await mergedPDF.save();



saveAs(

new Blob(
[result],
{
type:
"application/pdf"
}
),

"merged.pdf"

);



});

// PWA

if(
"serviceWorker" in navigator
){

navigator.serviceWorker.register(
"service-worker.js"
);

}

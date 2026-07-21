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

            handleFile(this.files[0]);

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



convertButton.addEventListener(
    "click",
    ()=>{


        if(!currentFile){

            alert(
                "Сначала выберите файл"
            );

            return;

        }



        alert(
            "Конвертация будет добавлена в следующей версии 🚀"
        );


    }
);

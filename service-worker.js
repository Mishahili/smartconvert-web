const CACHE_NAME =
"smartconvert-v1";


const FILES = [

"/smartconvert/",

"/smartconvert/index.html",

"/smartconvert/style.css",

"/smartconvert/script.js"

];



self.addEventListener(
"install",
event=>{


event.waitUntil(

caches.open(
CACHE_NAME
)
.then(
cache=>
cache.addAll(FILES)
)

);


});



self.addEventListener(
"fetch",
event=>{


event.respondWith(

caches.match(
event.request
)
.then(
response=>
response ||
fetch(event.request)

)

);


});

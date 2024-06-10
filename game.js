var a_vw = window.innerWidth/100;
var a_vh = window.innerHeight/100;

var gamecanvas = document.getElementById("canvas"),
    ctx = gamecanvas.getContext("2d");

gamecanvas.width  = window.innerWidth;
gamecanvas.height = window.innerHeight;
ctx.strokeRect(10,10, 230,100);
ctx.font = '16px serif';
ctx.fillText('The canvas is the blue', 30, 30);
ctx.fillText('background color seen here.', 30, 50);
ctx.fillText('It will resize if the window', 30, 70);
ctx.fillText('size is adjusted.', 30, 90);
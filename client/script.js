var canvas = document.createElement("canvas");
canvas.id = "ctx";
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');



canvas.width = parseInt(window.getComputedStyle(canvas).width.substring(0, window.getComputedStyle(canvas).width.length - 2));
canvas.height = parseInt(window.getComputedStyle(canvas).height.substring(0, window.getComputedStyle(canvas).height.length - 2));


var socket = io();
var displayPack = [];

socket.on('positionPacket', function(data) {
    displayPack = data;

})

document.onkeydown = function(event) {
    if (event.keyCode === 68){
        socket.emit('keyPress',{inputId:'right',state:true});}
    else if (event.keyCode === 83){
        socket.emit('keyPress',{inputId:'down',state:true});}
    else if (event.keyCode === 65){
        socket.emit('keyPress',{inputId:'left',state:true});}
    else if (event.keyCode === 87){
        socket.emit('keyPress',{inputId:'up',state:true});}
}
document.onkeyup = function(event) {
    if (event.keyCode === 68){
        socket.emit('keyPress',{inputId:'right',state:false});}
    else if (event.keyCode === 83){
        socket.emit('keyPress',{inputId:'down',state:false});}
    else if (event.keyCode === 65){
        socket.emit('keyPress',{inputId:'left',state:false});}
    else if (event.keyCode === 87){
        socket.emit('keyPress',{inputId:'up',state:false});}
}
function gameLoop(){

    canvas.width = parseInt(window.getComputedStyle(canvas).width.substring(0, window.getComputedStyle(canvas).width.length - 2));
    canvas.height = parseInt(window.getComputedStyle(canvas).height.substring(0, window.getComputedStyle(canvas).height.length - 2));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i in displayPack){
        ctx.save();
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(displayPack[i].x,displayPack[i].y,50,50)
        ctx.restore();
    }
    requestAnimationFrame(gameLoop);
}
gameLoop();

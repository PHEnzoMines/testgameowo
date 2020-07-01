
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(80);
console.log("Server Started!");

var SOCKET_LIST = {};
var PLAYER_LIST = {};
var UUID_LIST = [];

var Player = function(id){
    var self = {
         x:0,
         y:0,
         id:id,
         Right:false,
         Left:false,
         Up:false,
         Down:false,
         maxSpd:10
    }
    self.updatePosition = function() {
        if(self.Right)
            self.x += self.maxSpd;
        else if (self.Left)
            self.x -= self.maxSpd;
        if(self.Up)
            self.y -= self.maxSpd;
        else if (self.Down)
            self.y += self.maxSpd;
    }
    return self;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = getRandomInt(100000000,999999999);
    while(UUID_LIST.indexOf(socket.id) >= 0){
        socket.id = getRandomInt(100000000,999999999);
    }
    UUID_LIST.push(socket.id);
    SOCKET_LIST[socket.id] = socket;

    var player = Player(socket.id);
    PLAYER_LIST[socket.id] = player;
    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
        removeItemOnce(UUID_LIST, socket.id);
    });
    socket.on('keyPress', function(data){
        if(data.inputId === 'left')
            player.Left = data.state;
        else if(data.inputId === 'right')
            player.Right = data.state;
        if(data.inputId === 'up')
            player.Up = data.state;
        else if(data.inputId === 'down')
            player.Down = data.state;
    });

});

setInterval(function() {
    packet = [];
    for(var i in PLAYER_LIST){
        var player = PLAYER_LIST[i];
        player.updatePosition();
        packet.push({
            x:player.x,
            y:player.y
        });
    }
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i]
        socket.emit('positionPacket', packet);
    }

},1000/30);

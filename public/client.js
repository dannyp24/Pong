document.addEventListener("DOMContentLoaded", function() {
   // get canvas element and create context
   var socket  = io.connect();
   var height = window.innerHeight;
   var width = window.innerWidth;
   height = Number(height);
   width = Number(width);
   var canvas = document.getElementById("canvas");
   var ctx = canvas.getContext("2d");

   var room;


   // ask for name, if joining or creating

   var jc = prompt("Would you like to 1. Join or 2. Create?");

   //if 1, join and ask for room :: if 2, create their room
   if(jc == "1"){
     var whichroom = prompt("What room?");
     var name = prompt("What is your name?");
     while(name.length < 2 || name.length > 20){
       name = prompt("Too long or too short, try again:");
     }
     socket.emit('join', {room:whichroom, name:name, width:width});
     socket.emit('getusers', {room:whichroom});
     socket.on('sendusers', function(data){
       player = data.users+1;
     });
     room = whichroom;
   }
   else if(jc == "2"){
     name = "";
     player = 1;
     socket.emit('openrooms');
     socket.on('openrooms', function(data){
       room = data.open;
       socket.emit('create', {room:data.open, name:name});
       socket.emit('join', {room:data.open, player:player, name:name});
     });
   }
var joinedcount = 0;
socket.on('joined', function(){
  joinedcount++;
  //if(player==1 && joinedcount == 1){}
  alert("Your room is "+room);

});

playerwidth = width/100;
playerheight = height/4;

p1y = height/2;
p2y = height/2;

socket.on('start', function(data){
  ctx.beginPath();
  ctx.fillStyle = "#ffffff";
  ctx.rect(20, 20, 100, 50);
  ctx.rect(width+(playerwidth/2), p1y, playerheight, playerwidth);
  ctx.fill();
  ctx.closePath();
});




});

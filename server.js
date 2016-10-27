var express = require('express'),
    app = express(),
    http = require('http'),
    io = require('socket.io');
var server = http.createServer(app);
var io = io.listen(server);
var rooms = [];
var users = 0;
var roomusers = [];
var newroomcreate;
//all possible characters for a room (no lowercase L or uppercase i: they look the same)
var possible = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789";
var text = '';
var ntext = '';



// function to generate random room
function randomRoom(length){
  for (var i =0; i<length; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  ntext = text;
  text = '';
  return ntext;
}


// begin server
server.listen(8080);
console.log("Running on port 8080");
// call public files to express
app.use(express.static(__dirname + '/public'));

//when user connects,
io.sockets.on('connection', function(socket){
  // PRELIM
  //
  //
  users++;
  console.log('Connection. Now ' + users + ' users');
  socket.on('openrooms', function(){
    newroomcreate = randomRoom(6);
    for(i in rooms){
    while(i==newroomcreate){
    newroomcreate = randomRoom(6);
  }
}
    socket.emit('openrooms', {open:newroomcreate});
  });
  socket.on('create', function(data){
    rooms.push(data.room);
    roomusers.push(0);
    console.log("Creating: "+data.room);
  });

  socket.on('join', function(data){
    console.log(data.width);
    if(!isNaN(roomusers[rooms.indexOf(data.room)])){
    socket.join(data.room);
    io.sockets.to(data.room).emit('joined', {room:data.room});
    roomusers[rooms.indexOf(data.room)] = roomusers[rooms.indexOf(data.room)]+1;

    console.log("Joining: "+data.room);
    console.log("Now " + roomusers[rooms.indexOf(data.room)] + " users in " + data.room);
    //once two users are in the room
    /*if(roomusers[rooms.indexOf(data.room)] == 2){
      io.sockets.to(data.room).emit('twousers');
      atwousers = true;
    }*/
    console.log(roomusers[rooms.indexOf(data.room)]);
    if(roomusers[rooms.indexOf(data.room)] == 2){
      console.log('worked');
      io.sockets.to(data.room).emit('start', {room:data.room});
    }
    socket.emit('joined');
  }
  else{
    socket.emit('notroom', {room:data.room});
  }
  });

  socket.on('getusers', function(data){
    socket.emit('sendusers', {users: roomusers[rooms.indexOf(data.room)]});
  });
  socket.on('disconnect', function(socket){
    users--;
    console.log('Disconnect. Now '+users+' users');
  });
});

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var line_history = [];
var users= [];

app.use(express.static(path.join(__dirname,"/")));

app.get('/',function (req, res) {
  res.sendFile(__dirname+'/index.html');
});

io.on('connection', function(cliente) {

  for (var i in line_history) {
     cliente.emit('draw_line', { line: line_history[i].line, color: line_history[i].color} );
  }

  cliente.on('login',function(user) {
    cliente.user=user;
    users.push(user);
    cliente.position=users.length;
    io.emit('login',user);
  })

  cliente.on('chat mensaje',function(msg,user,color) {
    io.emit('chat mensaje', msg,cliente.user,cliente.color);
  });

  cliente.on('color',function(color) {
    cliente.color=color;
  });

  cliente.on('disconnect',function() {
    if(cliente.user!=undefined){
      io.emit('salida',cliente.user);
      users.splice(cliente.position-1,1);
      io.emit('users',users);
    }
  });

  cliente.on('users',function(usuarios){
    io.emit('users',users);
  })

  cliente.on('dibujar', function (data) {
     line_history.push({line: data.line, color: cliente.color});
     io.emit('dibujar', { line: data.line, color: cliente.color});
  });

  cliente.on('delete', function(){
    io.emit('delete');
    line_history=[];
  });

});


http.listen(5000, function() {
  console.log('escuchando en 5000');
});

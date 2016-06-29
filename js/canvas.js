document.addEventListener("DOMContentLoaded", function() {

  var canvas  = document.getElementById('drawing');
  var board  = document.getElementById('board');
  var coord  = board.getBoundingClientRect();
  var context = canvas.getContext('2d');
  var width   = board.offsetWidth;
  var height  = board.offsetHeight;
  var mouse = {
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   var users=[];

   $('#btnLog').click(function(){
     var r=Math.floor(Math.random() * 254) + 1 ;
     var g=Math.floor(Math.random() * 254) + 1  ;
     var b= Math.floor(Math.random() * 254) + 1  ;
     var color="rgb("+r+","+g+","+b+")";
     user=$("#nombre").val();
     cliente.emit('color',color);
     cliente.emit('login',user);
   });

   cliente.on('login',function(user) {
     $("#name>span").remove();
     $('#name').append('<span>'+user+'</span>');
     newLogin.open();
   });

   cliente.on('salida',function(user) {
     $("#nameOut>span").remove();
     $('#nameOut').append('<span>'+user+'</span>');
     newLogout.open();
   });

   $('#delete').click(function(){
     cliente.emit('delete');
   });

   $('#usersBtn').click(function() {
     cliente.emit('users',[]);
   });

   cliente.on('delete',function(){
     context.clearRect(0, 0, canvas.width, canvas.height);
   });

   cliente.on('users',function (usuarios) {
     var users=usuarios;
     $('#listaUsuarios>li').remove();
     users.forEach(function(user) {
       $('#listaUsuarios').append('<li>'+user+'</li>');
     });
     $('#numConectados').empty();
     $('#numConectados').append(users.length);
   });

   canvas.width = width;
   canvas.height = height;

   canvas.onmousedown = function(e){ mouse.click = true; };
   canvas.onmouseup = function(e){ mouse.click = false; };

   canvas.onmousemove = function(e) {
      mouse.pos.x = e.clientX / width;
      mouse.pos.y = e.clientY / height;
      mouse.move = true;
   };

	cliente.on('dibujar', function (data) {
      var line = data.line;
      context.beginPath();
      context.lineWidth = 5;
      context.moveTo((line[0].x * width)-coord.left, (line[0].y * height)-coord.top);
      context.lineTo((line[1].x * width)-coord.left, (line[1].y * height)-coord.top);
      context.stroke();
      context.strokeStyle= data.color;
   });


   function mainLoop() {
      if (mouse.click && mouse.move && mouse.pos_prev) {
         cliente.emit('dibujar', { line: [ mouse.pos, mouse.pos_prev ] });
         mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 1);
   }

   mainLoop();
});

var cliente = io();

$('#chatForm').submit(function() {
  cliente.emit('chat mensaje',$('#m').val());
  $('#m').val('');
  return false;
});

$('#loginForm').submit(function() {
  cliente.emit('login chat',$('#name').val());
  return false;
});

cliente.on('chat mensaje', function(msg){
  $('#messages').append($('<li>').text(msg));
});

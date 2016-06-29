var cliente = io();

$('#chatFormBtn').click(function() {
  cliente.emit('chat mensaje',$('#m').val(),$('#u').val());
  $('#m').val('');
  return false;
});

cliente.on('chat mensaje', function(msg,user,color){
  if(msg.length==34){
    msg=msg.slice(0,34)+'<br/>'+msg.slice(35,(msg.length));
  }else if(msg.length>=69){
    msg=msg.slice(0,34)+'<br/>'+msg.slice(35,69)+'<br/>'+msg.slice(70,(msg.length));
  }
  // }else if(msg.length>=101){
  //   msg=msg.slice(0,34)+'<br/>'+msg.slice(35,69)+'<br>'+'<br/>'+msg.slice(70,(msg.length));
  // }
  $('#messages').prepend($('<li>').html("<strong style='color:"+color+";'>"+user+"</strong>: "+msg));
});

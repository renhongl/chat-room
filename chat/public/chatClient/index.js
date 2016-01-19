(function(){
  this.ChatRoom = {};

  ChatRoom.init = function(){

    $("#container").load("login.html",function(){
      var socket = io.connect("ws://localhost:8888");

    });
  };

  return ChatRoom;
})();

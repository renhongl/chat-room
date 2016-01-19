(function(){
  this.ChatRoom = {};

  ChatRoom.init = function(){

    $("#container").load("login.html",function(){
      var socket = io.connect("ws://localhost:8888");

      $("#login").on('click',function(){
        var userId = $("#userId").val();
        window.user = userId;
        socket.emit('login',userId);
      });

      socket.on('logSuccess',function(data){
        $("#container").empty();
        $("#container").load("room.html",function(){
          var str = "currentUser: ";
          $("#name").text(str + data);
          $("#sendButton").on('click',function(){
            var msg = $("#sendInput").val();
            socket.emit('message',window.user,msg);
          });
          socket.on('redirectToUser',function(user,msg){
            $("#msgContent").append("<p>" + user + " : " + msg + "</p>");
          });
        });
      });


    });
  };



  return ChatRoom;
})();

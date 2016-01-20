(function(){
  this.ChatRoom = {};

  ChatRoom.init = function(){

    $(".content").load("login.html",function(){
      var socket = io.connect();

      $("#login").on('click',function(){
        var userId = $("#userId").val().trim();
        if(userId === ""){
          var rand = parseInt(Math.random()*1000);
          userId = "no name" + rand;
        }
        window.user = userId;
        socket.emit('login',userId);
        $(".content").empty();
        $(".content").load("room.html",function(){
          $("#sendButton").on('click',function(){
            var msg = $("#sendInput").val();
            if(msg === ""){
              console.log("no words");
              return;
            }
            $("#sendInput").val("");
            socket.emit('message',window.user,msg);
          });
          $("#closeButton").on('click',function(){
            socket.emit('logout',window.user);
            location.reload();
          });
        });
      });

      socket.on('logSuccess',function(onlineUser,onlineCount){
        var str = "online: ";
        $(".title").text(str + onlineUser + "(total:" + onlineCount + ")");
      });

      socket.on('redirectToUser',function(user,msg){
        var time = new Date();
        var hh = time.getHours();
        var mm = time.getMinutes();
        var ss = time.getSeconds();
        var showTime = hh + ":" + mm + ":" + ss;
        var message = "<div class='showMsg'>"+  msg + "&nbsp;(" + showTime + ")&nbsp;" +"</div>";
        var name = "<div class='user'>" + user + "</div>";
        if(user === window.user){
          $("#msgContent").append("<div class='self'>" + message + name + "</div>");
        }else{
          $("#msgContent").append("<div class='another " + user + "'>" + name + message + "</div>");
          if(user === "System"){
            $("." + user).css("color","red");
          }
        }
      });


    });
  };


  return ChatRoom;
})();

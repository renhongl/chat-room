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
        console.log($("#msgContent").scrollTop());
        $("#msgContent").scrollTop($("#msgContent").scrollTop() + 1);
        var time = new Date();
        var hh = time.getHours();
        var mm = time.getMinutes();
        var ss = time.getSeconds();
        var showTime = hh + ":" + mm + ":" + ss;
        var message = "<div class='showMsg'>"+  msg + "&nbsp;(" + showTime + ")&nbsp;" +"</div>";
        var name = "<div class='user'>" + user + "</div>";
        if(user === window.user){
          $("#msgContent").append("<div class='self " + user + "'>" + message + name + "</div>");
          $("." + user).css("color","green");
          $("." + user + " .showMsg").css("background-color","green");
          $("." + user + " .showMsg").css("border","2px solid green");
          $("." + user + " .showMsg").css("color","white");
        }else{
          $("#msgContent").append("<div class='another " + user + "'>" + name + message + "</div>");
          if(user === "System"){
            $("." + user).css("color","red");
            $("." + user + " .showMsg").css("background-color","red");
            $("." + user + " .showMsg").css("color","white");
            $("." + user + " .showMsg").css("border","2px solid red");
          }else{
            $("." + user).css("color","#3071A9");
            $("." + user + " .showMsg").css("background-color","#3071A9");
            $("." + user + " .showMsg").css("border","2px solid #3071A9");
            $("." + user + " .showMsg").css("color","white");
          }
        }
      });


    });
  };


  return ChatRoom;
})();

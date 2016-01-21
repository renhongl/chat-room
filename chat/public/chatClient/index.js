(function(){
  this.ChatRoom = {};

  ChatRoom.init = function(){

    $(".content").load("login.html",function(){
      var socket = io.connect();

      $("#login").on('click',function(){
        var userId = $("#userId").val().trim();
        if(userId === ""){
          var rand = parseInt(Math.random()*1000);
          userId = "随机" + rand;
        }
        window.user = userId;
        socket.emit('login',userId);
        $(".content").empty();
        $(".content").load("room.html",function(){
          $("#sendButton").on('click',function(){
            var msg = $("#sendInput").val().trim();
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
          document.onkeypress = function(e){
            if(e.keyCode === 13){
              var msg = $("#sendInput").val().trim();
              if(msg === ""){
                console.log("no words");
                return;
              }
              $("#sendInput").val("");
              socket.emit('message',window.user,msg);
            }
          };
          setInterval(function(){
            var text = $("#sendInput").val().trim();
            if(text === ""){
              $("#sendButton").css("background-color","white");
              $("#sendButton").css("border-color","gray");
              $("#sendButton").css("color","gray");
            }else{
              $("#sendButton").css("background-color","#3071A9");
              $("#sendButton").css("border-color","#3071A9");
              $("#sendButton").css("color","white");
            }
          },100);
        });
      });

      socket.on('logSuccess',function(onlineUser,onlineCount){
        var str = "在线(" +  (onlineCount+1) + ") : ";
        $(".title").text(str + onlineUser);
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
          $("." + user).css("color","#4bb349");
          $("." + user + " .showMsg").css("background-color","#4bb349");
          $("." + user + " .showMsg").css("border","2px solid #4bb349");
          $("." + user + " .showMsg").css("color","white");
        }else{
          var myAudio = document.getElementById("myAudio");
          if(myAudio !== null){
            myAudio.play();
          }
          $("#msgContent").append("<div class='another " + user + "'>" + name + message + "</div>");
          if(user === "系统消息"){
            $("." + user).css("color","#e9578c");
            $("." + user + " .showMsg").css("background-color","#e9578c");
            $("." + user + " .showMsg").css("color","white");
            $("." + user + " .showMsg").css("border","2px solid #e9578c");
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

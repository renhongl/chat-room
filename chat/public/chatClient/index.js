(function(){
  this.ChatRoom = {};

  ChatRoom.init = function(){

    $(".content").load("login.html",function(){

      var socket = io.connect();

      $("#login").on('click',function(){
        var userId = $("#userId").val().trim();
        if(userId === ""){
          var rand = parseInt(Math.random()*1000);
          userId = "未命名" + rand;
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
        });
      });

      socket.on('logSuccess',function(data){
        var str = "在线: ";
        $(".title").text(str + data);
        //$(".title").append('<button style="height:20px;" type="submit" class="btn btn-primary">退出</button>');
      });

      socket.on('redirectToUser',function(user,msg){
        var time = new Date();
        var hh = time.getHours();
        var mm = time.getMinutes();
        var ss = time.getSeconds();
        var showTime = hh + ":" + mm + ":" + ss;
        msg = "<div class='showMsg'>"+  msg + "&nbsp;(" + showTime + ")&nbsp;" +"</div>";
        var name = "<div class='user'>" + user + "</div>";
        if(user === window.user){
          $("#msgContent").append("<div class='self'>" + msg + name + "</div>");
        }else{
          $("#msgContent").append("<div class='another'>" + name + msg + "</div>");
          if(user === "System"){
            $(".user").css("color","red");
          }
        }
      });




    });
  };



  return ChatRoom;
})();

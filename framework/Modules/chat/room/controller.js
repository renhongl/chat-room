(function(){
  define(function(){
    var Room = Spine.Class.sub({
      init : function(){
        renderTree();
      }
    });

    function renderTree(){
      $(".controller").empty();
      $(".controller").load("Modules/chat/room/view.html",function(){
        console.log("load room");
        //refreshNumber();
        toChat();
      });
    }

    function refreshNumber(){
      setInterval(function(){
        $.ajax({
          url : "http://localhost:8888/queryNumber",
          type : "get",
          success : function(result){
            $("#showName").text("CurrentPeople: " + result[0].number);
          },
          error : function(err){
            debugger;
          }
        });
      },1000);
    }

    function toChat(){
      var to = $(this).text();
      $(".room").append('<div id="content"><div id="recorde"></div><div id="sendDiv"><input type="text" class="form-control input-sm" id="sendWords"><button id="send" class="btn btn-info" type="login">send</button></div></div>');
      require(['ws'],function(ws){
        var socket = ws.connect();
        $("#send").on('click',function(){
          var words = $("#sendWords").val();
          $("#sendWords").val("");
          socket.emit('send',words,window.user);
        });
        socket.on("showMsg",function(data,name){
          var time = new Date();
          var hh = time.getHours();
          var mm = time.getMinutes();
          var ss = time.getSeconds();
          var timeStr = hh + ":" + mm + ":" + ss;
          if(window.user === name){
            $("#recorde").append("<p class='time'>"+timeStr+"</p><div class='self'><span class='selfWords'>"+data + "</span> <span class='selfName'>&nbsp;" +name+"&nbsp;</span></div>");
          }else{
            $("#recorde").append("<p class='time'>"+timeStr+"</p><div class='another'><span class='anotherName'>&nbsp;"+name + "&nbsp;</span> <span class='anotherWords'>" +data+"</span></div>");
          }
        });
      });
    }

    return Room;
  });
})();

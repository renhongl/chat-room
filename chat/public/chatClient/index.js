(function(){

  var socket = io.connect();
  var touchThread = null;
  var clickClose = false;
  var offset = 1000;
  var nameGroup = ['小龙女','杨过','周芷若','赵敏','白娘子','许仙','杨不悔','张三丰','萧峰','段誉','虚竹'];
  var haveUser = [];
  var userId = "";
  var createTimes = 0;

  this.ChatRoom = {};

  ChatRoom.init = function(){
    $(".content").load("login.html",function(){
      $("button").focus(function(){this.blur()});
      loginAddEvent();
      addSocketEvent();
    });
  };

  function selfStyle(user,name,message){
    $("#msgContent").append("<div class='self " + user + "'>" + name + message + "</div>");
    $("." + user).css("color","#4bb349");
    $("." + user + " .showMsg").css("background-color","#4bb349");
    $("." + user + " .showMsg").css("border","2px solid #4bb349");
    $("." + user + " .showMsg").css("color","white");
  }

  function systemStyle(user,name,message){
    $("#msgContent").append("<div class='another " + user + "'>" + name + message + "</div>");
    $("." + user).css("color","#e9578c");
    $("." + user + " .showMsg").css("background-color","#e9578c");
    $("." + user + " .showMsg").css("color","white");
    $("." + user + " .showMsg").css("border","2px solid #e9578c");
  }

  function anotherStyle(user,name,message){
    $("#msgContent").append("<div class='another " + user + "'>" + name + message + "</div>");
    $("." + user).css("color","#3071A9");
    $("." + user + " .showMsg").css("background-color","#3071A9");
    $("." + user + " .showMsg").css("border","2px solid #3071A9");
    $("." + user + " .showMsg").css("color","white");
  }

  function addSocketEvent(){

    socket.on('open',function(){
      setInterval(function(){
        socket.emit('refresh');
      },100);
    });

    socket.on('returnUser',function(onlineUser){
      var temp = onlineUser.join().replace(/,/g," @ ");
      $("#test").text("在线: " + temp);
    });

    socket.on('gotUser',function(onlineUser){
      haveUser = onlineUser;
      userId = $("#userId").val().trim();
      if(userId === ""){
        autoCreateName(userId);
      }else{
        var isHave = false;
        $.each(haveUser,function(i,user){
          if(user === userId){
            isHave = true;
          }
        });
        if(!isHave){
          logSuccess(userId);
        }else{
          showAlert("用户名已存在。");
        }
      }
    });

    socket.on('redirectToUser',function(user,msg){
      var showTime = getTime();
      var message = "";
      var name = "";
      if(user === window.user){
        message = "<div class='selfPop'></div><div class='showMsg selfMsg'>"+  msg + " (" + showTime + ")" +"</div>";
        name = "<div class='user selfName'>" + user + "</div>";
      }else if(user === "系统消息"){
        message = "<div class='sysPop'></div><div class='showMsg otherMsg'>"+  msg + " (" + showTime + ")" +"</div>";
        name = "<div class='user'>" + user + "</div>";
      }else{
        message = "<div class='anotherPop'></div><div class='showMsg otherMsg'>"+  msg + " (" + showTime + ")" +"</div>";
        name = "<div class='user'>" + user + "</div>";
      }
      if(user === window.user){
        selfStyle(user,name,message);
      }else if(user === "系统消息"){
        playAudio();
        systemStyle(user,name,message);
      }else{
        playAudio();
        anotherStyle(user,name,message);
      }
      if($("#msgContent").length !== 0){
        $("#msgContent").animate({scrollTop: $('#msgContent').offset().top + offset}, 1000);
        offset = offset + 1000;
      }
    });
  }

  function autoCreateName(userId){
    var isHave = false;
    var number = parseInt(Math.random() * (nameGroup.length));
    var autoId = nameGroup[number];
    $.each(haveUser,function(i,user){
      if(autoId === user){
        isHave = true;
      }
    });
    if(!isHave){
      console.log("no:....",autoId);
      userId = autoId;
      logSuccess(userId);
    }else{
      createTimes++;
      if(createTimes > 50){
        showAlert("由于人数过多，系统无法自动创建用户名。");
        return;
      }
      console.log("have:....",autoId);
      autoCreateName(userId);
    }
  }

  function showAlert(msg){
    var msgDiv = '提示: ' + msg;
    $("#alertMsg").text(msgDiv);
    $("#alertMsg").slideDown(1000);
    setTimeout(function(){
      $("#alertMsg").slideUp(1000);
    },5000);
  }

  function logSuccess(userId){
    window.user = userId;
    socket.emit('login',userId);
    $(".content").empty();
    $(".content").load("room.html",function(){
      roomAddEvent();
      listenSendText();
    });
  }

  function loginAddEvent(){
    $("#login").on('click',function(){
      socket.emit('getUser');
    });
  }

  function roomAddEvent(){

    for(var i = 1; i < 25; i++){
      $("#imageStore").append("<img class='faceImage' width='50' height='50' src='face/" + i + ".gif'>");
    }

    $(".faceImage").on('click',function(){
      var src = $(this).attr("src");
      $("#sendInput").val("<img class='sendImage' src='" + src + "'>");
      $("#sendButton").click();
      $("#imageStore").fadeOut();
    });

    $("#sendButton").on('click',function(){
      var msg = $("#sendInput").val().trim();
      if(msg === "" || msg.length > 1000){
        console.log("no words or too long");
        return;
      }
      $("#sendInput").val("");
      socket.emit('message',window.user,msg);
    });

    $("#closeButton").on('click',function(){
      clickClose = true;
      socket.emit('logout',window.user);
      location.reload();
    });

    document.onkeypress = function(e){
      if(e.keyCode === 13){
        e.preventDefault();
        var msg = $("#sendInput").val().trim();
        if(msg === "" || msg.length > 1000){
          console.log("no words or too long");
          return;
        }
        $("#sendInput").val("");
        socket.emit('message',window.user,msg);
      }
    };

    window.onbeforeunload = function() {
      if(!clickClose){
        socket.emit('logout',window.user);
      }
    };

    $("#imageButton").on('click',function(){
      $("#imageStore").fadeToggle();
      $("#fontSetting").fadeOut();
      $("#musiceSetting").fadeOut();
      $("#settings").fadeOut();
    });

    $("#fontButton").on('click',function(){
      $("#imageStore").fadeOut();
      $("#fontSetting").fadeToggle();
      $("#musiceSetting").fadeOut();
      $("#settings").fadeOut();
    });

    $("#musicButton").on('click',function(){
      $("#imageStore").fadeOut();
      $("#fontSetting").fadeOut();
      $("#musiceSetting").fadeToggle();
      $("#settings").fadeOut();
    });

    $("#settingButton").on('click',function(){
      $("#imageStore").fadeOut();
      $("#fontSetting").fadeOut();
      $("#musiceSetting").fadeOut();
      $("#settings").fadeToggle();
    });

    $("#sendInput").on('click',function(){
      $("#imageStore").fadeOut();
      $("#fontSetting").fadeOut();
      $("#musiceSetting").fadeOut();
      $("#settings").fadeOut();
    });

    $("#fontSetting").load("fontList.html",function(){
      var fontThread = null;
      var familyThread = null;
      var value = 0;
      var family = "";
      $("#fontList a").on('click',function(){
        if(fontThread !== null){
          clearInterval(fontThread);
        }
        value = $(this).text();
        $("#listButton").html(value + '&nbsp;<span class="caret"></span>');
        setInterval(function(){
          $(".selfMsg").css("font-size",value + "px");
        },100);
      });
      $("#fontFamily a").on('click',function(){
        if(familyThread !== null){
          clearInterval(familyThread);
        }
        family = $(this).text();
        $("#familyButton").html(family + '&nbsp;<span class="caret"></span>');
        setInterval(function(){
          $(".selfMsg").css("font-family",family);
        },100);
      });
      $("button").focus(function(){this.blur()});
    });

    $("#settings").load("setting.html",function(){
      for( var i = 1; i < 14; i++){
        $("#backStore").append('<img width="50" height="50" src="images/' + i + '.jpg">');
      }
      $("#backStore img").css("margin","5px");
      $("#backStore img").on('click',function(){
        var src = $(this).attr("src");
        $(".container").css("background-image","url(" + src + ")");
      });
      $('#backPicker').colpick({
          flat:true,
          layout:'hex',
          submit:0
      });
      $("#submitTheme").on('click',function(){
        var color = $(".colpick_hex_field input").val();
        console.log(color);
        $(".title").css("background-color","#" + color);
        $(".title").css("border","1px solid #" + color);
        $("#inputDiv").css("background-color","#" + color);
        $("#sendInput").css("background-color","#" + color);
        $(".content").css("border","1px solid #" + color);
        $("#settings").fadeOut();
      });
      $("#cancelTheme").on('click',function(){
        $("#settings").fadeOut();
      });
      $("button").focus(function(){this.blur()});
    });

    $("#musiceSetting").load("musicList.html",function(){
      for( var i = 1; i < 3; i++){
        $("#musicList").append('<span class="musicList">' + i + '</span>');
      }
      $(".musicList").on('click',function(){
        var myAudio = document.getElementById("musicAudio");
        var src = $(this).text();
        $(myAudio).attr("src","playMusic/" + src + ".mp3");
        myAudio.play();
      });
      $("#pausePlay").on('click',function(){
        var myAudio = document.getElementById("musicAudio");
        myAudio.pause();
      });
      $("button").focus(function(){this.blur()});
    });

    $(".container").css("background-image","url(images/13.jpg)");
    $("button").focus(function(){this.blur()});
  }

  function listenSendText(){
    if($("#sendInput").length !== 0){
      setInterval(function(){
        var text = $("#sendInput").val().trim();
        if(text === ""){
          $("#sendButton").removeClass("canSend");
          $("#sendButton").css("background-color","white");
          $("#sendButton").css("border-color","gray");
          $("#sendButton").css("color","gray");
        }else{
          $("#sendButton").css("background-color","#428BCA");
          $("#sendButton").css("border-color","#428BCA");
          $("#sendButton").css("color","white");
        }
      },100);
    }
  }

  function getTime(){
    var time = new Date();
    var hh = time.getHours();
    var mm = time.getMinutes();
    var ss = time.getSeconds();
    return formatTime(hh) + ":" + formatTime(mm) + ":" + formatTime(ss);
  }

  function formatTime(time){
    if(time < 10){
      time = "0" + time;
    }
    return time;
  }

  function playAudio(){
    var myAudio = document.getElementById("myAudio");
    if(myAudio !== null){
      myAudio.play();
    }
  }


  return ChatRoom;
})();


(function(){
  var express = require('express');
  var app = express();
  var server;
  var numberGroup = [];

  initServer();

  function initServer(){
    createServer();
    getRequest();
    createWs();
  }

  function createWs(){
    var io = require('socket.io').listen(server);
    var onlineUser = [];
    var onlineCount = 0;
    var oneGroup = [];
    io.on('connection',function(socket){
      console.log("a user connected.");
      socket.emit('open');

      socket.on('getUser',function(){
        socket.emit('gotUser',onlineUser);
      });

      socket.on('sendGeo',function(one){
        var isHave = false;
        for(var i = 0; i < oneGroup.length; i++){
          if(oneGroup[i].name === one.name){
            isHave = true;
          }
        }
        if(!isHave){
          oneGroup.push(one);
        }else{
          for(var j = 0; j < oneGroup.length; j++){
            if(oneGroup[j].name === one.name){
              oneGroup[j].geo = one.geo;
            }
          }
        }
        io.sockets.emit('newCome',oneGroup);
      });

      socket.on('refresh',function(){
        socket.emit('returnUser',onlineUser);
      });

      socket.on('login',function(userId){
        console.log(userId + ": login.");
        onlineUser.push(userId);
        onlineCount += 1;
        io.sockets.emit('redirectToUser',"系统消息",userId + " 加入房间");
      });

      socket.on('logout',function(user){
        console.log(user + "logout");
        onlineCount -= 1;
        onlineUser.splice(onlineUser.indexOf(user),1);
        for(var i = 0; i < oneGroup.length; i++){
          if(oneGroup[i].name === user){
            oneGroup.splice(i,1);
          }
        }
        console.log(onlineUser);
        io.sockets.emit('redirectToUser',"系统消息",user + " 退出房间");
      });

      socket.on('message',function(user,msg){
        io.sockets.emit('redirectToUser',user,msg);
      });
    });
  }

  function createServer(){
    server = app.listen(8888,function(){
      var host = server.address().address;
      var port = server.address().port;
      console.log(host + ":" + port + " listening......");
    });
  }

  function getRequest(){
    app.use(express.static('public'));

    app.get('/',function(req,res){
      res.end("welcome,this is chat server.");
    });
  }
})();

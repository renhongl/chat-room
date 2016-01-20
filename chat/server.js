
(function(){
  var express = require('express');
  var app = express();
  var server;

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
    io.on('connection',function(socket){
      console.log("a user connected.");
      socket.on('login',function(userId){
        console.log(userId + ": login.");
        onlineUser.push(userId);
        io.sockets.emit('redirectToUser',"System",userId + "加入了房间。");
        io.sockets.emit('logSuccess',onlineUser);
      });
      socket.on('logout',function(){

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

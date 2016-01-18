(function(){
  define(function(){

    var conf = {};

    var Clock = Spine.Class.sub({
      init : function(){
        renderTree();
      }
    });

    function renderTree(){
      $("#clock").load("Modules/clock/view.html",function(){
        console.log("load clock");
        initClock();
      });
    }

    function initClock(){
      conf.canvas = document.getElementById('clockCanvas');
      conf.context = conf.canvas.getContext('2d');
      conf.radius = conf.canvas.width/3;
      conf.fontHeight = 15;
      conf.handTruncation = conf.canvas.width/25;
      conf.hourHandTrauncation = conf.canvas.width/10;
      conf.numberSpacing = 20;
      conf.handRadius = conf.radius + conf.numberSpacing;
      var loop = setInterval(drawClock,1000);
    }

    function drawCircle(){
      conf.context.beginPath();
      conf.context.arc(conf.canvas.width/2,conf.canvas.height/2,conf.radius - 5,0,Math.PI*2,true);
      conf.context.stroke();
    }

    function drawNumber(){
      var numbers = [1,2,3,4,5,6,7,8,9,10,11,12];
      var angle = 0;
      var numberWidth = 0;
      numbers.forEach(function(number){
        angle = Math.PI/6 * (number - 3);
        numberWidth = conf.context.measureText(number).width;
        conf.context.fillText(number,conf.canvas.width/2 + Math.cos(angle) * conf.radius - numberWidth/2,conf.canvas.height/2 + Math.sin(angle) * conf.radius + 5);
      });
    }

    function drawCenter(){
      conf.context.beginPath();
      conf.context.arc(conf.canvas.width/2,conf.canvas.height/2,5,0,Math.PI * 2,true);
      conf.context.fill();
    }

    function drawHand(loc,isHour){
      var angle = (Math.PI * 2) * (loc / 60) - Math.PI / 2;
      var handRadius = isHour ? conf.radius - conf.handTruncation - conf.hourHandTrauncation : conf.radius - conf.handTruncation;
      conf.context.moveTo(conf.canvas.width/2,conf.canvas.height/2);
      conf.context.lineTo(conf.canvas.width/2 + Math.cos(angle) * handRadius,conf.canvas.height/2 + Math.sin(angle) * handRadius);
      conf.context.stroke();
    }

    function drawHands(){
      var date = new Date();
      var hour = date.getHours();
      hour = hour > 12 ? hour - 12 : hour;
      drawHand(hour * 5 + (date.getMinutes() / 60) * 5,true,0.5);
      drawHand(date.getMinutes(),false,0.5);
      drawHand(date.getSeconds(),false,0.2);
    }

    function drawClock(){
      conf.context.clearRect(0,0,conf.canvas.width,conf.canvas.height);
      drawCircle();
      drawNumber();
      drawCenter();
      drawHands();
    }

    return Clock;
  });
})();

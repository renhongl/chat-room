(function(){
  define(function(){

    var conf = {};

    var Api = Spine.Class.sub({
      init : function(){
        testApi();
      }
    });

    function testApi(){
      $("#api").load("Modules/api/view.html",function(){
        console.log('load api');
        initCanvas();
      });
    }

    function initCanvas(){
      conf.canvas = document.getElementById('apiCanvas');
      conf.context = conf.canvas.getContext('2d');
      conf.image = new Image();
      conf.image.src = "Modules/api/1.png";
      //testRect();
      //textGradient();
      // conf.image.onload = function(e){
      //   fillCanvasWithPattern();
      // }
      testArc();
    }

    function testArc(){
      conf.context.beginPath();
      conf.context.arc(300,100,30,0,Math.PI * 2,false);
      conf.context.arc(300,100,40,0,Math.PI * 2,true);
      conf.context.fill();
    }

    function fillCanvasWithPattern(){
      var pattern = conf.context.createPattern(conf.image,"repeat");
      conf.context.fillStyle = pattern;
      conf.context.fillRect(0,0,conf.canvas.width,conf.canvas.height);
      conf.context.fill();
    }

    function testRect(){
      conf.context.lineJoin = 'round';
      conf.context.lineWidth = 10;

      conf.context.font = "24px Helvetica";
      conf.context.fillText("Click anywhere to erase",175,40);

      conf.context.strokeStyle = 'goldenrod';
      conf.context.fillStyle = 'rgba(0,0,255,0.5)';

      conf.context.fillRect(100,20,100,100);
      conf.context.strokeRect(300,20,100,100);

      conf.context.canvas.onmousedown = function(e){
        conf.context.clearRect(0,0,conf.canvas.width,conf.canvas.height);
      }
    }

    function textGradient(){
      //var gradient = conf.context.createLinearGradient(0,0,conf.canvas.width,0);
      //var gradient = conf.context.createLinearGradient(0,0,0,conf.canvas.height);
      var gradient = conf.context.createRadialGradient(conf.canvas.width/2,conf.canvas.height,10,conf.canvas.width/2,0,100);
      gradient.addColorStop(0,'blue');
      gradient.addColorStop(0.25,'white');
      gradient.addColorStop(0.5,'purple');
      gradient.addColorStop(0.75,'red');
      gradient.addColorStop(1,'yellow');
      conf.context.fillStyle = gradient;
      conf.context.rect(0,0,conf.canvas.width,conf.canvas.height);
      conf.context.fill();
    }



    return Api;
  });
})();

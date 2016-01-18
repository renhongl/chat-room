(function(){
  define(function(){
    var Controller = Spine.Class.sub({
      init : function(){
        loadScripts();
      }
    });

    function loadScripts(){
      require(['angular','bootstrap','jqueryplugin','JSXTransformer','react','jqxall','less','ws'],
      function(angular,bootstrap,jqueryplugin,JSXTransformer,react,jqxall,less,ws){
        console.log("Scripts load finish.");
        renderTree();
      });
    }

    function renderTree(){
      $("#container").load("Modules/controller/view.html",function(){
        console.log("load controller");
        var host = location.host;
        window.host = "http://" + host + "/";
        require(['login','clock','api','plugin','blog','bookShop'],
        function(Login,Clock,Api,Plugin,Blog,BookShop){
          //new Clock();
          //new Api();
          new Login();
          //new Blog();
          //new BookShop();

        });
      });
    }

    return Controller;
  });
})();

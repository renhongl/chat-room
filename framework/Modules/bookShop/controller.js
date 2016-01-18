(function(){
  define(function(){
    var BookShop = Spine.Class.sub({
      init : function(){
        renderTree();
      }
    });

    function renderTree(){
      $(".controller").load("Modules/bookShop/view.html",function(){
        console.log("load bookShop");
        prompt("input name:","111");
        alert(1);
      });
    }



    return BookShop;
  });
})();

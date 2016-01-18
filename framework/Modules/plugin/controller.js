(function(){
  define(function(){
    (function($){
      $.fn.extend({
        showMsg : function(){
          $(this).append("<div>hello<div>");
        }
      });
    })(jQuery);
  });
})();

(function(){
  define(function(){
    var Blog = Spine.Class.sub({
      init : function(){
        renderTree();
      }
    });

    function renderTree(){
      $(".controller").load("Modules/blog/view.html",function(){
        $("#submitBlog").on('click',submitBlog);
      });
    }

    function submitBlog(){
      var title = $("#blogTitle").val();
      var content = $("#blogContent").val();
      $.ajax({
        url : "http://localhost:8888/submitBlog",
        type : "post",
        data : {"title":"1231"},
        success : function(result){
          console.log(result);
        },
        error : function(err){
          console.log(err);
        }
      });
    }

    return Blog;
  });
})();

(function(){
  define(function(){
    var Login = Spine.Class.sub({
      init : function(){
        renderTree();
      }
    });

    function renderTree(){
      $(".controller").load("Modules/chat/login/view.html",function(){
        console.log("load login");
        $("#login").on('click',function(){
          require(['room','user'],function(Room,User){
            var name = $("#name").val();
            var password = $("#password").val();
            $.ajax({
              url : "http://localhost:8888/queryUser?name="+ name +"&password=" + password,
              type : "get",
              success : function(result){
                if(result.length === 0){
                  alert("name or pwd is error");
                }else{
                  new User().saveName(name);
                  new Room();
                  window.friendGroup = result[0].friendGroup;
                }
              },
              error : function(err){
                debugger;
              }
            });
          });
        });
      });
    }





    return Login;
  });
})();

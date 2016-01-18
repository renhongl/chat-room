(function(){
  define(function(){
    var User = Spine.Model.sub();

    User.configure("name");

    User.include({
      saveName : function(name){
        window.user = name;
      }
    });



    return User;
  });
})();

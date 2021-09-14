$("#adminloginForm").on('submit', function(e){
  e.preventDefault(); 
  if ((document.loginform.login_pass.value).length < 8) {
      //alert("Length of the password must be minimum 8");
      document.getElementById("incorrectpass").style.display = "block";
      return false;
  }
  else if ((document.loginform.login_pass.value).length >= 8) {
    document.getElementById("incorrectpass").style.display = "none";
  }
  // console.log($("#adminloginForm").serialize())
  $.ajax({
    url:'/admin_signin',
    type:'post',
    data:$("#adminloginForm").serialize(),
    success:function(res){
      if(res==1){
        window.location.href="/vendorproducts"
      }
      else{
        $("#login").show();
      }
    },
    error:function(){
      $("#login").show();
    }
  });
});

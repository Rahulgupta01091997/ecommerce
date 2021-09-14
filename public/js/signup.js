// function signupvalidateForm(){
$("#signupForm").on('submit', function(e){
  e.preventDefault();   
  if ((document.eshopform.name.value).length < 3) {
    //alert("Please Enter a valid Name");
    document.getElementById("fullname").style.display = "block";
    return false;
  }
  else if ((document.eshopform.name.value).length >= 3) {
    document.getElementById("fullname").style.display = "none";
  }
  if ((document.eshopform.password.value).length < 8) {
      //alert("Length of the password must be minimum 8");
      document.getElementById("password").style.display = "block";
      return false;
  }
  else if ((document.eshopform.password.value).length >= 8) {
    document.getElementById("password").style.display = "none";
  }
  $.ajax({
    url:'/signup',
    type:'post',
    data:$("#signupForm").serialize(),
    success:function(res){
      if(res==1){
        window.location.href="/"
      }
      else if(res==0){
        $("#email").show();
      }
      else{
        window.location.href=res
      }
    },
    error:function(){
      $("#email").show();
    }
  });
})
// function loginvalidateForm(){
$("#signinForm").on('submit', function(e){
  e.preventDefault(); 
  if ((document.loginform.login_pass.value).length < 8) {
      //alert("Length of the password must be minimum 8");
      document.getElementById("loginpass").style.display = "block";
      return false;
  }
  $.ajax({
    url:'/signin',
    type:'post',
    data:$("#signinForm").serialize(),
    success:function(res){
      console.log(res)
      if(res==1){
        window.location.href="/"
      }
      else if(res==0){
        $("#login").show();
      }
      else{
        window.location.href=res
      }
    },
    error:function(){
      $("#login").show();
    }
  });
})
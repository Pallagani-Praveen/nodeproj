$(document).ready(()=>{
    $('#signupform').submit(()=>{
        var username = $('input[name="username"]').val();
        var pass_one = $('input[name="password1"]').val();
        var pass_two = $('input[name="password2"]').val();
        if(username.length<4 ||  (pass_one!=pass_two))
        {
            return false;
        }
        return true;
  });

});


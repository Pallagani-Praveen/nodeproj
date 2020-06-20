$(document).ready(function(){
   $('#hide').hide();
   $('#visible').show();
});


$('#customSwitch1').click(function(){
   if($(this).prop('checked')==true){
    $('input').attr('readonly',false);
    var user = $('#visible').attr('data');
    var str = user.split(',');
    $.ajax({
      type:'GET',
      dataType:'text',
      url:'http://localhost:3000/find-password?password='+str[0]+'&salt='+str[1],
      success:function(data){
         console.log(data);
         $('#passwd').attr('type','text');
         $('#passwd').val(data);
      }
   });
   }
   else{
     
      var data = $('#passwd').attr('value');
      $('#passwd').attr('type','password');
      $('#passwd').val(data);
      $('input').attr('readonly',true);
   }
});


$('form').submit((e)=>{
    e.preventDefault();

    var url = $('form').attr('action');
    var type = $('form').attr('method');
    var data = $('form').serialize();
    $.ajax({
       type:type,
       dataType:'text',
       url:'http://localhost:3000'+url+'?'+data,
       success:function(data){
         //  console.log(data);
          $('.title').html('Profile of '+data);
          $('input').attr('readonly',true);
          $('#customSwitch1').prop('checked',false);
       }

    });
});


$('#visible').on('click',function(){
   var user = $(this).attr('data');
   var str = user.split(',');
   $.ajax({
      type:'GET',
      dataType:'text',
      url:'http://localhost:3000/find-password?password='+str[0]+'&salt='+str[1],
      success:function(data){
         console.log(data);
         $('#passwd').attr('type','text');
         $('#passwd').val(data);
         $('#hide').show();
         $('#visible').hide();
      }
   });
});



$('#hide').on('click',function(){
   var data = $('#passwd').attr('value');
   $('#passwd').attr('type','password');
   $('#passwd').val(data);
   $('#visible').show();
   $('#hide').hide();
   
});


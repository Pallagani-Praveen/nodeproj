// $('#envelop_data').on('submit',(e)=>{
//     var envelop_data = $('#envelop_data').serializeArray();
//     console.log(envelop_data);
//     e.preventDefault(); 
// });




$(document).ready(function(){

    var form_fields = ['toaddress','ukey','upwd'];

    form_fields.forEach(function(item){
        $('#'+item).on('input',()=>{
            var content = $('#'+item).val();
            console.log(content);
            
            if(content.length<6){
                $('#'+item+'_small').html('<strong>Message : </strong>Entity length is too short...');
                $('#'+item+'_small').removeClass('valid');
                $('#'+item+'_small').addClass('warning');
        
                console.log('not valid');
            }
            else{
                $('#'+item+'_small').html('<strong>Message : </strong>Entity length is okay to proceed');
                $('#'+item+'_small').removeClass('warning');
                $('#'+item+'_small').addClass('valid');
            }
        });
    });

    $('#icon').click(()=>{
        var startDate = new Date('2020-06-04');
        var todayDate = new Date();
        var workingDays  = new Date(todayDate-startDate);

        $.alert({
            title:'Work Progress',
            content:'<h2>Day : '+Math.floor(workingDays/1000/60/60/24)+'</h2>'
        });
    });
});


$('#envelop_data').submit(()=>{
    var toaddress = $('#toaddress').val();
    var ukey = $('#ukey').val();
    var passwd = $('#upwd').val();
    if(toaddress==='' || ukey==='' || ukey.length <6 || toaddress.length<6){
        return false;
    }
    if (passwd === '' || passwd.length<6){
        return false;
    }
    return true;
});


$('.open_envelop').on('click',function(){
    var ObjectId = $(this).attr('data');

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'http://onetwomany.herokuapp.com/api-data?_id='+ObjectId,
        success: function(result) {
        $.alert({
            title: 'Envelop opened',
            content: '<hr><strong style="color:green"> ToAddress :</strong> '+result.toaddress +'<br>'+
            '<strong style="color:green"> Key :</strong> '+result.key +'<br>'+
            '<strong style="color:green"> Security Key :</strong> '+result.secretkey +'<hr>',
        }); 
        
        }
    });
});














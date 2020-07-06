$('#form').submit((e)=>{
    e.preventDefault();
    var url = $('#form').attr('action');
    var type = $('#form').attr('method');
    var data = $('#form').serialize();

    $.ajax({
        type:type,
        dataType:'text',
        url:'http://onetwomany.herokuapp.com'+url+'?'+data,
        success:function(data){
            console.log(data);
            $('#mul-btn').hide();
            $('#cancel').html('done');
            
        }
    });
});
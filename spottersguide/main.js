
var load_data = function() {

    $.getJSON('elite_men.json',function(data) {
        current_data = data;

        $('#data tbody, #data thead tr').html('');
        

        $.each(current_data,function(i,val) {
            if (i==0) {
                $.each(this.keys,function(i,val) {
                    $('#data thead tr').append("<th>" + val + "</th>");    
                });
                
            }
        });

    });


};

$(document).ready(function() {
   
    load_data();

    $('#data ')

});
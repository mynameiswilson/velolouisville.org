if (typeof console == "undefined") { console = { log: function(){} }}

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

var segment_ids = {
kom: [
     639393, //Alta Vista
     760503, //Pendleton Hill
     241683, //Blunk Knob
     642066,  //Cherokee Park Overlook
     773320  //Mockingbird Valley to top of Zorn
],
green: [
    773325, //Lexington Road Cycler's Cafe Sprint
    707810, //Rudy Lane Sprint
    773319, //River Road (Slugger Field to Mockingbird
    773317, //River Road (Blankenbaker to Slugger)
    745673  //Iroquois to 264
    ]
};

var urls = {
    kom:    'api.php?segments='+segment_ids.kom.join(",")+"&compid=kom",
    green:  'api.php?segments='+segment_ids.green.join(",")+"&compid=green",
};

var row_templates = {
    standings: '<tr><td>{0}.</td><td>{1}</td><td>{2}</td></tr>',
    segments:  '<tr><td>{0}</td><td>{1}&nbsp;mi.</td><td>{2}</td><td>{3}</td></tr>' 
};

var handle_data = function(data) {
    //populate SEGMENTS list
    for (var segment_id in data.segments) {
        var segment_data = data.segments[segment_id];
        //add segment to list
        $('#'+data.competition_id+'segmentsTab tbody').append(                   //add a row to SEGMENT
                row_templates.segments.format(
                    segment_data.name, 
                    ((segment_data.distance/1000)*.6).toFixed(2),
                    segment_data.averageGrade.toFixed(2)+"%", 
                    segment_data.efforts[0].athlete.name) 
                );
    }
    $.each(data.athletes,function(i,val) {
        //if (i>9 || val["points"] < 1 ) return;
        $('#'+data.competition_id+'standingsTab tbody').append(
            row_templates.standings.format(
                (i+1),
                val.name,
                val['points'])
            );
    });

    $('#loading').hide();
    $('#kom,#green').show();
}


for (var comp_url in urls) {

    //fetch SEGMENT INFOs
    $.getJSON(
        urls[comp_url],
        handle_data       
    );

}


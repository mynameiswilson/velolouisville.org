if (typeof console == "undefined") { console = { log: function(){} }}
var segments = {};
segments.kom = {};
segments.kom.list = [
                 639393, //Alta Vista
                 760503, //Pendleton Hill
                 241683, //Blunk Knob
                 642066,  //Cherokee Park Overlook
                 773320  //Mockingbird Valley to top of Zorn
                ];
segments.kom.data = {};

segments.green = {};
segments.green.list = [
    773325, //Lexington Road Cycler's Cafe Sprint
    707810, //Rudy Lane Sprint
    773319, //River Road (Slugger Field to Mockingbird
    773317, //River Road (Blankenbaker to Slugger)
    745673  //Iroquois to 264
    ];
segments.green.data = {};

var total_segments = segments.green.list.length + segments.kom.list.length;

var api_urls = {
    segment_efforts:    'jsonpass.php?url=http://app.strava.com/api/v1/segments/{0}/efforts',
    segment_info:       'jsonpass.php?url=http://app.strava.com/api/v1/segments/{0}',
    segment_search:     'jsonpass.php?url=http://app.strava.com/api/v1/segments?name={0}'
};

var athletes = [];
var athlete_skel = { kom_points: 0, green_points: 0 };
var points = [16, 8, 4, 2, 1];
var segments_processed = 0;

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

var sort_by_kom_points = function(a,b) {
    return (b.kom_points - a.kom_points);
};
var sort_by_green_points = function(a,b) {
    return (b.green_points - a.green_points);
};


var row_templates = {
    standings: '<tr><td>{0}.</td><td>{1}</td><td>{2}</td></tr>',
    segments:  '<tr><td>{0}</td><td>{1}&nbsp;mi.</td><td>{2}</td><td>{3}</td></tr>' 
};

var ready = function() {
    console.log(segments);
    //populate SEGMENTS list
    for(var comp in { kom:1,green:1 }) {            //for each competition


        for (var segment_id in segments[comp]['data']) {        //and each segment in that competition
            segment_data = segments[comp]['data'][segment_id];

            //add segment to list
            $('#'+comp+'segmentsTab tbody').append(                   //add a row to SEGMENT
                    row_templates.segments.format(
                        segment_data.name, 
                        ((segment_data.distance/1000)*.6).toFixed(2),
                        segment_data.averageGrade.toFixed(2)+"%", 
                        segment_data.efforts[0].athlete.name) 
                    );
        }

        athletes.sort(eval("sort_by_"+comp+"_points"));
        $.each(athletes,function(i,val) {
            if (i>9 || val[comp+"_points"] < 1 ) return;
            $('#'+comp+'standingsTab tbody').append(row_templates.standings.format((i+1),val.name,val[comp+'_points']));
        });
    }

    $('#loading').hide();
    $('#kom,#green').show();
}

var process_segment_info = function(segment_type,data) {

    if (!segments[segment_type].hasOwnProperty(data.segment.id)) {
        segments[segment_type]['data'][data.segment.id] = {};
    }

    $.extend(segments[segment_type]['data'][data.segment.id],data.segment);

    //fetch SEGMENT EFFORTS
    $.getJSON(
        api_urls.segment_efforts.format(data.segment.id),
        function(data) { process_segment_efforts(segment_type,data); }        
    );
    
};

var process_segment_efforts = function(segment_type,data) {
console.log(data);
    segments[segment_type]['data'][data.segment.id].efforts = data.efforts;

    $(data.efforts).each(function(i,val) {
        if (i < points.length) {

            //look to see if athlete exists
            var exists = false;
            var athlete_id = 0;
            for (p in athletes) {
                if (athletes[p].username == val.athlete.username) {
                    exists = true;
                    athlete_id = p;
                }
            }

            if (!exists) {
                athlete = {};
                $.extend(athlete,val.athlete,athlete_skel);
                athlete_id = athletes.length;
                athletes.push(athlete);
            }

            athletes[athlete_id][segment_type+"_points"] += points[i];
        }
    });

    segments_processed++;    

    $('#loading').html("<p>Loading...<br/>Segment " + segments_processed + " of " + (total_segments)+"</p>");

    if (segments_processed == total_segments) {
        ready();
    }

};


for (var segment_type in segments) {

    $.each(segments[segment_type].list,function(i,val) {

        var my_segment_type = segment_type;

        //fetch SEGMENT INFOs
        $.getJSON(
            api_urls.segment_info.format(val),
            function(data) { process_segment_info(my_segment_type,data); }        
        );

    });

}


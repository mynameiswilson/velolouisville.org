if (typeof console == "undefined") console = { log: function() {} };
var country_codes = {"AUSTRALIA":"AU","BELGIUM":"BE","CANADA":"CA","CZECH REPUBLIC":"CZ","FRANCE":"FR","GERMANY":"DE","GREAT BRITAIN":"UK","HUNGARY":"HU","ITALY":"IT","JAPAN":"JP","LUXEMBOURG":"LU","LATVIA":"LV","NETHERLANDS":"NL","NEW ZEALAND":"NZ","NORWAY":"NO","SLOVAKIA":"SK","SPAIN":"ES","SWITZERLAND":"CH","UKRAINE":"UA","UNITED STATES OF AMERICA":"US"};
var data_files = [ 'elite_men', 'elite_women' ];

function slugify(text) {
        text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
            text = text.replace(/-/gi, "_");
                text = text.replace(/\s/gi, "-");
                    return text;
}

var load_success = function(data) {
        current_data = data;

        $('#data tbody, #data thead tr').html('');
        
        $.each(current_data,function(i,val) {
            $tr = $("<tr>")
                        .addClass("main")
                        .addClass("country-"+slugify(this.Country))
                        .data("rider_id",i);

            //FIRST ROW - NAME
            $tr.append("<td><h4>" + (i+1) + ".</h4></td>");
            
            $td = $("<td/>");
            $td.attr("colspan","1");
            $td.append("<h5>" + this.FirstName + " " + this.LastName + ( (this.Reserve=="Y")?"*":"") +  "</h5>");
            $tr.append($td);

            $td = $("<td>");
            $td.append("<p class='country-label'><img src='pixel.gif' style='vertical-align:middle' class='flag " + country_codes[this.Country].toLowerCase() + "' /> "+this.Country+"</p>");
            if (this.NatlChamp == "Y") {
                $td.append("<p class='natl-champ-label'><i class='icon-flag'></i> Nat'l Champ</p>");
                $tr.addClass("natl-champ");
            }
            $tr.append($td);
            
            $('#data tbody').append($tr);


            $tr = $("<tr/>")
                        .addClass("detail")
                        .data("rider_id",i);

            // 2nd ROW, 1st COLUMN
            $td = $("<td/>").attr("colspan","2");
            if ( this.HeadImage != "") {
                $td.append("<img class='head-image' src='images/heads/" + this.HeadImage + "' />");
            }            
            $tr.append($td);
            
            // 2nd ROW, 2nd COLUMN
            $td = $("<td/>");
            if ( this.JerseyImage !="" && this.JerseyImage != null ) {
                $td.append("<img src='images/jerseys/"+this.JerseyImage+"'/>");
            }
            if (this.TradeTeam !="" && this.TradeTeam != null ) {
               $td.append("<p style='text-align:center'>"+this.TradeTeam+"</p>");
            }
            $tr.append($td);

            $('#data tbody').append($tr);
        });

};

var load_error = function(xhr,status,error) {
    console.log("ERROR: " + status + "..." + error);
};

var load_data = function(file) {

    if (file == "elite_men" || file == "elite_women" ) {
        
        $.ajax({
            dataType: "json",
            url: file + '.json',
            success: load_success,
            error: load_error
        });

        if ( file == "elite_men" ) {
            $('#notes').html("<h3>2013 UCI Cyclocross World Championships</h3><h2>Elite Men</h2><p>2:30PM EST, Feb 2 2013</p>");
        } else {

            $('#notes').html("<h3>2013 UCI Cyclocross World Championships</h3><h2>Elite Women</h2><p>11:00AM EST, Feb 2 2013</p>");
        }

    }

};

var hide_details = function() { $('#data tr.detail').hide(); };

var filter_types = ['country','natl-champ','name','team'];
var filter = function(type,query) {
    if ( $.inArray(type,filter_types) > -1 ) {

        $('#filters').html('');

        clear_filters();

        if (type == "country") {
            hide_details();
            $('#data tr:not(.country-'+slugify(current_data[query].Country)+')').hide();
        
            $a = $('<a/>').addClass("btn btn-inverse").append(current_data[query].Country + " <i class='icon-remove icon-white'></i>");
            $('#filters').append($a);
            $('#filters-container').show();
        
            track_event('Spotters Guide', 'Country Filter',current_data[query].Country);
        }

        if (type == "natl-champ") {
            hide_details();
            $('#data tr:not(.natl-champ)').hide();
        
            $a = $('<a/>').addClass("btn btn-inverse").append("National Champions <i class='icon-remove icon-white'></i>");
            $('#filters').append($a);
            $('#filters-container').show();

            track_event('Spotters Guide', 'National Champ Filter');
        }

    } else {
        console.log("filter type '" + type + "' not supported");
    }
};

var clear_filters = function() {
    $('#filters').html('');
    $('#filters-container').hide();

    $('#data tr.main').show();
};

var load_data_from_hash = function() {
    
    var data_to_load = "elite_men";
    if (window.location.hash !="") {
       if ($.inArray(window.location.hash.substr(1),data_files) > -1) {
            data_to_load = window.location.hash.substr(1);
        }
    }
    
    $('#main-nav li').removeClass("active");
    $('#main-nav a[href="#'+data_to_load+'"]').closest("li").addClass("active");

    load_data(data_to_load);

};

var track_event = function(category, action,label) {
    if ( category != "" && action != "" && label != "" ) {
        _gaq.push(['_trackEvent', category, action, label]);
    }
};

$(document).ready(function() {
    load_data_from_hash();

    $(window).on("hashchange", function() { 
        track_event('Spotters Guide', 'Nav Change', window.location.hash);
        load_data_from_hash(); 
    });
       

    $('#data').on("click touch","tr.main .country-label",function(event) {
        filter("country",$(this).closest("tr").data("rider_id"));
        event.stopPropagation();
    });

    $('#data').on("click touch","tr.main .natl-champ-label",function(event) {
        filter("natl-champ",$(this).closest("tr").data("rider_id"));
        event.stopPropagation();
    });

    $('#data').on("click", "tr.main", function() {
        var $deetz = $(this).next(".detail");
        if ( $deetz.is(":visible") ) {
            $deetz.hide();
        } else {
            hide_details();
            $deetz.show();

            track_event("Spotters Guide","Show Details",current_data[$(this).data('rider_id')].FirstName + " " + current_data[$(this).data('rider_id')].LastName);
        }
    
    });

    $('#data').on("click",".head-image",function(event) {
        $('#image-modal .lightbox-content img').attr("src",$(this).attr("src"));
        $('#image-modal .lightbox-header h4').html( current_data[$(this).closest("tr").data("rider_id")].FirstName );
        $('#image-modal').lightbox({ show: true, resizeToFit: true});
        track_event("Spotters Guide","Head Image View",current_data[$(this).closest("tr").data("rider_id")].FirstName + " " + current_data[$(this).closest("tr").data("rider_id")].LastName);
        event.stopPropagation();
    });

    $('#filters').on("click touch","a.btn", function() {
        clear_filters();
        });

});

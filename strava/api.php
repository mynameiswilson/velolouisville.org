<?php

$strava_api_urls = array(
    "segment_efforts"   =>  'http://app.strava.com/api/v1/segments/%d/efforts?best=true',
    "segment_info"      =>  'http://app.strava.com/api/v1/segments/%d',
    "segment_search"    =>  'http://app.strava.com/api/v1/segments?name=%s'
);

$response = array();

$points = array(16,8,4,2,1);

function fetch_from_api($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}

if (!empty($_GET['segments'])):
    
    $tmp = explode(",",$_GET['segments']);
    $segments_valid = true;
    foreach ($tmp as $tmpseg):
        $segments_valid = $segments_valid && is_numeric($tmpseg);
    endforeach;

    if ($segments_valid):
        $response["segments"] = array();

        $segments = $tmp;

        //FETCH info for each SEGMENT
        foreach($segments as $segment_id):
            $response['segments'][$segment_id] = array();
            
            if ( $output = fetch_from_api(sprintf($strava_api_urls['segment_info'],$segment_id)) ):
                $output = json_decode($output,true);
                $response['segments'][$segment_id] = $output['segment']; 
            else:
                //UH OH COULDn'T FETCH SEGMENT INFO
            endif;

            if ( $output = fetch_from_api(sprintf($strava_api_urls['segment_efforts'],$segment_id)) ):
                $output = json_decode($output,true);
                $response['segments'][$segment_id]['efforts'] = $output['efforts']; 
            else:
                //UH OH COULDN'T FETCH SEGMENT EFFORTS
            endif;


        endforeach;

        $response['athletes'] = array();

        foreach($response['segments'] as $segment):
            foreach($segment['efforts'] as $effort):
                $i=0;
                if ($i < sizeof($points)):
                    $exists = false;
                    $athlete_id = $effort['athlete']['id'];
                    if ( array_key_exists($effort['athlete']['id'],$response['athletes']) ):
                        $exists = true;
                        $athlete_id = $effort['athlete']['id'];
                    endif;

                    if (!$exists):
                        $response['athletes'][$athlete_id] = array_merge(array("points"=>0),$effort['athlete']);
                    endif;
                    
                    $response['athletes'][$athlete_id]['points'] += $points[$i];

                    $i++;
                endif;    
            
            endforeach;
        endforeach;

        $response['status'] = "OK";


    else:

        $response['status'] = "ERROR_INVALIDSEGMENT";
        $response['error_message'] = "Invalid segment ID";

    endif; //SEGMENTS VALID
else:
        $response['status'] = "ERROR_NOSEGMENTS";
        $response['error_message'] = "No segments passed.";

endif;

if (isset($_GET['debug'])):
?>
<textarea width="500px" height="500px">
<?php print_r($response) ?>
</textarea>
<?php else:

    header("Content-type: application/json");
    echo (isset($_GET['callback'])) ? $_GET['callback']."(" : "";
    echo json_encode($response);
    echo (isset($_GET['callback'])) ? ")" : "";
    exit;

endif; ?>

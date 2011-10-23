<?php

if (!empty($_GET['url'])):
    $url = $_GET['url'];
endif;

if (!empty($_GET['jsoncallback']) || !empty($_GET['callback'])):
    $callback = (!empty($_GET['jsoncallback'])) ? $_GET['jsoncallback'] : $_GET['callback'];
endif;


//$url = "http://app.strava.com/api/v1/segments?name=foo";

if ( $url ):
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    $output = curl_exec($ch);

    header('Content-type: application/json');
    echo (empty($callback)) ? $output : $callback."(".$output.")";
endif;
exit;
?>

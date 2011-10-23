<? $page_title = "Velo Louisville Virtual Maillot p/b Strava"; ?>
<?php include($_SERVER['DOCUMENT_ROOT']."/foundation/src/includes/_doc_head.php"); ?>
<style type="text/css">
#kom,#green { display: none }  
ul.tabs-content li.list div.row:first-child {
    font-weight: bold;
}
ul.tabs-content li.list div.row:nth-child(even) {
    background: #ccc;
}
</style>
<div class="container">
    <div class="row" id="header">
        <div class="twelve columns">    
            <h1>Velo Louisville Virtual Maillot</h1>
            <p>A points-based virtual competition for both climbing and flat-land speed.</p>
        </div>
    </div><!--/header-->

    <div class="row show-on-phones">
        <div class="twelve columns">
        <dl class="tabs mobile">
            <dd><a href="#kom">KOM Standings</a></dd>
            <dd><a href="#green">Green Standings</a></dd>
            <dd><a href="#info">About the Competition</a></dd>
        </dl>
        </div>
    </div>
    

    <div class="row" id="results">
<?php
    foreach (Array("kom","green") as $comp):
?>
        <div id="<?php echo $comp ?>" class="six columns">
            <h4><?php echo strtoupper($comp) ?> Competition</h4>

            <dl class="tabs contained">
            <dd><a class="active" href="#<?php echo $comp ?>standings">Standings</a></dd>
            <dd><a href="#<?php echo $comp ?>segments">Segments</a></dd>
            </dl>

            <ul class="tabs-content contained">
            <li class="active" id="<?php echo $comp ?>standingsTab" class="list">
                <table>
                    <thead><th>#</th><th>Rider</th><th>Points</th></thead>
                    <tbody></tbody>
                </table>
            </li>
            <li id="<?php echo $comp ?>segmentsTab" class="list">
                <table>
                    <thead>
                    <th>Segment</th>
                    <th>Dist</th>
                    <th>Grade</th>
                    <th>Leader</th>
                    </thead>
                    <tbody></tbody>
                </table>
            </li>
            </ul>
            
        </div>
<?php
    endforeach;
?>

        <div id="loading" class="twelve columns">
            <p>Loading...</p>
        </div>


    </div><!--/results-->

    <div class="row" id="info">
        <div class="six columns">
            <h5>Points</h5>
            <p>Points are awarded only to the top 5 athletes on each segment.</p>
            <ul><li>1st - 16</li>
            <li>2nd - 8</li>
            <li>3rd - 4</li>
            <li>4th - 2</li>
            <li>5th - 1</li>
            </ul>
        </div>
        <div  class="six columns">
            <h5>How the Segments are chosen</h5>
            <p>Right now* there is no rhyme or reason, this is a prototype.</p>
        </div>
    </div>
</div><!-- container -->
<script src="strava.js"></script>
<?php include($_SERVER['DOCUMENT_ROOT']."/foundation/src/includes/_doc_foot.php");  ?>

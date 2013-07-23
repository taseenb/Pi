<?php
/* @var $this SiteController */
$t = theme();
$baseUrl = Yii::app()->baseUrl;
/**
 * Get Processing demo and spinner codes (demo_code.txt and spinner.txt)
 */
$demoFileName = "demo_code.txt";
$spinnerFileName = "spinner.txt";
$pdePath = app()->basePath . DS . ".." . DS . "themes" . DS . "classic" . DS . "pde" . DS;
$demoSketch = file_get_contents($pdePath . $demoFileName);
$spinnerSketch = file_get_contents($pdePath . $spinnerFileName);

// IMPORTANT: add \n\ at the end of every line for compatibility with javascript literals
$demoSketch = str_replace("\n", "\\n\\\n", $demoSketch);
$spinnerSketch = str_replace("\n", "\\n\\\n", $spinnerSketch);
?>

<script type="text/javascript" src="<?php echo $baseUrl; ?>/scripts/config.js"></script>
<script type="text/javascript" data-main="<?php echo $baseUrl; ?>/scripts/main.js" src="<?php echo $baseUrl; ?>/scripts/lib/require/require.js"></script>

<script>
    define('Pi', function() {
	var Pi = {
	    name: "Processing Ideas",
	    shortName: "Pi",
	    version: "alpha1",
	    pjsVersion: "Processing.js 1.4.1", // http://processingjs.org
	    logo: "piLogo.svg",
	    logoMono: "piMonoLogo.svg",
	    sessions: 0, // total number of ide windows opened
	    maxIdeSessions: 5, // max number of ide windows open at the same time
	    maxConsoleLogs: 250, // max number of items kept in the console of every ide 
	    fileNameMaxLength: 36, // tab name characters
	    autoSaveInterval: 30000, // in milliseconds // 30 seconds
	    liveCodeInterval: 1000, // interval between sketch updates during live code mode (only when code is new)
	    demoCode: "<?php echo $demoSketch ?>",
	    spinnerCode: "<?php echo $spinnerSketch ?>",
	    basePath: "<?php echo app()->baseUrl; ?>",
	    themePath: "<?php echo $t; ?>",
	    imgPath: "<?php echo $t; ?>/img/",
	    bootstrap: <?php echo $bootstrapUserData ?>,
	    minPwdLength: <?php echo app()->params['minPwdLength'] ?>,
	    csrfToken: "<?php echo request()->csrfToken; ?>",
	    csrfTokenName: "<?php echo request()->csrfTokenName; ?>",
	    csrf: {
		"<?php echo request()->csrfTokenName; ?>": "<?php echo request()->csrfToken; ?>"
	    },
	    action: {
		openProject: "project"
	    }
	};
	Pi.longName = Pi.name + " (" + Pi.version + ")";

	return Pi;
    });

</script>

<!-- Container for static pages (hidden by default) -->
<div id="container" class="container"></div>

<!-- Nav bar -->
<div id="nav" class="navbar navbar-fixed-top">
    <canvas id="ajax-spinner"></canvas>
    <div class="navbar-inner">
	<a class="brand no_select" href="#art"><img src="<?php echo $t; ?>/img/piLogo.svg" title="Processing Ideas"></a>

	<!--<div class="nav-collapse">-->
	<ul class="nav pull-left no_select"></ul>
	<ul class="nav pull-right no_select"></ul>
	<!--</div>-->
    </div>
</div>

<!--Manager-->
<div id="manager" class="manager"></div>

<!-- Desktop -->
<!--<div id="viewport" class="viewport">-->
<div id="desktop_container" class="desktop_container">
    <div id="desktop" class="desktop">
	<div id="icon_main" class="icon no_select new">
	    <img src="<?php echo $t; ?>/img/piLogo.svg" alt="Processing Ideas">
	    <span>Processing Ideas (alpha)</span>
	</div>


<!--<canvas id="test"></canvas>-->

	<!-- Manager -->
	<div id="manager" class="manager">
	    <a id="manager_close" class="manager_close" href="#">test<i class="icon-remove "></i></a>
	    <div id="manager_container">
		<p>test test test</p>
	    </div>
	</div>
    </div>
</div>
<!--</div>-->

<!-- Add GitHub ribbon -->
<a id="forkongithub" href="https://github.com/este77/pi">Fork me on GitHub</a>
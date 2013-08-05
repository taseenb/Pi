<?php
/* @var $this SiteController */
$t = theme();
$baseUrl = Yii::app()->baseUrl;
//$isGuest = Yii::app()->user->isGuest;
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

// Determine whether we need the local configuration or the web optimization
$scriptsPath = app()->basePath . DS . ".." . DS . "scripts" . DS;
$local = file_exists($scriptsPath . '/config_local.js') ? true : false;
?>

<?php if ($local) : ?>
    <script type="text/javascript" src="<?php echo $baseUrl; ?>/scripts/config_local.js"></script>
    <script type="text/javascript" data-main="<?php echo $baseUrl; ?>/scripts/main.js" src="<?php echo $baseUrl; ?>/scripts/lib/require/require.js"></script>
<?php else : ?>
    <script type="text/javascript" src="<?php echo $baseUrl; ?>/scripts/config.js"></script>
    <script type="text/javascript" data-main="<?php echo $baseUrl; ?>/scripts/main.js" src="//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.8/require.min.js"></script>

<?php endif; ?>

<script>
    define('Pi', function() {
	var Pi = {
	    name: "Processing Ideas",
	    shortName: "Pi",
	    version: "alpha1",
	    pjsVersion: "Processing.js 1.4.1", // http://processingjs.org
	    logo: "piLogo.svg",
	    logoMono: "piMonoLogo.svg",
	    defaultSketchIcon: "piSketchIcon.svg",
	    minPwdLength: <?php echo app()->params['minPwdLength'] ?>,
	    sessions: 0, // total number of ide windows opened
	    maxIdeSessions: 5, // max number of ide windows open at the same time
	    maxConsoleLogs: 250, // max number of items kept in the console of every ide 
	    fileNameMaxLength: 36, // tab name characters
	    autoSaveInterval: 30000, // in milliseconds // 30 seconds
	    liveCodeInterval: 1000, // interval between sketch updates during live code mode (only when code is new)
	    defaultDesktopImage: "", //"<?php //echo $t; ?>/img/bg/gradient_autumn.jpg",
	    defaultDesktopColor: "",
	    demoCode: "<?php echo $demoSketch ?>",
	    spinnerCode: "<?php echo $spinnerSketch ?>",
	    defaultAvatarFileName: "<?php echo app()->params['defaultAvatarFileName'] ?>",
	    defaultPreviewFileName: "<?php echo app()->params['defaultPreviewFileName'] ?>",
	    previewFileName: "<?php echo app()->params['previewFileName'] ?>",
	    publicDir: "<?php echo app()->baseUrl; ?>/<?php echo app()->params['publicDirName'] ?>",
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
		openProject: "project",
		//openFinder: "find"
	    }
	};
	Pi.longName = Pi.name + " (" + Pi.version + ")";

	return Pi;
    });

</script>

<!-- Container for static pages (hidden by default) -->
<div id="container" class="container"></div>

<div id="desktop_bg" class="desktop_bg image fill">

    <!-- Nav bar -->
    <div id="nav" class="navbar navbar-fixed-top">
	<canvas id="ajax-spinner"></canvas>
	<div class="navbar-inner">
	    <a class="brand no_select" href="#art"><img src="<?php echo $t; ?>/img/piLogo.svg" title="Processing Ideas" class="pi_logo"></a>

	    <!--<div class="nav-collapse">-->
	    <ul class="nav pull-left no_select"></ul>
	    <ul class="nav pull-right no_select"></ul>
	    <!--</div>-->
	</div>
    </div>


    <!-- Desktop -->
    <div id="desktop" class="desktop">

	<!--Finder-->
	<div id="finder" class="popup finder ui-dialog">
	    <a class="exit close" title="Close">
		<i class="icon-remove-sign"></i>
	    </a>

	    <div id="finder_content" class="content_wrapper ui-dialog-content ui-widget-content">
		<div class="tabbable">
		    <ul id="finder_tabs" class="nav nav-pills">
			<li data-e-bind="hide:guest"><a data-target="my" data-toggle="tab" href="#find/my">My Projects</a></li>
		    </ul>
		    <div id="finder_tabs_content" class="main_content">
			<div class="projects_wrapper tab-content">
			    <div data-e-bind="hide:guest" id="my" class="tab-pane projects"></div>
			</div>
		    </div>
		</div>
	    </div>

	    <div class="alternative-area">
		<span>
		    Don't have an account yet?
		    <a class="btn btn-small btn-success" href="#sign-up">Sign Up for Pi</a>
		</span>
	    </div>

	</div>


	<!--Popup-->
	<div id="popup" class="popup ui-dialog">
	    
	</div>


	<div id="icon_main" class="icon no_select new">
	    <img src="<?php echo $t; ?>/img/piLogo.svg" alt="Processing Ideas">
	    <span>Processing Ideas (alpha)</span>
	</div>
    </div>

</div>

<!-- Add GitHub ribbon -->
<a id="forkongithub" href="https://github.com/taseenb/Pi">Fork me on GitHub</a>

<?php
/* @var $this SiteController */
$t = theme();
$baseUrl = Yii::app()->baseUrl;
$isGuest = Yii::app()->user->isGuest;
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
	    version: "alpha 0.0.4",
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
	    defaultDesktopImage: "", //"<?php //echo $t;                 ?>/img/bg/gradient_autumn.jpg",
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
			sandbox: "http://run.processingideas.com",
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
<!--<div id="container" class="container"></div>-->

<!--Finder-->
<div class="container-fluid"> <!-- finder container -->
    
    <!-- Nav bar -->
    <div class="row-fluid">
	<div class="span12">

	    <div id="nav" class="navbar">
		<canvas id="ajax-spinner"></canvas>
		<div class="navbar-inner">
		    <a class="brand no_select" href="#"><img src="<?php echo $t; ?>/img/piLogo.svg" title="Processing Ideas" class="pi_logo"></a> 

		    <!--<div class="nav-collapse">-->
		    <ul class="nav pull-left no_select"></ul>
		    <ul class="nav pull-right no_select"></ul>
		    <!--</div>-->
		</div>
	    </div>
	</div>
    </div>


    <div class="row-fluid pi_innerbody">
	<div class="span12">

	    <!--Finder-->
	    <div id="finder" class="row-fluid finder">
		<div class="span12">

		    <div class="row-fluid"> <!--Finder body-->
			<div class="span8">

			    <div id="finder_content" class="content_wrapper ui-dialog-content ui-widget-content border-right">
<!--				<a class="exit close pull-right" title="Close">
				    <i class="icon-remove-sign"></i>
				</a>-->
    <!--	    <h1 style="font-weight:100;margin: 0 10px 20px 10px;" class="clearfix">PROCESSING <strong>ideas</strong></h1>-->
				<!--<div class="tabbable">-->
				<!-- finder tabs -->
				<ul id="finder_tabs" class="nav nav-pills">
				    <li id="myProjectsTab" class="<?php echo $isGuest ? "hide" : "active"; ?>"><a data-target="#myProjects" data-toggle="tab" href="#find/myProjects">My Projects</a></li>
				    <li class="<?php if ($isGuest) echo "active" ?>"><a data-target="#featured" data-toggle="tab" href="#find/featured"><i class="icon-star"></i> Featured</a></li>
				    <li><a data-target="#mostAppreciated" data-toggle="tab" href="#find/mostAppreciated"><i class="icon-thumbs-up "></i> Most Appreciated</a></li>
				    <li><a data-target="#mostViewed" data-toggle="tab" href="#find/mostViewed"><i class="icon-eye-open"></i> Most Viewed</a></li>
				</ul>
				<!-- finder tabs -->

				<!-- finder tabs content -->
				<!--<div class="tabs_content_wrapper">-->
				<div id="finder_tabs_content" class="main_content">
				    <div class="projects_wrapper tab-content">
					<div id="myProjects" class="tab-pane projects <?php echo $isGuest ? "hide" : "active"; ?>">
					    <!--<div data-e-bind="collection:$myProjects"></div>-->
					</div>
					<div id="featured" class="tab-pane projects <?php if ($isGuest) echo "active" ?>">
<!--					    <div data-e-bind="collection:$featured"></div>-->
					</div>
					<div id="mostAppreciated" class="tab-pane projects">
					    <!--<div data-e-bind="collection:$mostAppreciated"></div>-->
					</div>
					<div id="mostViewed" class="tab-pane projects">
					    <!--<div data-e-bind="collection:$mostViewed"></div>-->
					</div>
				    </div>
				</div>
				<!--</div>-->
				<!-- finder tabs content -->
				<!--</div>-->
			    </div>
			</div>
			<div class="span4"> <!-- nav right -->
			    <div class="content_wrapper">
				<h2>Welcome 
				    <!--<img src="<?php echo $t; ?>/img/piLogo.svg" title="Processing Ideas" style="width:210px;height:210px;">-->
				</h2>
				<p>Pi is dedicated to creative coders, artists and designers. 
    It aims to provide an inspiring environment to create, 
    showcase and share interactive works, drawings 
    and animations written in javascript and the <a href='http://processing.org/' target="_blank">Processing</a> 
    language.</p>
<p>Pi currently uses the magical javascript port of Processing, 
    <a href='http://processingjs.org/' target="_blank">Processing JS</a>. 
    Other libraries (like <a href='http://paperjs.org/' target="_blank">Paper.js</a>, 
    <a href='http://raphaeljs.com/' target="_blank">Raphael.js</a>, 
    <a href="http://threejs.org/" target="_blank">Three.js</a>, etc.) 
    will be supported in the future.</p>
<p><strong>Pi is still under heavy development. 
	This public site is only intended as a temporary 
	presentation and test of the project, with a limited 
	set of features and many
	known and unknown <a href="https://github.com/taseenb/Pi/issues" target="_blank">bugs</a>.
	By the way, you can <a href="#contribute">contribute</a>
	to this project!</strong></p>
			    </div>
			</div>
		    </div> <!--Finder body-->

		    <!--	    <div class="row-fluid footer"> Finder footer
				    <div class="span12 ">
					<span>
					    Don't have an account yet?
					    <a class="btn btn-small btn-success" href="#sign-up">Sign Up for Pi</a>
					</span>
				    </div>
				</div> Finder footer-->

		</div>
	    </div> <!-- Finder -->

	    <!-- Desktop -->
	    <div id="desktop_bg" class="desktop_bg image fill">
		<div id="desktop" class="desktop">
		    <!--Popup-->
		    <div id="popup" class="popup ui-dialog"></div>

		    <!--Main icon-->
		    <div id="icon_main" class="icon no_select new">
			<img src="<?php echo $t; ?>/img/piLogo.svg" alt="Processing Ideas">
			<span>Processing Ideas (alpha)</span>
		    </div>
		</div>
	    </div>

	    <!-- Add GitHub ribbon -->
	    <a id="forkongithub" href="https://github.com/taseenb/Pi">Fork me on GitHub</a>


	</div>
    </div> <!-- pi_body -->

</div> <!-- container -->
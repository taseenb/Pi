<?php $t = theme(); ?>
<!DOCTYPE HTML>
<html>
    <head>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
	
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="stylesheet" type="text/css" 
	      href="<?php echo $t; ?>/css/main.css" />

	<title><?php echo CHtml::encode($this->pageTitle); ?></title>

	<link rel="apple-touch-icon-precomposed" sizes="144x144" 
	      href="<?php echo $t; ?>/img/logo/touch-icon-ipad-retina-precomposed.png" />
	<link rel="apple-touch-icon-precomposed" sizes="114x114" 
	      href="<?php echo $t; ?>/img/logo/touch-icon-iphone-retina-precomposed.png" />
	<link rel="apple-touch-icon-precomposed" sizes="72x72" 
	      href="<?php echo $t; ?>/img/logo/touch-icon-ipad-precomposed.png" />
	<link rel="apple-touch-icon-precomposed" 
	      href="<?php echo $t; ?>/img/logo/touch-icon-iphone-precomposed.png" />
	
	<link rel="icon" type="image/x-icon" 
	      href="<?php echo $t; ?>/img/logo/piLogo_64x64.png" />
	<link rel="shortcut icon" type="image/x-icon" 
	      href="<?php echo $t; ?>/img/logo/piLogo_64x64.png" />
	
	<style>
	    body {
		overflow: auto !important;
	    }
	</style>
	
	<!-- <script>
	    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	    ga('create', 'UA-42113990-1', 'processingideas.com');
	    ga('send', 'pageview');
	</script> -->
	
    </head>
    <body>

	<div class="container">
	    	<?php echo $content; ?>
	</div>

    </body>
</html>

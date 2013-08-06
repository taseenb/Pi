<?php $t = theme(); ?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Processing Ideas<?php //echo CHtml::encode($this->pageTitle);  ?></title>
        <meta name="description" content="A multitasking environement for Processing fans and creative developers.">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10">

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

	<link rel="icon"  type="image/x-icon" href="<?php echo $t; ?>/img/piLogo.svg" />

    </head>
    <body>

	<?php echo $content; ?>

    </body>
</html>

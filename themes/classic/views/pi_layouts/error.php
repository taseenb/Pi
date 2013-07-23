<?php $t = theme();  ?>
<!DOCTYPE HTML>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="stylesheet" type="text/css" 
      href="<?php echo $t; ?>/css/bootstrap.css" />

<title>Processing Ideas - Error<?php //echo CHtml::encode($this->pageTitle); ?></title>

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

</head>
<body>

<div class="container">
    <?php echo $content; ?>
</div>

</body>
</html>

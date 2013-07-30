<?php $t = theme(); ?>
<!DOCTYPE HTML>
<html>
    <head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="stylesheet" type="text/css" 
	      href="<?php echo $t; ?>/css/bootstrap.css" />
	
	 <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	
    </head>
    <body>
	
	<?php
	$form = $this->beginWidget('CActiveForm', array(
	    'id' => 'login-form',
	    'enableAjaxValidation' => false, // Yii Ajax and client validation must be disabled
	    'enableClientValidation' => false,
	));
	?>

	<?php
	$this->widget('CCaptcha', array(
	    'buttonOptions' => array(
		'id' => "login-form-captcha-refresh",
		'class' => 'btn btn-mini no_select'
	    )
	));
	?>

	<?php echo $form->textField($model, 'verifyCode', array('class' => '', 'placeholder' => "Enter the letters above")); ?>
	<br><br>
	<?php echo $form->error($model, 'verifyCode'); ?><?php echo UserModule::t("Letters are not case-sensitive."); ?>

	<input type="submit" class="btn btn-large" value="LOGIN">
	<?php $this->endWidget(); ?>

    </body>
</html>
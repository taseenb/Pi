<p id="signup-intro" class="signup-intro">
    Sign Up below to get free access to Processing Ideas.
</p>

<?php
$form = $this->beginWidget('CActiveForm', array(
    'id' => 'signup-form',
    'enableAjaxValidation' => false, // Yii Ajax and client validation must be disabled
    'enableClientValidation' => false
	));
?>

<div id="signup-email" class="control-group">
    <div class="controls">
	<div class="input-prepend">
	    <span class="add-on"><i class="icon-envelope"></i></span>
	    <?php echo $form->textField($model, 'email', array('placeholder' => "Your Email Address")); ?>
	</div>
	<small class="text-warning message"></small>
    </div>
</div>

<div id="signup-password" class="control-group">
    <div class="controls">
	<div class="input-prepend">
	    <span class="add-on"><i class="icon-key" ></i></span>
	    <?php echo $form->passwordField($model, 'password', array('placeholder' => "Create a Password")); ?>
	</div>
	<small class="text-warning message"></small>
    </div>
</div>

<div id="signup-verifyPassword" class="control-group">
    <div class="controls">
	<div class="input-prepend">
	    <span class="add-on"><i class="icon-key" ></i></span>
	    <?php echo $form->passwordField($model, 'verifyPassword', array('placeholder' => "Retype Your Password")); ?>
	</div>
	<small class="text-warning message"></small>
    </div>
</div>

<div id="signup-verifyCode" class="control-group" style="display:none">
    <?php
    $this->widget('CCaptcha', array(
	'buttonOptions' => array(
	    'id' => "signup-form-captcha-refresh",
	    'class' => 'btn btn-mini no_select'
	)
    ));
    ?>
    <div class="controls">
	<div class="input-prepend">
	    <span class="add-on"><i class="icon-arrow-up"></i></span>
	    <?php echo $form->textField($model, 'verifyCode', array('class' => '', 'placeholder' => "Enter the letters")); ?>
	</div>
	<small class="message"><?php echo $form->error($model, 'verifyCode'); ?><?php echo UserModule::t("Letters are not case-sensitive."); ?></small>
    </div>
</div>

<button type="button" id="signup-button1" class="btn btn-large step1" disabled><?php echo UserModule::t("Get Started") ?></button>
<button type="button" id="signup-button2" class="btn btn-large step2" style="display:none" disabled><?php echo UserModule::t("Finish") ?></button>
<?php $this->endWidget(); ?>

<div id="signup-alternative" class="alternative-area">
    <span>Already have an account? <a class="btn btn-small btn-success" href="#log-in">Log In to Pi</a></span>
</div>

<?php
$form = $this->beginWidget('CActiveForm', array(
    'id' => 'login-form',
    'enableAjaxValidation' => false, // Yii Ajax and client validation must be disabled
    'enableClientValidation' => false
	));
?>

<!--Email input-->
<div class="control-group">
    <div class="controls">
	<div class="input-prepend">
	    <span class="add-on"><i class="icon-envelope"></i></span>
	    <?php echo $form->textField($model, 'email', array('placeholder' => "Your Email")); ?>
	</div>
	<small class="text-warning email-message"></small>
    </div>
</div>

<!--Password input-->
<div class="control-group">
    <div class="controls">
	<div class="input-prepend">
	    <span class="add-on"><i class="icon-key" ></i></span>
	    <?php echo $form->passwordField($model, 'password', array('placeholder' => "Your Password")); ?>
	</div>
	&nbsp;&nbsp;&nbsp;<small>(<a href="#password-recovery">Forgot your password?</a>)</small>
    </div>
</div>

<!--Remeber me checkbox-->
<div class="control-group">
    <div class="controls">
	<label class="checkbox">
	    <?php echo $form->checkBox($model, 'rememberMe'); ?> Remember me next time
	</label>
    </div>
</div>

<!--
Captcha code
Show captcha if required. Otherwise keep it hidden at the beginning: 
it will be shown by javascript if necessary.
-->
<div id="login-verifyCode" class="control-group" <?php echo $model->captcha ? '' : 'style="display:none"'; ?>>
    <?php
    $this->widget('CCaptcha', array(
	'buttonOptions' => array(
	    'id' => "login-form-captcha-refresh",
	    'class' => 'btn btn-mini no_select'
	)
    ));
    ?>
    <div class="controls">
	<div class="input-prepend">
	    <span class="add-on"><i class="icon-arrow-up"></i></span>
	    <?php echo $form->textField($model, 'verifyCode', array('class' => '', 'placeholder' => "Enter the letters above")); ?>
	</div>
	<small><?php echo $form->error($model, 'verifyCode'); ?><?php echo UserModule::t("Letters are not case-sensitive."); ?></small>
    </div>
</div>

<!--Button-->
<button type="button" id="login-form-btn" class="btn btn-large" disabled><?php echo UserModule::t("Log In") ?></button>
<?php $this->endWidget(); ?>

<!--Form messages-->
<p id="login-form-message"></p>

<!--Alternative message-->
<div id="login-form-alternative" class="alternative-area">
    <span>Don't have an account yet? <a class="btn btn-small btn-success" href="#sign-up">Sign Up for Pi</a></span>
</div>

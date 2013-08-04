<p id="recovery-intro">
    Enter the email address you used to create your Pi account.<br>
    We will send you an email with a link to reset your password.
</p>

<div id="recovery-form">
    <div class="control-group">
        <div class="controls">
	    <div class="input-prepend">
		<span class="add-on"><i class="icon-envelope"></i></span>
		<?php echo CHtml::activeTextField($form, 'email', array('class' => '', 'placeholder' => 'Your Email')); ?>
	    </div>
	    <small class="text-warning email-message"></small>
        </div>
    </div>
    <button type="button" id="recovery-form-btn" class="btn" disabled><?php echo UserModule::t("Create a new password") ?></button>
</div>

<p id="recovery-form-message"></p>

<div id="recovery-form-alternative" class="alternative-area">
    <span>Did you remember your password? <a class="btn btn-small btn-success" href="#log-in">Log In to Pi</a></span>
</div>
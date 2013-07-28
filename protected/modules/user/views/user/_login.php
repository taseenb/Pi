<?php
$form = $this->beginWidget('CActiveForm', array(
    'id' => 'login-form',
    'enableAjaxValidation' => false, // Yii Ajax and client validation must be disabled
    'enableClientValidation' => false,
    'focus' => array($model, 'email')
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

<!--Captcha code-->
<div id="login-verifyCode" class="control-group" style="display:none">
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

<!--Submit button-->
<input type="submit" class="btn btn-large" value="<?php echo UserModule::t("Log In") ?>">
<?php $this->endWidget(); ?>

<!--Form messages-->
<p id="login-form-message"></p>

<!--Alternative message-->
<div id="login-form-alternative" class="alternative-area">
    <span>Don't have an account yet? <a class="btn btn-small btn-success" href="#sign-up">Sign Up for Pi</a></span>
</div>

<script>
    // Disable submit button if input is empty.
    define(
	    'login-form',
	    ['Pi', 'jquery', 'Pi/start/startDialogs'],
	    function(Pi, $) {

		var action = "login",
			leftLogins = 1000,
			url = Pi.basePath + '/user/' + action + '/',
			minPwdLength = <?php echo Yii::app()->params['minPwdLength'] ?>,
			$form = $('#' + action + '-form'),
			$captcha = $form.find('#login-verifyCode'),
			$inputText = $form.find('input[type="text"]'),
			$inputTextWrapper = $inputText.closest(".control-group"),
			$inputPass = $form.find('input[type="password"]'),
			$inputPassWrapper = $inputPass.closest(".control-group"),
			$inputs = $inputText.add($inputPass),
			$emailMessage = $form.find('.email-message'),
			$message = $('#login-form-message'),
			$btn = $form.find('input[type="submit"]').attr('disabled', 'disabled'),
			$alternative = $('#login-form-alternative');

		/**
		 * Check if Captcha is required.
		 * @returns {undefined}
		 */
		if (<?php echo $model->captcha ? "true" : "false" ?>)
		    showCaptcha();

		/**
		 * Show the captcha field and changes the size of the window.
		 * @returns {undefined}
		 */
		function showCaptcha() {
		    if (!$captcha.is(":visible")) {
			Pi.dialog.set({
			    height: 430
			});
			$alternative.hide();
			$captcha.slideDown();
		    }
		}

		/**
		 * Refresh captcha image
		 * @returns {undefined}	     
		 */
		function captchaRefresh() {
		    $('#login-form-captcha-refresh').trigger('click');
		}

		/**
		 * Messages for the user.
		 * @param string response The server response.
		 */
		function message(response) {
		    if (leftLogins < 5) {
			return "You have " + leftLogins + " login attempt(s) left. <a href='#password-recovery'>Forgot your password?</a>";
		    }
		    var defaultMessage = "<?php echo UserModule::t("Please check your email address and password.") ?>";
		    switch (response) {
			case "Unauthorized. Not active.":
			    return "<?php echo UserModule::t("Your credentials are good but your account is not yet activated.") ?>";
			    break;
			case "Unauthorized. Locked.":
			    return "<?php echo UserModule::t("You account or ip was locked or banned. Please do not try again.") ?>";
			    break;
			case "Unauthorized. Invalid credentials or captcha.":
			    return "<?php echo UserModule::t("Please check your email, your password and the code.") ?>"
			case "Unauthorized. Invalid credentials.":
			    return defaultMessage;
			    break;
			default:
			    return defaultMessage;
		    }
		}
		;

//    "Your credentials are good but your account is not yet activated." = Not active
//    "Please check your email address and password." = Invalid credentials.
//	    "You account or ip address was locked or banned." = > Locked

		// Enable the submit button only when text fields are filled
		// and email is valid
		$inputs.on('keyup input paste', function(e) {
		    $message.empty();
		    var email = $inputText.val(),
			    emailValid = false,
			    pass = $inputPass.val(),
			    passValid = false;

		    if (email)
		    {
			if (Pi.js.isEmail($.trim(email))) { // check if it is a valid mail address
			    $inputTextWrapper.addClass("info");
			    $emailMessage.empty();
			    emailValid = true;
			}
			else
			{
			    $inputTextWrapper.removeClass("info");
			    $emailMessage.html("Enter a valid email.");
			    emailValid = false;
			}

		    }
		    if (pass.length >= minPwdLength)
		    {
			$inputPassWrapper.addClass("info");
			passValid = true;
		    }
		    else
		    {
			$inputPassWrapper.removeClass("info");
			passValid = false;
		    }
		    if (emailValid && passValid)
		    {
			$btn.removeAttr('disabled').addClass('btn-primary');
		    }
		    else
		    {
			$btn.attr('disabled', 'disabled').removeClass('btn-primary');
		    }
		});

		$btn.click(function(e) {
		    e.preventDefault(); // important! do not submit the form
		    $btn.attr('disabled', 'disabled').removeClass('btn-primary');
		    $.ajax({
			url: url,
			method: 'post',
			data: $form.serialize(),
			success: function(data, textStatus, jqXHR) {
			    if (_.isObject(data) && !data.errors) {
				ajaxSuccess(data);
			    } else {
				ajaxError(data);
			    }
			}
//		error: function(jqXHR) { 
//		    var error = jqXHR.responseText || Pi.js.error(jqXHR, textStatus, errorThrown);
//		    $btn.attr('disabled', 'disabled'); // disable button until the user changes the email
//		    $message.fadeOut(200, function() {
//			$(this)
//			    .html('<strong>Ops!</strong><br>' + message(error))
//			    .fadeIn();
//		    });
//		}
		    });
		});

		function ajaxSuccess(data) {
		    $message.fadeOut(200, function() {
			// USER SUCCESSFULLY LOGGED IN
			// console.log(data);
			Pi.user.update(data, true); // load user and update sketches
			Pi.router.removeRoutesForGuests();
			Pi.dialogView.close();
		    });
		}

		function ajaxError(data) {
		    leftLogins = data.leftLogins;
		    if (leftLogins) {
			if (data.captcha) {
			    captchaRefresh();
			    showCaptcha();
			}
			$message.fadeOut(200, function() {
			    $(this).removeClass('text-info')
				    .addClass('text-error')
				    .html(message(data.errorMessage))
				    .fadeIn();
			});
		    }
		    else
		    {
			$form.fadeOut(function() {
			    $form.remove();
			});
			$message.removeClass('text-info')
				.addClass('text-error')
				.
				html("<strong>Sorry. Too many tries. Your ip will be locked for some time.</strong><br> \n\
			Please retry only if you remember your credentials \n\
			or come back later and try to reset your password by clicking on the link \n\
			'<strong>Forgot you password?</strong>'.");
		    }
		}

	    });
</script>

define([
    '!domReady', 'Pi', 'jquery'
], function(dom, Pi, $) {

    "use strict";

    var action = "login",
	    leftLogins = 1000,
	    //captcha = false,
	    url = Pi.basePath + '/user/' + action + '/',
	    minPwdLength = Pi.minPwdLength,
	    $form = $('#' + action + '-form'),
	    $captcha = $form.find('#login-verifyCode'),
	    $inputText = $form.find('input[type="text"]'),
	    $inputTextWrapper = $inputText.closest(".control-group"),
	    $inputPass = $form.find('input[type="password"]'),
	    $inputPassWrapper = $inputPass.closest(".control-group"),
	    $inputs = $inputText.add($inputPass),
	    $emailMessage = $form.find('.email-message'),
	    $message = $('#login-form-message'),
	    $btn = $form.find('#login-form-btn'),
	    $alternative = $('#login-form-alternative');

    $inputText.focus();


    /**
     * Show the captcha field and change the size of the window.
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
    // If captcha is visible from the beginning, change the size of the window
    if ($captcha.is(":visible")) {
	$alternative.hide();
	Pi.dialog.set({
	    height: 430
	});
    }

    /**
     * Messages for the user.
     * @param string response The server response.
     */
    var message = function (response) {
	if (leftLogins < 5) {
	    return "You have " + leftLogins + " login attempt(s) left. <a href='#password-recovery'>Forgot your password?</a>";
	}
	var defaultMessage = "Please check your email address and password.";
	switch (response) {
	    case "Unauthorized. Not active.":
		return "Your credentials are good but your account is not yet activated.";
		break;
	    case "Unauthorized. Locked.":
		return "You account or ip was locked or banned. Please do not try again.";
		break;
	    case "Unauthorized. Invalid credentials or captcha.":
		return "Please check your email, your password and the code.";
	    case "Unauthorized. Invalid credentials.":
		return defaultMessage;
		break;
	    default:
		return defaultMessage;
	}
    };

    /**
     * Refresh captcha image  
     */
    function captchaRefresh() {
	$('#login-form-captcha-refresh').trigger('click');
    }


//    "Your credentials are good but your account is not yet activated." = Not active
//    "Please check your email address and password." = Invalid credentials.
//	    "You account or ip address was locked or banned." = > Locked

    // Enable the submit button only when text fields are filled
    // and email is valid
    $inputs
	    .on('keyup input paste', function(e) {

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
	    $btn.prop('disabled', false).addClass('btn-primary');
	}
	else
	{
	    $btn.prop('disabled', true).removeClass('btn-primary');
	}

	if (e.keyCode == 13)
	{
	    if (!$btn.prop('disabled')) {
		$btn.trigger('click');
	    }
	}
    });

    $btn.click(function(e) {
	e.preventDefault(); // important! do not submit the form
	e.stopPropagation();
	$btn.prop('disabled', true).removeClass('btn-primary');
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
	    },
	    error: function(jqXHR) {
		console.log(jqXHR);
	    }
	});
    });
    
    function ajaxSuccess(data) {
	$message.fadeOut(200, function() {
	    // USER SUCCESSFULLY LOGGED IN
	    //console.log(data);
	    Pi.user.update(data, true); // load user and update sketches
	    Pi.router.removeRoutesForGuests();
	    Pi.dialogView.close();
	});
    }

    function ajaxError(data) {
	$btn.prop('disabled', true);
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
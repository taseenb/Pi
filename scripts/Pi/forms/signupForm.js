define([
    'Pi', 'jquery',
    "Pi/forms/validationPlugin"
], function(Pi, $) {

    var action = "signup",
	    url = Pi.basePath + '/user/' + action + '/',
	    minPwd = Pi.minPwdLength,
	    $form = $('#' + action + '-form'),
	    $introMessage = $("#signup-intro"),
	    ajaxDelay = 1500,
	    // input wrappers
	    $email = $form.find('#signup-email'),
	    $password = $form.find('#signup-password'),
	    $verifyPassword = $form.find('#signup-verifyPassword'),
	    $verifyCode = $form.find('#signup-verifyCode'),
	    // input text and password
	    $inputEmail = $email.find('input'),
	    $inputPassword = $password.find('input'),
	    $inputVerifyPassword = $verifyPassword.find('input'),
	    $inputVerifyCode = $verifyCode.find('input'),
	    // group of inputs for step 1 (email and passwords)
	    $inputs = $inputEmail.add($inputPassword).add($inputVerifyPassword),
	    // all wrappers
	    $inputWrappers = $inputs.closest(".control-group"),
	    // buttons
	    $btn1 = $form.find('#signup-button1'),
	    $btn2 = $form.find('#signup-button2');


    $inputEmail.focus();

    /**
     * Client side rules.
     * Add data into form emlements for validatino on client and server side.
     * See Simple Validation Plugin (below).
     */
    $inputEmail.data("rules", {
	email: true,
	required: true
    });
    $inputPassword.data("rules", {
	required: true,
	minLength: minPwd
    });
    $inputVerifyPassword.data("rules", {
	required: true,
	minLength: minPwd,
	verify: $inputPassword
    });
    $inputEmail.data("serverValidated", false);
    $inputPassword.data("serverValidated", false);
    $inputVerifyPassword.data("serverValidated", false);


    /**
     * 2 step sign up process.
     */
    var SignupForm = {
	init: function() {
	    // Start first step of the sign up.
	    this.startStep1();
	},
	/**
	 * Messages.
	 * @param {type} postData
	 * @returns {undefined}
	 */
	messages: {
	    genericError: function() {
		return "An error occurred. Please restart or try again later.";
	    },
	    happyNewAccount: function() {
		return "<span>You now have a new account! <a class='btn btn-small btn-success' href='#log-in'>Please Log In to Pi</a></span>";
	    },
	    captcha: function() {
		return "Please type the characters you see in the picture below.";
	    }
	},
	/**
	 * Refresh captcha image
	 * @returns {undefined}	     
	 */
	captchaRefresh: function() {
	    $('#signup-form-captcha-refresh').trigger('click');
	},
	/**
	 * Generic Jquery Ajax post request (used by step 1 and 2).
	 * @param {string} postData Form data serialized.
	 * @param {number} step 1 or 2
	 */
	ajaxSubmit: function(postData, step) {
	    // Do not allow more than one call every 1 or 2 seconds (1000 or 2000 milliseconds)
	    if (Pi.js.sinceLastAjax() >= ajaxDelay) {
		var that = this;
		Pi.lastjqXHR = $.ajax({
		    "type": "post",
		    "url": url,
		    "dataType": "json",
		    "data": postData,
		    "success": function(data) {
			that['updateFormStep' + step](data); // update form 1 or 2
		    },
		    "error": function(jqXHR, textStatus, errorThrown) {
			var error = Pi.js.error(jqXHR, textStatus, errorThrown);
			that.fatalError(error);
		    }
		});
	    }
	},
	/**
	 * Activate the submit button.
	 * @param {jquery or string} button Jquery selector or jquery object of a button. 
	 * @returns {} 
	 */
	activateButton: function(button) {
	    return $(button).prop('disabled', false).addClass('btn-primary');
	},
	/**
	 * Deactivate the submit button. 
	 * @param {jquery or string} button Jquery selector or jquery object of a button.
	 * @returns {} 
	 */
	deactivateButton: function(button) {
	    return $(button).prop('disabled', true).removeClass('btn-primary');
	},
	/**
	 * Step 1. Click event for step 1.
	 */
	startStep1: function() {
	    var that = this;
	    $btn1.click(function(e) {
		e.preventDefault();
		// Add "firstStep=signup-form" to avoid captcha validation in step 1
		// (see SignupController and SignupForm)
		that.ajaxSubmit($form.serialize() + "&SignupFormStep=one", 1);
	    });
	    $inputs.on('keyup input past blur', function(e) {
		e.stopPropagation();
		that.validateAllStep1();
		if (e.keyCode == 13) {
		    if (!$btn1.prop('disabled')) {
			$btn1.trigger('click');
		    }
		}
	    });
	},
	/**
	 * Update the form with styles that show complete validation.
	 * @returns {undefined}
	 */
	validateAllStep1: function() {
	    if ($inputEmail.validate() && $inputPassword.validate() && $inputVerifyPassword.validate()) {
		this.activateButton($btn1);
	    }
	    else
	    {
		this.deactivateButton($btn1);
	    }
	},
	/**
	 * Step 1: update form, error messages and html.
	 * @param {object} data Json response from the server.
	 * @returns {undefined}	 */
	updateFormStep1: function(data) {
	    if (_.isArray(data) && !data.length) {
		this.validateAllStep1();
		this.startStep2();
	    }
	    else if (_.isObject(data)) {
		// Reset form style and error messages.
		$inputWrappers.removeClass("warning").find(".message").html("");
		// Loop through errors and update form style and messages.
		_.each(data, function(errors, id) {
		    var group = $form.find("#" + id).closest(".control-group");
		    group.removeClass("info").addClass("warning")
			    .find('input').data("serverValidated", false);
		    _.each(errors, function(value) {
			group.find(".message").html(value);
		    });
		});
		$inputWrappers.not(".warning").addClass("info").each(function() {
		    $(this).find('input').data("serverValidated", true);
		});
	    }
	    else
	    {
		this.finish(this.messages.genericError());
	    }
	},
	/**
	 * Step 2. Hide step 1 elements and fade in captcha. Add click event for button 2.
	 */
	startStep2: function() {
	    var that = this;

	    // Remove button 1 and hide old stuff
	    $btn1.off("click").fadeOut(function() {
		$(this).remove();
	    });

	    // Remove all event handlers
	    $inputs.off('keyup input past blur');

	    // Hide password fields + show captcha and button 2
	    $password.add($verifyPassword).fadeOut(function() {
		$inputEmail.attr('readonly', 'readonly');
		$email.addClass('info').find('.message').remove();
		$introMessage.html(that.messages.captcha());
		$verifyCode.fadeIn(function() {
		    $inputVerifyCode.focus();
		    $inputVerifyCode.on('keyup input past blur', function(e) {
			if ($inputVerifyCode.val().length > 4) {
			    that.activateButton($btn2);
			} else {
			    that.deactivateButton($btn2);
			}
			if (e.keyCode == 13) {
			    if (!$btn2.prop('disabled')) {
				$btn2.trigger('click');
			    }
			}
		    });
		});
		$btn2.fadeIn().click(function(e) {
		    e.preventDefault();
		    that.ajaxSubmit($form.serialize(), 2);
		});
	    });
	},
	/**
	 * Step 2: validate captcha.
	 * @param {object} data Json response from the server.
	 */
	updateFormStep2: function(data) {
	    if (_.isObject(data)) {
		if (data.status === "success")
		{
		    this.finish(data.message);
		}
		else
		{
		    // Refresh the captcha image
		    this.captchaRefresh();
		    // Empty captcha input.
		    $inputVerifyCode.val("");
		    // Set focus.
		    $inputVerifyCode.focus();
		    // Reset captcha form style clean and error messages.
		    $verifyCode.removeClass("warning").find(".message").html("");
		    // Deactivate button 2
		    this.deactivateButton($btn2);
		    // Loop through errors and update form style and messages.
		    _.each(data, function(errors, id) {
			$verifyCode.removeClass("info").addClass("warning");
			_.each(errors, function(value) {
			    $verifyCode.find(".message").html(value);
			});
		    });
		    $verifyCode.not(".warning").addClass("info");
		}
	    }
	    else
	    {
		this.fatalError(this.messages.genericError());
	    }
	},
	/**
	 * Last screen with message for the user (error or success). 
	 * @param {string} message A message that will be printed after fading out 
	 * every other element.
	 */
	finish: function(message) {
	    var that = this;
	    $verifyCode.fadeOut().off('keyup input past blur');
	    $introMessage.fadeOut();
	    $btn2.fadeOut(function() {
		$btn2.remove();
		$form.remove();
		$introMessage.html(message).fadeIn();
		$("#signup-alternative").html(that.messages.happyNewAccount());
	    }).off('click');
	},
	/**
	 * Fatal error: cannot continue. Remove the form and send an error message.
	 * @param {type} error
	 */
	fatalError: function(error) {
	    $form.fadeOut();
	    $introMessage.fadeOut(function() {
		$introMessage.html(error).fadeIn();
	    });
	}

    };

    /**
     * Start sign up process.
     */
    SignupForm.init();

});



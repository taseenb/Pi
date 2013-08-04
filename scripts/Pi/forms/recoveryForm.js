define([
    'Pi', 'jquery'
], function(Pi, $) {

    var url = Pi.basePath + '/user/recovery/',
	    $form = $('#recovery-form'),
	    $inputText = $form.find('input[type="text"]'),
	    $inputTextWrapper = $inputText.closest(".control-group"),
	    $emailMessage = $form.find('.email-message'),
	    $btn = $form.find('#recovery-form-btn'),
	    message = "",
	    $message = $('#recovery-form-message');

    $inputText.focus();

    $inputText.on('keyup input paste', function(e) {
	// Get the Enter key
	if (e.keyCode == 13) {
	    if (!$btn.prop('disabled')) {
		$btn.trigger('click');
	    }
	}
	var email = $.trim($(this).val());
	if (email) {
	    if (Pi.js.isEmail(email)) {
		$btn.prop('disabled', false).addClass('btn-inverse');
		$inputTextWrapper.addClass("info");
		$emailMessage.html('');
		return;
	    }
	    else
	    {
		$inputTextWrapper.removeClass("info");
		$emailMessage.html("Enter a valid email.");
		$btn.prop('disabled', true).removeClass('btn-inverse');
		return;
	    }
	}
	$btn.prop('disabled', true);
	$emailMessage.html('');
    });

    $btn.click(function(e) {
	e.preventDefault(); // important! do not submit the form
	$.ajax({
	    url: url,
	    method: 'post',
	    data: $inputText.serialize() + "&" + Pi.csrfTokenName + "=" + Pi.csrfToken,
	    success: success,
	    error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR);
		console.log(errorThrown);
		var error = jqXHR.responseText || Pi.js.error(jqXHR, textStatus, errorThrown);
		$btn.prop('disabled', true); // disable button until the user changes the email
		$message.fadeOut(200, function() {
		    $(this)
			    .html('<strong>Sorry!</strong> ' + error)
			    .fadeIn();
		});
	    }
	});
    });

    function success(data, textStatus, jqXHR) {
	if (!data.errors) {
	    $inputText.off('keyup input paste');
	    $('#recovery-intro').fadeOut(200);
	    $message.fadeOut(200, function() {
		$(this)
			.html("We\'ve sent you an email with a link.<br>If you do not receive this email within a few minutes, please check your spam folder.<br><br>")
			.fadeIn();
		// Restore attributes and remove event handlers on the recovery form.
		$inputText.off().prop('readonly', true);
		$btn.prop('disabled', true).html("You have new mail");
	    });
	}
    }

});
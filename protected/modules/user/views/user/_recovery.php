<p id="recovery-intro">
    Enter the email address you used to create your Pi account.<br>
    We will send you an email with a link to reset your password.
</p>

<?php
if ($form) :
    echo CHtml::beginForm('', 'post', array('id' => 'recovery-form'));
    echo CHtml::errorSummary($form);
    ?>
    <div class="control-group">
        <div class="controls">
    	<div class="input-prepend">
    	    <span class="add-on"><i class="icon-envelope"></i></span>
		<?php echo CHtml::activeTextField($form, 'email', array('class' => '', 'placeholder' => 'Your Email')); ?>
    	</div>
    	<small class="text-warning email-message"></small>
        </div>
    </div>
    <?php
    echo CHtml::submitButton(UserModule::t("Create a new password"), array('class' => 'btn'));
    echo CHtml::endForm();
endif;
?>

<p id="recovery-form-message"></p>

<div id="recovery-form-alternative" class="alternative-area">
    <span>Did you remember your password? <a class="btn btn-small btn-success" href="#log-in">Log In to Pi</a></span>
</div>

<script>
    // Disable submit button if input is empty.
    define(
	    'recovery-form',
	    ['Pi', 'jquery'],
	    function(Pi, $) {

		var url = Pi.basePath + '/user/recovery/',
			$form = $('#recovery-form'),
			$inputText = $form.find('input[type="text"]'),
			$inputTextWrapper = $inputText.closest(".control-group"),
			$emailMessage = $form.find('.email-message'),
			$btn = $form.find('input[type="submit"]').attr('disabled', 'disabled'),
			message = "",
			$message = $('#recovery-form-message');

		// Enable button when text field is filled with more than 4 chars
		$inputText.on('keyup input paste', function(e) {
		    var email = $.trim($(this).val());
		    if (email) {
			if (Pi.js.isEmail(email)) {
			    $btn.removeAttr('disabled').addClass('btn-inverse');
			    $inputTextWrapper.addClass("info");
			    $emailMessage.html('');
			    return;
			}
			else if (email.length > 4)
			{
			    $inputTextWrapper.removeClass("info");
			    $emailMessage.html("Enter a valid email.");
			    $btn.attr('disabled', 'disabled').removeClass('btn-inverse');
			    return;
			}
		    }
		    $btn.attr('disabled', 'disabled');
		    $emailMessage.html('');
		});

		$btn.click(function(e) {
		    e.preventDefault(); // important! do not submit the form
		    $.ajax({
			url: url,
			method: 'post',
			data: $form.serialize(),
			success: success,
			error: function(jqXHR, textStatus, errorThrown) {
			    console.log(jqXHR);
			    console.log(errorThrown);
			    var error = jqXHR.responseText || Pi.js.error(jqXHR, textStatus, errorThrown);
			    $btn.attr('disabled', 'disabled'); // disable button until the user changes the email
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
				    .html('<?php echo UserModule::t("We\'ve sent you an email with a link.<br>If you do not receive this email within a few minutes, please check your spam folder.") ?><br><br>')
				    .fadeIn();
			    // Restore attributes and remove event handlers on the recovery form.
			    $inputText.off().attr('readonly', 'readonly');
			    $btn.attr('disabled', 'disabled').val('<?php echo UserModule::t("You have new mail") ?>');
			});
		    }
		}

	    });
</script>
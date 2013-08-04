define([
    'Pi', 'jquery'
], function(Pi, $) {

    /**
     * Simple validation plugin.
     * Author: e.a.
     * Date: 2013, july 4th
     * Version: 0.1
     * @param {jQuery} $
     * @returns {jquery} */
    (function($) {

	$.fn.extend({
	    //pass the options variable to the function
	    validate: function(options) {
		//Set the default values, use comma to separate the settings, example:
		var defaults = {
		    rules: {
		    },
		    messages: function(ruleName, ruleValue) {
			switch (ruleName) {
			    case "required":
				return "This field is required.";
				break;
			    case "email":
				return "Enter a valid email.";
				break;
			    case "minLength":
				return ruleValue + " characters or more.";
				break;
			    case "maxLength":
				return "Too many characters!";
				break;
			    case "verify":
				return "Passwords do not match.";
				break;
			    default:
				return "";
			}
		    },
		    rulesFunctions: {
			required: function(input, ruleValue) {
			    if (ruleValue) {
				return input.val().length ? true : false;
			    }
			    return true;
			},
			email: function(input, ruleValue) {
			    if (ruleValue) {
				var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return regex.test(input.val());
			    }
			    return true;
			},
			minLength: function(input, ruleValue) {
			    return input.val().length >= ruleValue ? true : false;
			},
			maxLength: function(input, ruleValue) {
			    return input.val().length <= ruleValue ? true : false;
			},
			verify: function(input, ruleValue) {
			    return input.val() === $(ruleValue).val();
			}
		    },
		    container: ".control-group", // selector or jquery object
		    validClass: 'info',
		    notValidClass: 'warning',
		    messageClass: "message"
		};

		var options = $.extend(defaults, options);
		var rules = this.data("rules");
		var allValidated = true;


		this.each(function() {
		    var o = options;
		    var valid = false;
		    var message = "";

		    // Test rules and change parent class of the input appropriately
		    for (var ruleName in rules) {
			var ruleValue = rules[ruleName];
			if (o.rulesFunctions[ruleName]($(this), ruleValue)) {
			    valid = true;
			} else {
			    message = o.messages(ruleName, ruleValue);
			    valid = false;
			    allValidated = false;
			    break;
			}
		    }

		    // If the field is valid and server side is valid too, then change style.
		    if (valid) {
			$(this).closest(o.container).addClass(o.validClass).
				removeClass(o.notValidClass)
				.find("." + o.messageClass).empty();
		    } else {
			$(this).closest(o.container).removeClass(o.validClass).
				addClass(o.notValidClass)
				.find("." + o.messageClass).html(message);
		    }
		});


		return allValidated;

	    }
	});

    })(jQuery);

});
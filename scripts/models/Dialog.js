define([
    // Main
    'Pi', 'backbone', 'jquery',
    // Collections
    // Models
    // Views

    // Backbone Extensions
    'Pi/Model'

], function(Pi, Backbone, $) {

    "use strict";

    var Dialog = Backbone.Model.extend({
	modelName: "Dialog",
	defaults: {
	    title: "",
	    content: "",
	    dataId: undefined,
	    width: 480,
	    height: 380,
	    require: undefined
	},
	/**
	 * List of available route names for dialogs used by guests only.
	 */
	forGuests: [
	    "log-in", "sign-up", "resend-activation-email", "password-recovery"
	],
	/**
	 * Loop through dialog data and apply it to each dialog model attribute.
	 * If 'url' property is set, make a POST request to that url
	 * and apply the response to the 'content' attribute.
	 * Otherwise just set the attribute in the model.
	 */
	reload: function() {
	    var data = this.data[this.get('dataId')],
		    that = this;
	    _.each(data, function(value, key) {
		if (key === 'contentUrl')
		{
		    that.aset({
			'attr': 'content',
			'url': value,
			'type': 'POST',
			'data': Pi.csrf,
			'require': data.require || undefined
		    });
		}
		else
		    that.set(key, value);
	    });
	},
	/**
	 * Dialogs data.
	 */
	data: {
	    'alert': {
		width: 360,
		height: 200
	    },
	    'confirmation': {
		width: 420,
		height: 220
	    },
	    'shortMessage': {
		width: 360,
		height: 180
	    },
	    'about': {
		width: 480,
		height: 420
	    },
	    'log-in': {
		width: 480,
		height: 380,
		title: "Log In",
		require: ['Pi/forms/loginForm'],
		contentUrl: Pi.basePath + '/user/login/'
	    },
	    'sign-up': {
		width: 480,
		height: 380,
		title: "Sign Up",
		require: ["Pi/forms/signupForm"],
		contentUrl: Pi.basePath + '/user/signup/'
	    },
	    'password-recovery': {
		width: 480,
		height: 320,
		title: "Password Recovery",
		require: ['Pi/forms/recoveryForm'],
		contentUrl: Pi.basePath + '/user/recovery/'
	    },
	    'activation-resend-email': {
		width: 480,
		height: 380,
		title: "Resend Activation Email",
		contentUrl: Pi.basePath + '/user/activation/resendemail'
	    }
	}
    });

    return Dialog;

});
define([
    'Pi', 'backbone', 'jquery',
    
    // Backbone Extensions
    'Pi/Model'

], function(Pi, Backbone, $) {
    
    "use strict";

    /**
     * Static helper methods.
     */
    Pi.js = {
	/**
	 * Format date and time from a unix timestamp or javascript date object.
	 * @param {undefined || number || string || Date} time	Optional argument for the time to format. 
	 *							If empty, it will format the current time.
	 * @returns {String} The formatted time.
	 */
	formatDateTime: function(time)
	{
	    var date;
	    if (!time) {
		// time is now
		date = new Date();
	    } else if (typeof time === "number" || typeof time === "string") {
		// time is a unix timestamp
		// ATTENTION: Date argument is in milliseconds, not seconds:
		// multiply by 1000 to get milliseconds.
		date = new Date(time * 1000);
	    } else if (time instanceof Date) {
		// time is a javascript Date object
		date = time;
	    }
	    return date.toLocaleDateString() + " - " + date.toLocaleTimeString();
	},
	/**
	 * Convert a string to camelCase, by removing spaces.
	 * @param {type} input
	 */
	camelCase: function camelCase(input) {
//	    return input.toLowerCase().replace(/ (.)/g, function(match, group1) {
//		return group1.toUpperCase();
//	    });
	    return input.replace(/ (.)/g, function(match, group1) {
		return group1.toUpperCase();
	    });
	},
	/**
	 * Create a unique id for identification purposes.
	 * @param {string} separator The optional separator for grouping the generated segmants: default "_".   
	 * @returns string
	 */
	generateUid: function(separator) {
	    var delim = separator || "_";
	    function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	    }
	    var uid = "";
	    for (var i = 0; i < 2; i++)
		uid += S4() + (Math.random() > 0.33 ? delim : S4()) + S4();
	    return uid;
	},
	/**
	 * Email validation. Tells if this is a valid email address.
	 * @param {type} email
	 * @returns {@exp;regex@call;test}
	 */
	isEmail: function(email) {
	    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return regex.test(email);
	},
	/**
	 * Convert canvas to image.
	 * @param {object} canvas The canvas object.
	 * @returns {image} Return an image DOM element.
	 */
	convertCanvasToImage: function(canvas) {
	    var image = new Image();
	    //image.src = canvas.toDataURL("image/png");
	    image.src = canvas.toDataURL("image/jpeg");
	    return image;
	},
	/**
	 * Generic http error status from a jquery ajax call converted into text.
	 * @param {type} jqXHR
	 * @param {type} textStatus
	 * @param {type} errorThrown
	 * @returns {undefined}
	 */
	error: function(jqXHR, textStatus, errorThrown) {
	    var error = "An error occurred. Please try again later.";
	    if (jqXHR.status === 0 || jqXHR.status === 404) {
		error = 'You are probably not connected. Please verify your network connection.';
	    } else if (jqXHR.status === 401) {
		error = 'Unauthorized. Authentication error.';
	    } else if (jqXHR.status === 500) {
		error = 'Server error. Please try again later.';
	    }
//	    else {
//		error = 'Uncaught Error.<br>' + jqXHR.responseText;
//	    }
	    return error;
	},
	/**
	 * Get the time in milliseconds since last Ajax call.
	 * @returns {number} lastCall Time in milliseconds.	     
	 */
	sinceLastAjax: function() {
	    // Calculate time between calls
	    var now = new Date().getTime();
	    var lastCall = 10000000;
	    if (Pi.lastAjax) {
		lastCall = now - Pi.lastAjax;
		//console.log(lastCall);
	    }
	    return lastCall;
	}
    };

    return Pi;

});
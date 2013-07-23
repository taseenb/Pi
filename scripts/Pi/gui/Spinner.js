define([
    // Main scripts
    'Pi', 'jquery', "processing"

], function(Pi, $, Processing) {

    /**
     * An animated spinner made in Processing JS (used for Ajax requests).
     * @param {string} elementId The id of the canvas element in the DOM.
     */
    var Spinner = function(elementId) {

	var that = this;

	/**
	 * Ajax spinner animation (mini processing sketch: sprites.txt).
	 */
	var spinnerCode = Processing.compile(Pi.spinnerCode);
	var spinnerCanvas = document.getElementById(elementId);
	
	/**
	 * The Processing instance of the spinner animation.
	 */
	this.animation = new Processing(spinnerCanvas, spinnerCode);

	/**
	 * A jQuery wrapper for the canvas element.
	 */
	this.$ = $("#" + elementId);

	/**
	 * Fade In the spinner.
	 */
	this.show = function() {
	    this.animation.start();
	    this.$.fadeIn(100);
	};

	/**
	 * Fade out the spinner animation and stop it.
	 */
	this.hide = function() {
	    this.$.fadeOut(100, function() {
		// Calls stop(). This method is inside the Processing code.
		that.animation.stop();
	    });
	};

    };

    return Spinner;

});
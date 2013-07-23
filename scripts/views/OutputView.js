define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Templates
    "text!tpl/Output.html",
    // Backbone Extensions

    // Plugins
    'jquery-ui',
    "jquery-easing"

], function(Pi, Backbone, $, OutputHtml) {

    "use strict";

    var outputTemplate = _.template(OutputHtml);

    var OutputView = Backbone.View.extend({
	/**
	 * Init view.
	 */
	initialize: function()
	{
	    this.listenTo(this.model, "change:ouputPosition", this.positionState);
	    this.listenTo(this.model, "change:name", this.nameState);
	    this.listenTo(this.model, "change:isPaused", this.pauseState);
	    this.listenTo(this.model, "change:fullScreen", this.fullScreenState);
	    this.listenTo(this.model, "change:liveCode", this.liveCodeState);
	},
	className: 'output',
	resized: false,
	events: {
	    "dragstop ": function(event, ui) {
		this.model.set({
		    ouputPosition: {
			top: ui.position.top,
			left: ui.position.left
		    }
		});
	    },
	    "mousedown.active": function(e)
	    {
		e.stopPropagation();
		this.model.set({
		    active: true
		});
	    },
	    "click .stop": function(e) {
		this.model.stopSketch({
		    liveCode: false,
		    hide: true
		});
	    },
	    "click .pause": function(e) {
		this.pauseSketch();
	    },
	    "click .play": function(e) {
		this.unpauseSketch();
	    },
	    "click .fs": function(e) {
		this.model.set('fullScreen', !this.model.get('fullScreen')); // toggle fullScreen on/off
	    },
	    "click .picture": function(e) {
		this.takePicture();
	    }
	},
	/**
	 * Render view.
	 */
	render: function()
	{
	    this.$el
		    .html(
		    outputTemplate({
		id: this.model.getId(),
		name: this.model.get('name')
	    })
		    )
		    .addClass('win active front no_select')
		    .attr({
		id: "output" + this.model.getId()
	    })
		    .css({
		top: this.model.get('top'),
		zIndex: this.model.get('zIndex') + 1
	    })
		    .appendTo(this.model.container)
		    .draggable({
		handle: '.title'
	    });
	    return this;
	},
	canvas: function() {
	    return document.getElementById('canvas' + this.model.getId());
	},
	context: function() {
	    return this.canvas().getContext('2d');
	},
	/**
	 * Position the output window.
	 */
	positionState: function() {
	    var that = this;
	    this.$el.css({
		top: that.model.get('ouputPosition').top,
		left: that.model.get('ouputPosition').left
	    });
	},
	pauseState: function() {
	    if (!this.model.get('isPaused')) {
		this.$el.find('.pause').show();
		this.$el.find('.play').hide();
	    }
	    else
	    {
		this.$el.find('.pause').hide();
		this.$el.find('.play').show();
	    }
	},
	/**
	 * Update outuput window title.
	 */
	nameState: function() {
	    var name = this.model.get('name');
	    this.$el.find('.name').text(name);
	},
	/**
	 * Check fullscreen state and toggles fullscreen mode on/off.
	 */
	fullScreenState: function() {
	    if (this.model.get('fullScreen')) {
		this.enterFullScreen();
	    }
	    else {
		this.exitFullScreen();
	    }
	},
	/**
	 * Exit full screen.
	 * @returns {undefined}
	 */
	exitFullScreen: function() {
	    var that = this;
	    this.fullScreen = false;
	    this.adjustSize();
	    Pi.user.nav.show(that, function(output) {
		output.$el.removeClass('fullscreen');
		output.positionState();
		$('#forkongithub').show();
	    });
	},
	/**
	 * Enter full screen.
	 * @returns {undefined}
	 */
	enterFullScreen: function() {
	    var that = this;
	    this.fullScreen = true;
	    this.adjustSize();
	    Pi.user.nav.hide(that, function(output) {
		output.$el.css({
		    'zIndex': 111,
		    top: 0,
		    left: 0
		});
		output.$el.addClass('fullscreen');
		$('#forkongithub').hide();
	    });
	},
	/**
	 * Take a picture of the current frame.
	 */
	takePicture: function() {
	    var picturesContainer = this.$el.find('.pictures_container');
	    var image = Pi.js.convertCanvasToImage(this.canvas());
	    if (picturesContainer.find('img').size() >= 5) {
		picturesContainer.find('img:eq(-4)').prevAll().remove();
	    }
	    picturesContainer.append(image);
	},
	/**
	 * Calculate the max canvas width, based on window width.
	 */
	maxCanvasWidth: function() {
	    var maxW = 62.5; // percent of the desktop width
	    return Math.floor((Pi.desktopView.$el.width() * maxW) / 100);
	},
	/**
	 * Calculate the max canvas height, based on window height.
	 */
	maxCanvasHeight: function() {
	    var maxH = 85; // percent of the desktop height
	    return (Pi.desktopView.$el.height() * maxH) / 100;
	},
	/**
	 * Adjust size of the output window, if it is too large for the screen.
	 */
	adjustSize: function() {
	    var w = this.originalWidth,
		    h = this.originalHeight;

	    if (!this.fullScreen) {
		this.reduceToMaxSize(w, h);
		if (w > this.maxCanvasWidth() || h > this.maxCanvasHeight()) {
		    this.resized = true;
		}
	    }
	    else
	    {
		if (this.resized) {
		    this.$el.find('canvas').css({
			'width': w,
			'height': h
		    });
		    this.resized = false;
		}
	    }

	    // Add an alert if the canvas have been resized.
	    this.resizeAlert();
	},
	/**
	 * Reduce width and height to fit the screen (recursive).
	 * @param {number} w Sketch width.
	 * @param {number} h Sketch height.
	 */
	reduceToMaxSize: function(w, h) {
	    var maxW = this.maxCanvasWidth(),
		    maxH = this.maxCanvasHeight(),
		    newW = w,
		    newH = h,
		    changed = false;
	    if (w > maxW) {
		//console.log('too wide');
		newW = maxW;
		newH = h * (maxW / w);
		changed = true;
	    } else if (h > maxH) {
		//console.log('too high');
		newW = w * (maxH / h);
		newH = maxH;
		changed = true;
	    } else if (w === h && w > maxW) {
		//console.log('too wide and high');
		newW = maxW;
		newH = maxH;
		changed = true;
	    } else {
		//console.log("finally perfect: " + Math.floor(newW) + "x" + Math.floor(newH));
		changed = false;
	    }
	    // If changed, check the size again (recursive).
	    // If not changed, check if the current width and height have changed 
	    // from their original value and apply the change if this is the case.
	    if (changed) {
		//console.log("changed! let's check again");
		this.reduceToMaxSize(newW, newH);
	    } else if (newW !== this.originalWidth || newH !== this.originalHeight) {
		this.$el.find('canvas').css({
		    'width': Math.floor(newW),
		    'height': Math.floor(newH)
		});
		//console.log("canvas updated");
	    }
	},
	/**
	 * Livecode.
	 */
	liveCodeState: function() {
	    if (this.model.get('liveCode')) {
		this.$el.find(".live-alert").show();
	    }
	    else
	    {
		this.$el.find(".live-alert").hide();
	    }
	},
	/**
	 * Add an alert telling the user that the sketch was resized.
	 */
	resizeAlert: function() {
	    if (this.resized) {
		this.$el.find(".resize-alert").show();
	    }
	    else
	    {
		this.$el.find(".resize-alert").hide();
	    }
	},
	/**
	 * Pause the sketch.
	 */
	pauseSketch: function() {
	    this.model.set('isPaused', true);
	    this.processingInstance['pause' + this.model.uid]();
	},
	/**
	 * Unpause the sketch (play again after pause).
	 */
	unpauseSketch: function() {
	    this.model.set('isPaused', false);
	    this.processingInstance['unpause' + this.model.uid]();
	}
    });

    return OutputView;

});
define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Templates
    "text!tpl/Project/Output.html",
    // Backbone add-ons
    'Pi/start/startDataBinding',
    // Plugins
    'jquery-ui',
    "jquery-easing"

], function(Pi, Backbone, $, OutputHtml) {

    "use strict";

    var OutputView = Backbone.Epoxy.View.extend({
	/**
	 * Init view.
	 */
	initialize: function()
	{
	    this.listenTo(this.model, "change:zIndex", function() {
		this.$el.css('z-index', this.model.get('zIndex') + 1);
	    });
	    this.listenTo(this.model, "change:ouputPosition", this.positionState);
	    this.listenTo(this.model, "change:fullScreen", this.fullScreenState);

	    // Raw html
	    this.$el.html(OutputHtml).attr({
		'data-e-bind': "active:active,front:front"
	    });
	    
	    // Render view
	    this.render();
	},
	/**
	 * Data binding.
	 */
	bindings: "data-e-bind",
	bindingHandlers: _.extend(Pi.bindingHandlers, {}),
	className: 'output',
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
		this.model.set('fullScreen', false);
		Pi.router.navigate("/art");
		this.model.stopSketch({
		    liveCode: false,
		    hide: true
		});
	    },
	    "click .play, .pause": function(e) {
		this.togglePause();
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
		    .addClass('win active front no_select')
		    .css({
		top: this.model.get('top'),
		zIndex: this.model.get('zIndex') + 1
	    })
		    .appendTo(this.model.ideView.container)
		    .draggable({
		handle: '.title'
	    })
		    .find('canvas')
		    .attr('id', 'canvas' + this.model.getId());
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
	/**
	 * Check fullscreen state and toggles fullscreen mode on/off.
	 */
	fullScreenState: function() {
	    if (this.model.get('fullScreen')) {
		this.enterFullScreen();
		Pi.router.navigate(Pi.action.openProject + "/" + this.model.getId() + "/fs");
	    }
	    else {
		this.exitFullScreen();
		Pi.router.navigate(Pi.action.openProject + "/" + this.model.getId() + "/play");
	    }
	},
	/**
	 * Exit full screen.
	 */
	exitFullScreen: function() {
	    var that = this;
	    this.adjustSize();
	    Pi.user.nav.show(that, function(output) {
		output.$el.removeClass('fullscreen');
		output.positionState();
		$('#forkongithub').show();
	    });
	},
	/**
	 * Enter full screen.
	 */
	enterFullScreen: function() {
	    var that = this;
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
		    this.model.set('outputResized', true);
		}
	    }
	    else
	    {
		if (this.model.get('outputResized')) {
		    this.$el.find('canvas').css({
			'width': w,
			'height': h
		    });
		    this.model.set('outputResized', false);
		}
	    }
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
	    }
	},
	/**
	 * Toggle pause/play.
	 */
	togglePause: function() {
	    if (this.model.get('isPaused')) {
		this.model.set('isPaused', false);
		this.processingInstance['unpause' + this.model.uid]();
	    }
	    else
	    {
		this.model.set('isPaused', true);
		this.processingInstance['pause' + this.model.uid]();
	    }
	}
    });

    return OutputView;

});
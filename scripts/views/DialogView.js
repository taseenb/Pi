define([
    // Main scripts
    'Pi', 'backbone', 'jquery', 
    
    // Backbone Extensions
    
    // Plugins
    'jquery-ui'
    
], function(Pi, Backbone, $) {

    "use strict";

    var DialogView = Backbone.View.extend({
	/**
	 * Init the view.
	 */
	initialize: function() {
	    this.listenTo(this.model, "change:content", this.render);
	    this.listenTo(this.model, "change:height change:width", this.sizeState);
	    //this.render();
	},
	/**
	 * Set dialog as not initialized yet (necessary for Jquery UI dialog).
	 */
	init: false,
	tagName: 'div',
	render: function() {
	    var that = this,
		    model = this.model.attributes;

	    this.$el
		    .html(model.content)
		    .dialog({
		title: model.title,
		modal: true,
		closeOnEscape: true,
		autoOpen: false,
		height: model.height,
		width: model.width,
		resizable: false,
		draggable: false,
		close: function() {
		    Pi.user.nav.deactivateAll();
		    window.location.hash = ""; //Pi.router.goHome(); //
		},
		// Add buttons dynamically only AFTER the creation of the jquery ui dialog 
		// (adding it before will result in an error)
		create: function() {
		    var btns = model.buttons;
		    $(this).dialog({
			'buttons': !_.isEmpty(btns) || !_.isUndefined(btns) ? this.createButtons(btns) : {}
		    });
		}
	    });

	    // Add close icon
	    this.$el.dialog('widget')
		    .find('.ui-dialog-titlebar-close')
		    .addClass('text-shadow')
		    .html('<i class="icon-remove-sign"></i>');

	    this.init = true;
	    this.sizeState();
	    this.open();

	    return this;
	},
	
	/**
	 * Create buttons for the dialog. (add necessary classes)
	 * @param {object} buttons Key-value pairs representation fo the button
	 */
//	createButtons: function(_btns) {
//	    var btns = [];
//	    _.each(_btns, function(btn) {
//		//btn.text
//	    });
//	    
//	    return btns;
//	},
	
	/**
	 * Show the dialog.
	 */
	open: function() {
	    this.$el.dialog("open");
	},
	/**
	 * Hide the dialog.
	 */
	close: function() {
	    this.$el.dialog("close");
	},
	/**
	 * Destroy the dialog (jquery ui instance).
	 */
	 destroy: function() {
	     this.$el.dialog( "destroy" );
	 },
	/**
	 * Destroy the dialog (jquery ui instance).
	 */
	 refresh: function() {
	     this.destroy();
	     this.render();
	 },
	/**
	 * Animations.
	 */
	sizeState: function() {
	    if (this.init) {
		var that = this,
//			widget = this.$el.dialog("widget"),
			height = this.model.get("height"),
			width = this.model.get("width");
		
//		widget.css({
//		    height: height,
//		    width: width
//		});
		that.$el.dialog({
		    position: {
			my: "center",
			at: "center",
			of: window
		    },
		    height: height,
		    width: width
		}).show();
		
//		widget.animate({
//		    height: height,
//		    width: width
//		},
//		200, 'easeInOutCirc', function() {
//		    that.$el.dialog({
//			position: {
//			    my: "center",
//			    at: "center",
//			    of: window
//			},
//			height: height,
//			width: width
//		    })
//			    .fadeIn(200);
//		});

	    }
	}
    });
    
    return DialogView;

});
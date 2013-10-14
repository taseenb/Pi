define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Plugins
    'jquery-ui'

], function(Pi, Backbone, $) {

    "use strict";

    var DialogView = Backbone.View.extend({
	initialize: function() {
	    this.listenTo(this.model, "change:content", this.render);
	},
	// Set dialog as not initialized yet (necessary for Jquery UI dialog).
	init: false,
	render: function() {
	    //console.log('render');
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
		buttons: model.buttons,
		close: function() {
		    Pi.user.nav.deactivateAll();
		},
		create: function() {
		    // Add Bootstrap style to buttons
		    that.$el.dialog('widget')
			    .find(".ui-button")
			    .not('.ui-dialog-titlebar-close')
			    .addClass('btn')
			    .css({
			"margin-left": 10
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
	    if (this.init) {
		this.$el.dialog("destroy");
		this.init = false;
	    }
	},
	/**
	 * Destroy the dialog (jquery ui instance).
	 */
	refresh: function() {
	    this.$el.empty();
	    this.destroy();
	    this.render();
	},
	/**
	 * On size change.
	 */
	sizeState: function() {
	    //console.log('size state');
	    if (this.init) {
		var that = this,
			height = this.model.get("height"),
			width = this.model.get("width");
		that.$el.dialog({
		    position: {
			my: "center",
			at: "center",
			of: window
		    },
		    height: height,
		    width: width
		}).show();
	    }
	}
    });

    return DialogView;

});
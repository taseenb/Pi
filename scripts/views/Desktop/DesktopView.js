define([
    'Pi', 'backbone', 'jquery',

    // Plugins
    "jquery-ui"
    
], function(Pi, Backbone, $) {

    "use strict";

    var DesktopView = Backbone.View.extend({
	el: "#desktop",
	className: "desktop",
	initialize: function()
	{
	    this.listenTo(this.model, "change:active", this.activeState);
	},
	events:
		{
		    'mousedown': function(e)
		    {
			e.stopPropagation();
			this.model.set({
			    active: true
			});
			window.location.hash = "";
		    }
		},
	/**
	 * Desktop active state (deactivate all windows if desktop is active).
	 */
	activeState: function()
	{
	    if (this.model.get('active')) {
		// console.log('desktop active');
		Pi.user.get('projects').each(function(model) {
		    model.set({
			active: false
		    });
		});
	    }
	},
	show: function() {
	    this.$el.show();
	},
	hide: function() {
	    this.$el.hide();
	},
	/**
	 * Static Pi icon (always visible)
	 */
	createPiIcon: function() {
	    var that = this;
	    $("#icon_main")
		    .css({
		top: that.$el.height() - 200,
		left: that.$el.width() - 200
	    })
		    .show()
		    .draggable({
		containment: "parent",
		zIndex: 100
	    });
	}

    });

    return DesktopView;

});
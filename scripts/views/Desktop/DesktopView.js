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
	    this.listenTo(this.model, "change:backgroundImage change:backgroundColor", this.bgState);
	    this.bgState();
	},
	events:
		{
		    'mousedown': function(e)
		    {
			e.stopPropagation();
			this.model.set({
			    active: true
			});
			window.location.hash = "desktop";
		    }
		},
	/**
	 * Desktop active state (deactivate all windows if desktop is active).
	 */
	activeState: function()
	{
	    if (this.model.get('active')) {
		Pi.user.get('projects').deactivateAllOpen();
		Pi.user.finderView.hide();
		Pi.user.nav.activate("desktop");
		Pi.user.desktopBootstrap(Pi.bootstrap);
	    }
	    else
	    {
		Pi.user.nav.deactivate("desktop");
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
	},
	bgState: function() {
	    var img = this.model.get("backgroundImage");
	    var color = this.model.get("backgroundColor");
	    if (img) {
		$('#desktop_bg').css('background-image', img);
	    }
	    if (color) {
		$('#desktop_bg').css('background-color', color);
	    }
	}

    });

    return DesktopView;

});
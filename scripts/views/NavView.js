define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Templates
    "text!tpl/NavRightGuest.html",
    "text!tpl/NavRight.html",
    "text!tpl/NavLeft.html",
    // Plugins
    "bootstrap-dropdown"

], function(Pi, Backbone, $, NavRightGuestHtml, NavRightHtml, NavLeftHtml) {

    "use strict";

    var NavView = Backbone.View.extend({
	initialize: function() {
	    this.listenTo(this.model, "change:id", this.render);
	    this.listenTo(this.model, "change:username change:email", this.nameState);
	},
	events: {
	    "mousedown": function(e) {
		e.stopPropagation();
		var item = $(e.target).closest('li');
		item.addClass('active');
		item.on("mouseup mouseout", function() {
		    item.removeClass('active');
		    item.off();
		});
	    }
	},
	/**
	 * Render nav by pulling items to the left and right unordered lists.
	 */
	render: function() {
	    // Nav left side
	    this.$el.find('.pull-left').html(NavLeftHtml);

	    // Nav right side
	    if (!Pi.isGuest) {
		this.$el.find('.pull-right')
			.html(_.template(NavRightHtml, {
		    //basePath: Pi.basePath,
		    username: this.model.getFullName(),
		    //userId: Pi.user.id,
		    avatar: Pi.user.getAvatar()
		}));
	    }
	    else
	    {	
		this.$el.find('.pull-right')
		    .html(NavRightGuestHtml);
	    }
	    

	    return this;
	},
	nameState: function() {
	    var name = this.model.getFullName();
	    this.$el.find("#username").text(name);
	},
	lastvisit_atState: function() {
	    this.$el.find("#lastvisit_at").text(this.model.get('lastvisit_at'));
	},
	/**
	 * Add 'active' class to the active item in the nav bar.
	 * @param {string} href Name of the href attribute of the link to be activated.
	 */
	activate: function(href) {
	    this.deactivateAll();
	    this.$el.find('a[href=#' + href + ']').closest('li').addClass('active');
	},
	/**
	 * Remove 'active' class from all the items in the nav bar.
	 */
	deactivateAll: function() {
	    this.$el.find('li').removeClass('active');
	},
	/**
	 * Hide nav with navigation.
	 */
	hide: function(outputWindow, callback) {
	    this.$el.animate({
		top: "-31"
	    },
	    200, "easeOutQuad", function() {
		Pi.user.currentDesktop.$el.css({
		    'top': 0
		});
		callback(outputWindow);
	    });
	},
	show: function(outputWindow, callback) {
	    this.$el.animate({
		top: "0"
	    },
	    200, function() {
		Pi.user.currentDesktop.$el.css({
		    'top': 31
		});
		callback(outputWindow);
	    });
	}
    });

    return NavView;

});
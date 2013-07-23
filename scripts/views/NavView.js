define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Templates
    "text!tpl/NavLeft.html",
    "text!tpl/NavRight.html",
	    // Plugins
    "bootstrap-dropdown"

], function(Pi, Backbone, $, NavLeftHtml, NavRightHtml) {

    "use strict";

    var navLeftTemplate = _.template(NavLeftHtml);
    var navRightTemplate = _.template(NavRightHtml);

    var NavView = Backbone.View.extend({
	initialize: function() {
	    this.listenTo(this.model, "change:id", this.render);
	    this.listenTo(this.model, "change:username change:email", this.nameState);
	    this.listenTo(this.model, "change:lastvisit_at", this.lastvisit_atState);
	},
	events: {
	    "mousedown": function(e) {
		//e.preventDefault();
		e.stopPropagation();
		var item = $(e.target).closest('li');
		item.addClass('active');
		item.on("mouseup mouseout", function() {
		    item.removeClass('active');
		    item.off();
		});
	    },
//	    "click": function(e) {
//		//e.stopPropagation();
//		//e.preventDefault();
//		// Toggle Nva Dropdowns
//		if ($(e.target).attr("data-toggle") == "dropdown") {
//		    e.preventDefault();
//		    var clicked = $(e.target);
//		    var clickedId = clicked.attr('id');
//		    var menu = this.$el.find("ul[aria-labelledby=" + clickedId + "]");
//		    if (menu.data('active')) {
//			this.closeDropdown(menu);
//		    } else {
//			this.openDropdown(menu);
//		    }
//		}
//		else
//		{
//		    this.closeDropdown($(".dropdown-menu"));
//		}
//	    },
//	    "click .dropdown-menu": function(e) {
//		this.closeDropdown($(e.target).closest(".dropdown-menu"));
//	    }

	},
	/**
	 * Render nav by pulling items to the left and right unordered lists.
	 */
	render: function() {

	    // Nav left side
	    this.$el.find('.pull-left')
		    .html(navLeftTemplate({
		isGuest: Pi.isGuest,
	    }));

	    // Nav right side
	    this.$el.find('.pull-right')
		    .html(navRightTemplate({
		isGuest: Pi.isGuest,
		basePath: Pi.basePath,
		fullName: this.model.getFullName()

	    }));

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
		top: "-30"
	    },
	    200, "easeOutQuad");
	    $('#desktop_container').animate({
		'top': 1
	    },
	    200, "easeOutQuad", function() {
		callback(outputWindow);
	    });
	},
	show: function(outputWindow, callback) {
	    this.$el.animate({
		top: "0"
	    },
	    200);
	    $('#desktop_container').animate({
		'top': 31
	    },
	    200, function() {
		callback(outputWindow);
	    });
	},
//	openDropdown: function(menu) {
//	    menu.show();
//	    menu.data('active', true);
//	},
//	closeDropdown: function(menu) {
//	    menu.hide();
//	    menu.data('active', false);
//	}
    });

    return NavView;

});
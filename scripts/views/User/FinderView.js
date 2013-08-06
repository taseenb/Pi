define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Collections
    // Models
    // Views
    'views/Project/FinderProjectView',
    // Templates
    // Bootstrap
    "bootstrap-tab"

], function(Pi, Backbone, $) {

    "use strict";

    var FinderView = Backbone.Epoxy.View.extend({
	/**
	 * Data binding.
	 */
	bindings: "data-e-bind",
	bindingHandlers: _.extend(Pi.bindingHandlers, {
	}),
	bindingSources: {
	    myProjects: Pi.user.get('projects'),
	},
	initialize: function() {
	    this.listenTo(this.model, "change:guest", this.guestState);
	    this.fetchMyProjects();
	},
	events: {
	    "click .exit": function() {
		this.hide();
	    }
	},
	/**
	 * Try to fetch user's projects from the server.
	 */
	fetchMyProjects: function() {
	    if (!this.model.isGuest()) {
		this.model.get('projects').fetch();
	    }
	},
	/**
	 * Show the finder window.
	 */
	show: function() {
	    // Trigger a click on the desktop to set all windows inactive
	    Pi.user.nav.activate("find");
	    this.$el.addClass('active');
	    Pi.user.get('projects').deactivateAllOpen();
	},
	/**
	 * Hide the finder window.
	 */
	hide: function() {
	    Pi.user.nav.deactivateAll();
	    this.$el.removeClass('active');
	},
	/**
	 * On guest state change, try to fetch user's projects.
	 */
	guestState: function() {
	    this.fetchMyProjects();
	}
    });

    return FinderView;

});
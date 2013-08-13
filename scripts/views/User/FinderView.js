define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Collections
    "collections/Projects",
    // Models
    // Views
//    'views/Project/FinderProjectView',
    // Templates
    // Bootstrap
    "bootstrap-tab",
    // Start
    'Pi/start/startFinder'

], function(Pi, Backbone, $, Projects) {

    "use strict";

    var FinderView = Backbone.Epoxy.View.extend({
	/**
	 * Data binding.
	 */
	bindings: "data-e-bind",
	bindingHandlers: _.extend(Pi.bindingHandlers, {
	}),
	bindingSources: {
	    // User's projects
	    'myProjects': Pi.user.get('projects'),
	    // Other project collections
	    'featured': new Projects(),
	    'mostAppreciated': new Projects(),
	    'mostViewed': new Projects()
	},
	initialize: function() {
	    this.listenTo(this.model, "change:guest", this.guestState);
	    this.fetchMyProjects();
	    
	    
	    this.bindingSources.featured.fetch({data: {
		    'tabs': 0,
		    'top': 'featured'
	    }});
	
	    this.bindingSources.mostAppreciated.fetch({data: {
		    'tabs': 0,
		    'top': 'mostAppreciated'
	    }});
	
	    this.bindingSources.mostViewed.fetch({data: {
		    'tabs': 0,
		    'top': 'mostViewed'
	    }});
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
	    if (!this.model.isGuest())
		this.model.get('projects').fetch({data: {
		    'ownedByUser': 1,
		    'tabs': 0
	    }});
	},
	/**
	 * Show the finder window.
	 */
	show: function() {
	    // Trigger a click on the desktop to set all windows inactive
//	    Pi.user.nav.activate("find");
//	    this.$el.addClass('active');
	    Pi.user.get('projects').deactivateAllOpen();
	    Pi.desktop.set('active', false);
	    this.$el.show();

//	    this.$el.animate({
//		'top': '34px',
//		'bottom': 0
//	    }, 400);
//	    Pi.desktopView.$el.animate({
//		'top': '100%'
//	    }, 400);
	},
	/**
	 * Hide the finder window.
	 */
	hide: function() {
//	    Pi.user.nav.deactivateAll();
//	    this.$el.removeClass('active');
//	    Pi.router.goHome();

	    this.$el.hide();

//	    this.$el.animate({
//		'top': '-100%',
//		'bottom': '100%'
//	    }, 400);
//	    Pi.desktopView.$el.animate({
//		'top': '34px'
//	    }, 400);
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
define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Collections
    "collections/Projects",
    // Models
    // Views
    'views/Project/FinderProjectView',
    // Templates
    // Bootstrap
    "bootstrap-tab",
    // Start
    'Pi/start/startFinder'

], function(Pi, Backbone, $, Projects, FinderProjectView) {

    "use strict";
    
    var FinderView = Backbone.View.extend({
	/**
	 * Data binding.
	 */
//	bindings: "data-e-bind",
//	bindingHandlers: _.extend(Pi.bindingHandlers, {
//	}),
//	bindingSources: {
//// User's projects
////	    'myProjects': Pi.user.get('projects'),
//	    // Other project collections
////	    'featured': new Projects(),
////	    'mostAppreciated': new Projects(),
////	    'mostViewed': new Projects()
//	},
	projectCollections: {
	    'featured': new Projects(),
	    'mostAppreciated': new Projects(),
	    'mostViewed': new Projects()
	},
	initialize: function() {
	    // this.listenTo(this.model, "change:guest", this.guestState);
	    this.listenTo(this.model, "change:projects", this.showMyProjects);
	    // this.fetchMyProjects();
	    // this.fetchProjectCollections();
	    
	    // Get user's projects (if available)
	    this.showMyProjects();

	    // Get projects from default collections 
	    // (featured, mostAppreciated, mostViewed)
	    var that = this,
		    keys = _.keys(this.projectCollections);
	    _.each(keys, function(key) {
		that.createProjectViews(key, that.projectCollections[key]);
	    });
	    
	},
	createProjectViews: function(key, collection) {
	    var that = this;

	    // Fetch projects from the collection
	    // and create the project views for the finder
	    collection.fetch({
		'data': {
		    'tabs': 0,
		    'top': key
		},
		'success': function(collection, response, options) {
		    //console.log(collection);
		    collection.each(function(project) {
			var projectView = new FinderProjectView({
			    'model': project
			});
			//console.log('#' + key);
			that.$el.find('#' + key).append(projectView.$el);
		    });

		}
	    });
	},
//	events: {
//	    "click .exit": function() {
//		this.hide();
//	    }
//	},
	/**
	 * Try to fetch user's projects from the server.
	 */
//	fetchMyProjects: function() {
//	    if (!this.model.isGuest()) {
//		
//		if (this.model.get('projects') instanceof Backbone.Collection) {
//		    console.log(this.model.get('projects') instanceof Backbone.Collection);
//		}
//		
//	    }
//	    
////	    if (!this.model.isGuest())
////		this.bindingSources.myProjects.fetch({
////		    data: {
////			'ownedByUser': 1,
////			'tabs': 0
////		    }
////		});
//	},
	/**
	 * Show the finder window.
	 */
	show: function() {
// Trigger a click on the desktop to set all windows inactive
//	    Pi.user.nav.activate("find");
//	    this.$el.addClass('active');
	    this.model.get('projects').deactivateAllOpen();
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
	showMyProjects: function() {
	    var that = this;
	    if (!this.model.isGuest()) {
		this.model.get('projects').each(function(project) {
			var projectView = new FinderProjectView({
			    'model': project
			});
			that.$el.find('#myProjects').append(projectView.$el);
		    });
		this.$el.find('#finder_tabs').find('li').removeClass('active');
		this.$el.find('.projects_wrapper').find(' div').removeClass('active');
		this.$el.find('#myProjects, #myProjectsTab').addClass('active').removeClass('hide');
	    }
	}
    });
    
    return FinderView;

});
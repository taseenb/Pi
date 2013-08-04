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

], function(Pi, Backbone, $, FinderProjectView) {

    "use strict";

    var FinderView = Backbone.Epoxy.View.extend({
	/**
	 * Data binding.
	 */
	bindings: "data-e-bind",
	bindingHandlers: _.extend(Pi.bindingHandlers, {
	}),
	initialize: function() {
	    this.listenTo(this.model, "change:guest", this.guestState);
	    this.fetchProjects();
	},
	events: {
	    "click .exit": function() {
		this.hide();
	    }
	},
	render: function() {
	    var $tabs = this.$el.find("#finder_tabs");
	    var $projectsWrapper = this.$el.find('.projects_wrapper');

	    // Append my projects (user's projects)
	    this.model.get('projects').each(function(project) {
		var finderProjectView = new FinderProjectView({
		    model: project
		});
		finderProjectView.container = $projectsWrapper.find('#my');
		finderProjectView.render();
	    }, this);
	    $tabs.find("li:first").addClass('active');
	    $projectsWrapper.find(".projects:first").addClass('active');
	},
	/**
	 * Try to fetch user's projects from the server and render them in the finder.
	 */
	fetchProjects: function(_page) {
	    var page = _page ? _page : 1;
	    console.log("fetching projects");
	    if (!this.model.isGuest()) {
		var that = this;
		console.log(Pi.user.get('projects').length);
		this.model.get('projects').fetch({
		    data: {
			'page': page
		    },
		    success: function() {
			console.log("rendering projects");
			console.log(Pi.user.get('projects').length);
			that.render();
		    },
		    error: function() {
			console.log("error while fetching projects");
		    }
		});
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
	    console.log('guest change: ' + this.model.get('guest'));
	    this.fetchProjects();
	}
    });

    return FinderView;

});
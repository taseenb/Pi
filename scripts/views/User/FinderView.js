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
	initialize: function() {
	    var that = this;
	    Pi.user.get('projects').fetch({
		success: function() {
		    that.render();
		}
	    });
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
		finderProjectView.container = $projectsWrapper.find('#my_projects');
		finderProjectView.render();
	    }, this);
	    
	    $tabs.find("li:first").addClass('active');
	    $projectsWrapper.find(".projects:first").addClass('active');
	},
	show: function() {
	    // Trigger a click on the desktop to set all windows inactive
	    Pi.user.currentDesktop.$el.trigger('mousedown');
	    this.$el.addClass('active');
	},
	hide: function() {
	    this.$el.removeClass('active');
	}
    });

    return FinderView;

});
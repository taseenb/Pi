define([
    // Main
    'Pi', 'backbone', 'jquery',
    // Models
    "models/Project",
    // Backbone Extensions
    'Pi/Collection'

], function(Pi, Backbone, $, Project) {

    "use strict";

    var Projects = Backbone.Collection.extend({
	url: Pi.basePath + '/projects?tabs=0',
	model: Project,
	/**
	 * Init collection.
	 */
	initialize: function() {

	    /**
	     * Increase the total sessions counter (used by Ide.createNewTitle()).
	     */
	    this.on("add", function()
	    {
		Pi.sessions++;
	    });

	    /**
	     *  Destruction of all references to removed objects 
	     *  is important to avoid memory leaks!
	     *  @param {model} ide The ide model removed from the collection.
	     */
	    this.on("remove", function(project)
	    {
		if (project.get('front'))
		    this.bringNextToFront();

		// Remove Icon View
		if (project.iconView) {
		    //project.iconView.$el.draggable('destroy');
		    project.iconView.remove();
		    delete project.iconView.model;
		    delete project.iconView;
		}

		// Remove Output View
		project.stopSketch({
		    liveCode: false,
		    hide: true
		});
		if (project.outputView) {
		    //project.outputView.$el.draggable('destroy');
		    project.outputView.remove();
		    delete project.outputView.model;
		    delete project.outputView.processingInstance;
		    delete project.outputView;
		}

		// Destroy Ide View
		if (project.ideView) {
		    //project.ideView.$el.resizable('destroy');
		    //project.ideView.$el.draggable('destroy');
		    // Remove ide view
		    project.ideView.remove();
		    delete project.ideView;
		}
		// Remove all ide listeners
//		ide.clear();
//		ide.off();
		// Stop auto save interval.
		project.stopAutoSave();
	    });
	},
	/**
	 * After closing an Ide, brings the next one to the front.
	 */
	bringNextToFront: function()
	{
	    var highestZ = -100000,
		    firstIde;
	    _.each(this.models, function(ide) {
		var z = ide.get('zIndex');
		if (z > highestZ) {
		    highestZ = z;
		    firstIde = ide;
		}
	    });
	    if (firstIde)
		firstIde.set({
		    front: true
		});
	},
	/**
	 * Get active ide (in front).
	 */
	getFirst: function() {
	    var openProjects = this.getOpen();
	    var openCount = openProjects.length;
	    if (openCount) {
		for (var i = 0; i < openCount; i++) {
		    if (openProjects[i].get('front') || openProjects[i].get('active'))
			return openProjects[i];
		}
	    }
	},
	/**
	 * Get only the open ides.
	 */
	getOpen: function() {
	    var openIdes = [];
	    _.each(this.models, function(model) {
		if (model.get('open'))
		    openIdes.push(model);
	    });
	    return openIdes;
	},
	/**
	 * Set all projects as not active (active: false)
	 */
//	deactivateAll: function() {
//	    this.each(function(model) {
//		model.set({
//		    active: false
//		});
//	    });
//	},
	/**
	 * Set all open projects as not active (active: false)
	 */
	deactivateAllOpen: function() {
	    _.each(this.getOpen(), function(model) {
		model.set({
		    active: false
		});
	    });
	}
    });

    return Projects;

});
define([
    // Main
    'Pi', 'backbone', 'jquery',
    // Models
    "models/Ide",
    
    // Backbone Extensions
    'Pi/Collection'
    
], function(Pi, Backbone, $, Ide) {

    "use strict";

    var Ides = Backbone.Collection.extend({
	UrlRoot: Pi.basePath + '/projects/',
	model: Ide,
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
	    this.on("remove", function(ide)
	    {
		if (ide.get('front'))
		    this.bringNextToFront();

		// Remove Icon
		ide.icon.$el.draggable('destroy');
		ide.icon.remove();
		delete ide.icon.model;
		delete ide.icon;

		// Remove Output
		ide.stopSketch({ liveCode: false, hide: true });
		if (ide.outputView) {
		    ide.outputView.$el.draggable('destroy');
		    ide.outputView.remove();
		    delete ide.outputView.model;
		    delete ide.outputView.processingInstance;
		    delete ide.outputView;
		}

		// Remove all tabs
		var tabs = ide.tabs;
		_.each(tabs.models, function(tab)
		{
		    tabs.remove(tab);
		});

		// Remove events from Tabs collection
		tabs.off();
		delete ide.tabs;
		// Destroy Jquery UI elements
		ide.view.$el.resizable('destroy');
		ide.view.$el.draggable('destroy');
		// Remove ide view
		ide.view.remove();
		delete ide.view;
		delete ide.container;
		// Remove all ide listeners
//		ide.clear();
//		ide.off();
		// Stop auto save interval.
		ide.stopAutoSave();
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
	     var first;
	     this.each(function(ide) {
//		 console.log(ide.get('front'));
		 if (ide.get('front') || ide.get('active'))
		     first = ide;
	     });
	     return first;
	 }
    });
    
    return Ides;

});
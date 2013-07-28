define([
    // Main
    'Pi', 'backbone', 'jquery',
    // Collections
    // Models
    "models/Collection",
    // Views
    
    // Backbone Extensions
    'Pi/Collection'
    
], function(Pi, Backbone, $, Collection) {

    "use strict";

    var Collections = Backbone.Collection.extend({
	
	url: Pi.basePath + '/collections/',
		
	model: Collection,
	/**
	 * Init collection.
	 */
	initialize: function()
	{

	}

    });
    
    return Collections;

});
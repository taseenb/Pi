define([
    // Main
    'Pi', 'backbone', 'jquery',
    // Collections
    // Models
    // Views
    
    // Backbone Extensions
    'Pi/Collection'
    
], function(Pi, Backbone, $) {

    "use strict";

    var Collections = Backbone.Collection.extend({
	UrlRoot: Pi.basePath + '/collections/',
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
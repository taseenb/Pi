define([
    // Main
    'Pi', 'backbone', 'jquery',
    // Collections
    // Models
    // Views
    
    // Backbone Extensions
    'Pi/Model'
    
], function(Pi, Backbone, $) {

    "use strict";

    var Collection = Backbone.Model.extend({
	
	urlRoot: Pi.basePath + '/collection',
		
	initialize: function() {
	    
	}
    });
    
    return Collection;

});
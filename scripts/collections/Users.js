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

    var Users = Backbone.Collection.extend({
	UrlRoot: '/users/',
	model: User,
	initialize: function() {

	}

    });
    
    return Users;

});
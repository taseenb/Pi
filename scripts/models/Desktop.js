define([
    'Pi', 'backbone', 'jquery',
    
    // Backbone Extensions
    'Pi/Model'

], function(Pi, Backbone, $) {

    "use strict";

    var Desktop = Backbone.Model.extend({
	defaults: {
	    visible: true,
	    active: true
	},
	initialize: function() {

	}

    });
    
    return Desktop;

});
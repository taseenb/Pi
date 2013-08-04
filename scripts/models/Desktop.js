define([
    'Pi', 'backbone', 'jquery',
    
    // Backbone Extensions
    'Pi/Model'

], function(Pi, Backbone, $) {

    "use strict";

    var Desktop = Backbone.Model.extend({
	modelName: "Desktop",
	defaults: {
	    backgroundImage: "", // img path
	    backgroundColor: "", // hex color
	    visible: true,
	    active: true
	},
	initialize: function() {

	}

    });
    
    return Desktop;

});
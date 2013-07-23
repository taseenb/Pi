define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Collections
    // Models
    // Views

    // Backbone Extensions
    'Pi/Model'

], function(Pi, Backbone, $, PageHtml) {

    "use strict";

    var Page = Backbone.Model.extend({
	default: {
		"active": false,
	    "template": "default"
	}

    });

    return Page;

});
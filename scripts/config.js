"use strict";

var require = {
    paths: {
	// Jquery
	"jquery": "lib/jquery/jquery-2.0.3.min",
		
	// Backbone + Underscore
	"backbone": "lib/backbone-amd/backbone",
	"underscore": "lib/underscore-amd/underscore",
	"backboneRelational": 'libs/backbone/backbone-relational',
	"backboneCollectionBinder": 'libs/backbone-binder/Backbone.CollectionBinder',
	"backboneModelBinder": 'libs/backbone-binder/Backbone.ModelBinder',
	
	// Jquery plugins	
	"jquery-ui": "lib/jquery-ui/jquery-ui-1.10.3.custom.min",
	"jquery-easing": "lib/plugins/jquery.easing.min",
	
	// Processing
	"processing": "lib/processing/processing-1.4.1",
		
	// Bootstrap
	"bootstrap-dropdown": "lib/bootstrap/bootstrap-dropdown",
		
	// Ace
	"ace": "lib/ace-builds/src-noconflict/ace",
		
	// Require.js plugins
	"text": "lib/require/text"
    },
    // Traditional browser globals scripts
    shim: {
	'processing': {
	    //deps: ['underscore', 'jquery'],
	    exports: 'Processing'
	},
	'ace': {
	    //deps: ['underscore', 'jquery'],
	    exports: 'ace'
	}
    }
};

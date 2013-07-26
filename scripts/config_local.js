"use strict";

var require = {
    paths: {
	// Jquery
	"jquery": "lib/jquery/jquery-2.0.3.min",
		
	// Backbone + Underscore
	"backbone": "lib/backbone-amd/backbone",
	"underscore": "lib/underscore-amd/underscore",
	"relational": 'lib/backbone/backbone-relational',
	"epoxy": 'lib/backbone-epoxy/backbone.epoxy', // data binding
	//"rivets": 'lib/rivets/rivets.min',
	
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

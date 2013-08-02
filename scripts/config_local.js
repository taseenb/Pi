"use strict";

var require = {
    paths: {
	// Jquery
	"jquery": "lib/jquery/jquery-2.0.3.min",
		
	// Backbone + Underscore
	"backbone": "lib/backbone/backbone",
	"underscore": "lib/underscore/underscore",
	"relational": 'lib/backbone-relational/backbone-relational',
	"epoxy": 'lib/backbone-epoxy/backbone.epoxy', // data binding
	//"rivets": 'lib/rivets/rivets.min',
	
	// Jquery plugins	
	//"jquery-ui": "lib/jquery-ui/jquery-ui-1.10.3.custom.min",
	"jquery-ui": "lib/jquery-ui/jquery-ui.min",
	"jquery-easing": "lib/plugins/jquery.easing.min",
	
	// Processing
	"processing": "lib/processing/processing-1.4.1",
		
	// JsHint
	"jshint": "lib/jshint/jshint-2.1.4",
		
	// Bootstrap
	"bootstrap-dropdown": "lib/bootstrap/bootstrap-dropdown",
	"bootstrap-tab": "lib/bootstrap/bootstrap-tab",
		
	// Ace
	"ace": "lib/ace-builds/src-noconflict/ace",
		
	// Require.js plugins
	"text": "lib/require/text",
	"domReady": "lib/require/domReady"
    },
    // Traditional browser globals scripts
    shim: {
	'underscore': {
	    exports: '_'
	},
	'backbone': {
	    deps: ['underscore', 'jquery'],
	    exports: 'Backbone'
	},
	'relational': {
	    deps: ['backbone'],
	    exports: 'relational'
	},
	'processing': {
	    exports: 'Processing'
	},
	'ace': {
	    exports: 'ace'
	},
	'jshint': {
	    exports: 'JSHINT'
	}
    }
};

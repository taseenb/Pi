"use strict";

var require = {
    paths: {
	// Jquery
	//"jquery": "lib/jquery/jquery-2.0.3.min",
	"jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min",
	
		
	// Backbone + Underscore
	//"backbone": "lib/backbone-amd/backbone",
	"backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min",
	
	//"underscore": "lib/underscore-amd/underscore",
	"underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min",
	
	"relational": 'lib/backbone/backbone-relational',
	"epoxy": 'lib/backbone-epoxy/backbone.epoxy.min', // data binding
	//"rivets": 'lib/rivets/rivets.min',
	
	// Jquery plugins	
	//"jquery-ui": "lib/jquery-ui/jquery-ui-1.10.3.custom.min",
	"jquery-ui": "//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min",
	"jquery-easing": "lib/plugins/jquery.easing.min",
	
	// Processing
	//"processing": "lib/processing/processing-1.4.1",
	"processing": "//cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.1/processing.min",
		
	// JsHint
	"jshint": "lib/jshint/jshint.min",
	
	// Bootstrap
	"bootstrap-dropdown": "lib/bootstrap/bootstrap-dropdown",
	"bootstrap-tab": "lib/bootstrap/bootstrap-tab",
		
	// Ace
	//"ace": "lib/ace-builds/src-noconflict/ace",
	"ace": "lib/ace-builds/src-min-noconflict/ace",
	//"ace": "//cdnjs.cloudflare.com/ajax/libs/ace/0.2.0/ace.min",
		
	// Require.js plugins
	//"text": "lib/require/text"
	"text": "//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.5/text.min"
	
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
	
	'processing': {
	    //deps: ['underscore', 'jquery'],
	    exports: 'Processing'
	},
	'ace': {
	    //deps: ['underscore', 'jquery'],
	    exports: 'ace'
	},
	'jshint': {
		exports: 'JSHINT'
	}
    }
};

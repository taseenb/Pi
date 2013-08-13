define([
    'Pi', 'backbone', 'jquery',
    
    // Backbone Extensions
    'Pi/Model'

], function(Pi, Backbone, $) {

    "use strict";

    var Desktop = Backbone.Model.extend({
	modelName: "Desktop",
	defaults: {
	    backgroundImage: Pi.defaultDesktopImage, // string image url for css (ex.: "url(/path/img.jpg)")
	    backgroundColor: Pi.defaultDesktopColor, // string hex color (ex. "#FFCC00")
	    visible: true,
	    active: false
	}

    });
    
    return Desktop;

});
$(function() {

    "use strict";

    window.Collection = Backbone.Model.extend({
	urlRoot: Pi.basePath + '/collection',
    });

});
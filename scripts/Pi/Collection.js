/**
 * Add features to the Backbone.Collection class.
 */
define([
    'backbone'
    
], function(Backbone) {

    "use strict";

    /**
     * Apply a set of attributes to all the models in this collection, 
     * but ignore the one in the argument.
     * @param {object} attributes	    Keys and values of attributes to change.
     * @param {int or string} id	    Tab id that will NOT be changed.
     */
    Backbone.Collection.prototype.setAll = function(attributes, id) {
	_.each(this.models, function(model) {
	    if (model.getId() !== id)
		model.set(attributes);
	});
    };

    return Backbone;

});
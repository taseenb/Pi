define([
    'Pi', 'backbone', 'jquery'

], function(Pi, Backbone, $) {

    "use strict";

    /**
     * Static helper methods.
     */
    Pi.json = {
	
	/**
	 * Given a Json object, convert all the boolean values into integers 0 and 1.
	 * @param {json object} json The json object to process.
	 * @returns {json object}
	 */
	boolsToInts: function(data) {
	    var json = data;
	    _.each(json, function(value, key) {
		if (_.isBoolean(value)) {
		    json[key] = value ? 1 : 0;
		}
	    }, this);
	    return json;
	},
	/**
	 * Given a Json object, convert all the integer values of 0 and 1 into booleans.
	 * @param {json object} json The json object to process.
	 * @returns {json object}
	 */
	intsToBools: function(data) {
	    var json = data;
	    _.each(json, function(value, key) {
		if (value === 0 || value === 1) {
		    json[key] = value ? true : false;
		}
	    }, this);
	    return json;
	}

    };

    return Pi;

});
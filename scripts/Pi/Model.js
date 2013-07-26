/**
 * Add features to Backbone.Model class and Backbone.ajax.
 */
define([
    'Pi', 'backbone'
], 
function(Pi, Backbone) {

    "use strict";

    Backbone.Model = Backbone.Model.extend({
	/**
	 * Start tracking changes by storing changed attributes (key:value pairs) 
	 * into an unsavedAttributes object.
	 * An optional array of attributes to track can be provided as an argument. 
	 * If no argument is given, all attribute changes will be tracked.
	 * This method should be launched when initializing the model.
	 * @param {array} strings attributes    Optional list of strings with the names of 
	 *					    attributes to track (generally the 
	 *					    safe attributes to be saved on the server).
	 */
	trackUnsaved: function(attributes) {
	    // Create an unsavedAttributes object
	    this.unsavedAttributes = {
	    };
	    // Track all events by default
	    var eventsToTrack = "change";
	    // If an argument is provided, get the attributes to track
	    if (attributes) {
		eventsToTrack = "";
		_.each(attributes, function(attribute) {
		    eventsToTrack += "change:" + attribute + " ";
		});
	    }
	    // Start tracking
	    this.on(
		    eventsToTrack,
		    function() {
			this.updateUnsavedAttributes();
		    });
	},
	/**
	 * Asyncrhonous set().
	 * Get data with an ajax call and set it to an attribute.
	 * @param {object hash} options. Options:
	 * - attr Attribute of the model.
	 * - url Url for the ajax request.
	 * - type [optional] Method to use (defaults to GET).
	 * - data [optional] Key-value pair with data to send (defaults to undefined).
	 */
	aset: function(options) {
	    var that = this,
		    ajax = $.ajax({
		'url': options.url,
		'data': options.data || undefined,
		'type': options.type || 'GET'
	    });
	    $.when(ajax)
		    .done(function(data, textStatus, jqXHR) {
		that.set(options.attr, data);
		if (options.require) {
		    require(options.require);
		}
	    })
		    .fail(function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR);
		//that.set("content", "<strong>" + jqXHR.status + " error</strong><br>" + jqXHR.responseText);
	    });
	},
	/**
	 * Add changed attributes to the unsaved attributes list.
	 */
	updateUnsavedAttributes: function() {
	    if (!this.isNew()) {
		//var that = this;
		//console.log("update unsaved attributes");
		_.each(this.changedAttributes(), function(value, key, model) {
		    this.unsavedAttributes[key] = value;
		}, this);
		//console.log(this.unsavedAttributes);
	    }
	},
	/**
	 * Clear unsaved attributes list.
	 */
	clearUnsavedAttributes: function() {
	    if (!this.isNew()) {
		//console.log("clear unsaved attributes");
		var that = this;
		_.each(this.unsavedAttributes, function(value, key, list) {
		    delete that.unsavedAttributes[key];
		});
		//console.log(this.unsavedAttributes);
	    }
	},
	/**
	 * Get the unsaved attributes list. 
	 * A safeAttributes array must exist and be filled with a list of attribute names.
	 */
	getUnsaved: function() {
	    return this.isNew() ? this.attributes : this.unsavedAttributes;
	},
	/**
	 * Get the unique id of this model. If it is new, it will return the cid.
	 */
	getId: function() {
	    return this.isNew() ? this.cid : this.id;
	},
	/**
	 * Smart save. Only save unsaved attributes if !isNew() add Yii CSRF protection. 
	 */
	smartSave: function() {
	    var that = this,
		    attrs = this.getUnsaved(),
		    saved = $.Deferred();

	    // Check if there is something to save
	    if (!_.isEmpty(attrs)) {

		// Convert booleans to integers
		attrs = this.booleanToInt(attrs);

		// Add csrf token
		attrs[Pi.csrfTokenName] = Pi.csrfToken;

		//console.log(attrs);
		// Save
		this.save(attrs,
			{
			    success: function(model, response, options) {
				if (response.success) {
				    that.set('saved', true);
				    that.clearUnsavedAttributes();
				    console.log("Successfully saved.");
				    saved.resolve();
				    return true;
				}
				else
				{
				    console.log("An error occurred. Please try again later.");
				    saved.reject();
				    return false;
				}
			    },
			    error: function(model, xhr, options) {
				console.log(xhr);
				saved.reject();
				return false;
			    },
			    patch: that.isNew() ? false : true
			}
		);

	    }
	    else
	    {
		console.log('ID: ' + this.id + ' - Nothing to save.');
		saved.resolve();
		return true;
	    }
	    return saved.promise();
	},
	/**
	 * Convert javascript booleans to numbers. Simplify save() on server side.
	 * @param {array} attributes An array of key:value pairs.
	 */
	booleanToInt: function(attributes) {
	    _.each(attributes, function(value, key) {
		if (_.isBoolean(value)) {
		    attributes[key] = value ? 1 : 0;
		}
	    });
	    return attributes;
	}
    });


    /**
     * Override Backbone.ajax to add the CSRF token during DELETE requests.
     */
    Backbone.ajax = function() {
	var args = Array.prototype.slice.call(arguments, 0);

	// Check that 'data' exists, if not add it
	if (args[0]['data'] === undefined) {
	    args[0]['data'] = {
	    };
	}

	// Add the CRSF token for DELETE requests only
	if (args[0].type === "DELETE") {
	    args[0]['data'][Pi.csrfTokenName] = Pi.csrfToken;
	    // A weird Firefox or jQuery bug with delete requests needs this:
	    args[0]['data'] = JSON.stringify(args[0]['data']);
	}

	return Backbone.$.ajax.apply(Backbone.$, args);
    };

    return Backbone;

});
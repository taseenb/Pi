define([
    // Main
    'Pi', 'backbone', 'jquery',
    // Collections
    // Models
    // Views
    
    // Backbone Extensions
    'Pi/Model',
    
], function(Pi, Backbone, $) {

    "use strict";

    var Tab = Backbone.Model.extend({
	modelName: "Tab",
	urlRoot: Pi.basePath + '/tab',
	defaults: {
	    'name': "",
	    'code': "",
	    'main': 0, // READ ONLY
	    // app
	    'saved': undefined,
	    'active': true,
	    'editMode': false
	},
	/**
	 * Attributes that can be updated on the server side.
	 */
	safeAttributes: [
	    "id",
	    "project_id",
	    "name",
	    "code",
	    "main"
	],
	initialize: function() {
	    // Set main and active as booleans (db sends a string "0" or "1")
	    this.set('main', this.isMain());
	    // Set the main tab as active
	    this.set('active', this.isMain());
	    // Set saved state
	    this.set('saved', !this.isNew());
	    // Start tracking changes and unsaved attributes.
//	    if (!Pi.isGuest)
	    this.trackUnsaved(this.safeAttributes);
	},
	/**
	 * Rename the tab.
	 * @param {string} name The new name for the tab.
	 */
	rename: function(name) {
	    var oldName = this.get('name');
	    if (!name || name === oldName)
		return false;

	    // Trim the name to the max length, if necessary.
	    var newName = name.substring(0, Pi.fileNameMaxLength);

	    // Set the new name.
	    this.set('name', newName);
	    //console.log(this.changed);
	    
	    this.getIde().set('saved', false);

	    return true;
	},
	/**
	 * Determine if this tab is the main tab and returns a boolean. 
	 * Main is read only and cannot change.
	 * @return boolean
	 */
	isMain: function() {
	    var main = this.get('main');
	    if (_.isBoolean(main)) return main;
	    return parseInt(main) ? true : false;
	},
	/**
	 * Get the containing Ide model of this tab.
	 */
	getIde: function() {
	    return Pi.projects.get(this.get('project_id'));
	},
	/**
	 * Get the jQuery representation of Ide view of this tab.
	 */
	getIde$: function() {
	    return this.getIde().view.$el;
	},
	/**
	 * Get a unique id for this tab composed by the paretn Ide id and the tab id.
	 */
	getTabUniqueId: function() {
	    return this.get('project_id') + "_" + this.getId();
	}

    });

    return Tab;

});
define([
    // Main
    'Pi', 'backbone', 'jquery'
    // Collections
    // Models
    // Views
    
], function(Pi, Backbone, $) {

    "use strict";

    var Tab = Backbone.Model.extend({
	urlRoot: Pi.basePath + '/tab',
	defaults: {
	    'name': "",
	    'code': "",
	    'main': 0, // READ ONLY
	    // app
	    'saved': true,
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

	    // If this is the main tab, also change the ide name.
//	if (this.isMain()) this.getIde().set('name', newName);


	    // Set ide as not saved.
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
	    return Pi.openIdes.get(this.get('project_id'));
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
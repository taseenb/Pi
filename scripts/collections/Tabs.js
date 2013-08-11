define([
    // Main
    'Pi', 'backbone', 'jquery',
    // Collections
    // Models
    "models/Tab",
    // Views
    "views/Tab/TabView",
    // Backbone Extensions
    'Pi/Collection'

], function(Pi, Backbone, $, Tab, TabView) {

    "use strict";

    var Tabs = Backbone.Collection.extend({
	url: Pi.basePath + '/tabs/',
	model: Tab,
	initialize: function() {
	    /**
	     * REMOVE event.
	     */
	    this.on('remove', function(tab) {
		// Get ide
		var project = tab.getProject();

		// Set another tab active, unless the whole ide is being removed
		if (project && project.get('tabs').length) {
		    project.getMainTab().set('active', true);
		    // Remove the editor fromt the DOM
		    tab.getIdeView$().find("#" + tab.getTabUniqueId()).remove();
		    tab.set('active', false);
		    // Remove the relative item in the tab selector if ide still exists
		    project.tabsSelectorView.remove(tab);
		}

		// Remove Ace editor and its listeners
		tab.view.editor.destroy();
		delete tab.view.editor;

		// Remove tab view and its listeners
		tab.view.remove();
		tab.clear();
	    });
	},
	/**
	 * Get an array with all the attributes for each tab in the collection.
	 */
	getAttributesToSave: function() {
	    var attr = [],
		    index = 0;
	    this.each(function(tab) {
		var safeAttrs = _.pick(tab.attributes, tab.safeAttributes);
		attr[index] = safeAttrs;
		if (!_.isEmpty(attr[index])) {
		    attr[index].isNew = tab.isNew();
		    attr[index].id = !tab.isNew() ? tab.getId() : undefined;
		}
		index++;
	    });
	    //console.log(attr);
	    return attr;
	},
	/**
	 * Get an array with the names of all the tabs.
	 * @returns {array} List of strings.
	 */
	getNames: function() {
	    var array = [];
	    this.each(function(tab) {
		array.push(tab.name);
	    });
	    return array;
	},
	/**
	 * Get an array of tabs, with all their attributes and their ids.
	 * @returns {array json} Tabs.
	 */
	toArrayWithId: function() {
	    var tabsJson = this.toJSON();
	    this.each(function(tab, i) {
		tabsJson[i].id = tab.getId();
	    });
	    return tabsJson;
	}
    });

    return Tabs;

});
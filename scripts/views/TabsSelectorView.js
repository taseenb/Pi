define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Templates
    "text!tpl/TabSelector.html",
    // Ace
    "ace"

], function(Pi, Backbone, $, TabSelectorHtml, ace) {

    "use strict";

    var tabTemplate = _.template(TabSelectorHtml);

    var TabsSelectorView = Backbone.View.extend({
	tagName: "li",
	//className: "tab_selector",
	/**
	 * Init.
	 */
	initialize: function() {
	    this.$el = this.model.view.$el.find("#ts" + this.model.getId());
	},
	events: {
//	    "click": function(e) {
//		e.preventDefault();
//		this.toggle();
//	    }
	},
	/**
	 * Render tabs selector.
	 * @returns {undefined}
	 */
	render: function() {
	    var action = Pi.action.openProject;
	    this.$el.append(tabTemplate({
		id: this.model.getId(),
		tabs: this.model.tabs.toArrayWithId(),
		openProjectAction: Pi.action.openProject
	    }));
	    this.$menu = this.$el.find(".dropdown-menu");
	},
	/**
	 * Add an item to the list of tabs.
	 * @param {model} tab The tab to add.
	 */
	add: function(tab) {
	    var tabUniqueId = tab.getTabUniqueId(),
		    name = tab.get('name');
	    var href = $("#tab" + tabUniqueId).find("a").attr("href");
	    this.$el.find('ul.dropdown-menu')
		    .append('<li role="presentation" id="ts' + tabUniqueId + '"><a href="' + href + '">' + name + '</a></li>');
	},
	/**
	 * Remove an itam from the list of tabs.
	 * @param {model} tab The tab to remove.
	 */
	remove: function(tab) {
	    this.$el.find('#ts' + tab.getTabUniqueId()).remove();
	},
	/**
	 * Rename the item in the list according to the name of the tab.
	 * @param {model} tab The tab to reference.
	 */
	rename: function(tab) {
	    $('#ts' + tab.getTabUniqueId() + " a").text(tab.get('name'));
	},
		
		
//	toggle: function() {
//	    if (this.$menu.data('active')) {
//		this.close();
//	    } else {
//		this.open();
//	    }
//	},
//	open: function() {
//	    this.$menu.show();
//	    this.$menu.data('active', true);
//	},
//	close: function() {
//	    this.$menu.hide();
//	    this.$menu.data('active', false);
//	}
    });

    return TabsSelectorView;

});
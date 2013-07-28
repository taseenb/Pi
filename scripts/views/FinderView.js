define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Collections
    // Models
    // Views
    "views/CollectionView",
    // Templates
    // Bootstrap
    "bootstrap-tab"

], function(Pi, Backbone, $, CollectionView) {

    "use strict";

    var FinderView = Backbone.Epoxy.View.extend({
	initialize: function() {
	    var that = this;
	    $.when(Pi.user.collections.fetch())
		    .done(function() {
		//console.log(Pi.user.collections);
		that.render();
	    })
		    .fail(function() {
		//console.log('Error while trying to get the collections.');
	    });

	},
	events: {
	    "click .exit": function() {
		this.hide();
	    }
	},
	render: function() {
	    var that = this,
		    $tabs = this.$el.find("#finder_tabs");

	    // Add collections in form of tabs
	    Pi.user.collections.each(function(collection) {
		var id = collection.id;
		// Add tab
		$tabs
			.append('<li><a></a></li>').find('li:last a')
			.attr({
		    "data-target": "#collection" + id,
		    "data-toggle": "tab",
		    "href": "#find/" + id
		}).text(collection.get('name'));

		// Add tab content
		var collectionView = new CollectionView({
		    model: collection,
		    el: "#finder_tabs_content"
		});
		collectionView.render();
	    });

	    // Set the first tab and tab-pane actives
	    $tabs.find("li:first").addClass('active');
	    this.$el.find(".collections_wrapper").find(".collection:first").addClass('active');
	},
	getProjects: function() {

	},
	show: function() {
	    // Trigger a click on the desktop to set all windows inactive
	    // Pi.user.currentDesktop.$el.trigger('mousedown');
	    this.$el.addClass('active');

	},
	hide: function() {
	    this.$el.removeClass('active');
	}
    });

    return FinderView;

});
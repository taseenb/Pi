define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Templates
    "text!tpl/Manager.html"

], function(Pi, Backbone, $, ManagerHtml) {

    "use strict";

    var managerTemplate = _.template(ManagerHtml);

    var ManagerView = Backbone.View.extend({
	active: false,
	updated: true,
	initialize: function() {
	    this.render();
	},
	event: {
	    "click #manager_close": function() {
		this.close();
	    }
	},
	render: function() {
	    this.$el.html(
		    managerTemplate({
	    })
		    );
	    return this;
	},
	open: function() {
	    var that = this;
	    this.$el.addClass('active');

	},
	close: function() {
	    var that = this;
	    this.$el.removeClass('active');

	}
    });

    return ManagerView;

});
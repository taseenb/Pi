define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Templates
    "text!tpl/Page.html",
    // Collections
    // Models
    // Views

    // Backbone Extensions
    'Pi/Model'

], function(Pi, Backbone, $, PageHtml) {

    var pageTemplate = _.template(PageHtml);

    var PageView = Backbone.View.extend({
	className: "page",
	initialize: function() {
	    this.listenTo(this.model, "change:template", this.render);
	},
	render: function() {

	    // Render the requested template (see router)
	    var that = this,
		    path = Pi.basePath + "/static/" + this.model.get('template');

	    require(
		    ["text!" + path], function(contentTemplate) {

		var content = _.template(contentTemplate);
		that.$el.html(
			pageTemplate({
		    "content": content()
		})
			)
			.appendTo("#container");
		that.show();
	    });
	},
	show: function() {
	    this.$el.show();
	    //Pi.user.currentDesktop.$el.hide();
	},
	hide: function() {
	    this.$el.hide();
	    //Pi.user.currentDesktop.$el.show();
	}

    });

    return PageView;


});
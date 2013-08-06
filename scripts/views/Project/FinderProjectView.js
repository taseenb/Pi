define([
    // Main scripts
    'Pi', 'backbone', 'jquery', 
    // Templates
    "text!tpl/Project/FinderProject.html",
    // Models
    "models/Project",
    // Backbone Extensions
    'epoxy',
    'Pi/Model',
    'Pi/start/startDataBinding',
    // Plugins
    'jquery-ui'

], function(Pi, Backbone, $, FinderProjectHtml) {

    "use strict";

    var FinderProjectView = Backbone.Epoxy.View.extend({
	/**
	 * Data binding.
	 */
	bindings: "data-e-bind",
	bindingHandlers: _.extend(Pi.bindingHandlers, {
	}),
	attributes: function() {
	    return {
		'id': "finder_project" + this.model.getId(),
		'class': "project",
		'data-e-bind': "open:open"
	    }
	},
	initialize: function() {
	    // Rendering must be done at initialization for Epox data-binding
	    var that = this,
		    project = this.model;
	    this.$el.html(_.template(FinderProjectHtml, {
		id: project.getId(),
		name: project.get('name'),
		preview: that.getPreview(project.get('preview_id'), project.get('id')),
		description: project.get('description'),
		public: project.get('public'),
		create_time: project.get('create_time'),
		update_time: project.get('update_time'),
		userId: Pi.user.id,
		username: Pi.user.getFullName(),
		avatar: Pi.user.getAvatar()
	    }));
	},
	render: function() {
	    this.container.append(this.$el);
	},
	getPreview: function(previewId, projectId) {
	    if (previewId) {
		var userId = Pi.user.id,
			imgUrl = Pi.publicDir + '/' + userId + '/' + Pi.previewFileName + projectId + ".jpg";
		return imgUrl;
	    }
	    else
	    {
		return Pi.imgPath + '/' + Pi.defaultPreviewFileName;
	    }
	}

    });

    return FinderProjectView;

});

    
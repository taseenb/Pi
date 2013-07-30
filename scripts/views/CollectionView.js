define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Collections
//    "collections/Collections",

    // Templates
    "text!tpl/ProjectView.html",
    // Bootstrap
    "bootstrap-tab"

], function(Pi, Backbone, $, ProjectViewHtml) {

    "use strict";

    var CollectionView = Backbone.Epoxy.View.extend({
	
	initialize: function() {
	    //console.log(this.model);
	},
		
	render: function() {
	    var that = this;
	    var $wrapper = this.$el.find('.collections_wrapper');
	    var $collection = $wrapper.append('<div/>').find('div:last')
		    .attr({
		"id": "collection" + this.model.id,
		"class": "tab-pane collection"
	    });
	    
	    // Append projects
	    _.each(this.model.get('projects'), function(project) {
		$collection
		.append(_.template(ProjectViewHtml, {
		    id: project.id,
		    open: Pi.projects.get(project.id) ? true : false,
		    name: project.name,
		    preview: that.getPreview(project.preview_id, project.id),
		    description: project.description,
		    public: project.public,
		    create_time: project.create_time,
		    update_time: project.update_time,
		    userId: Pi.user.id,
		    username: Pi.user.getFullName(),
		    avatar: Pi.user.getAvatar()
		}));
	    });
	},
	
	getPreview: function(previewId, projectId) {
	    if (previewId) {
		var userId = Pi.user.id,
		    imgUrl = Pi.publicDir + '/' + userId + '/' + Pi.previewFileName + projectId + ".jpg"
		return imgUrl;
	    }
	    else
	    {
		return Pi.imgPath + '/' + Pi.defaultPreviewFileName;
	    }
	}

    });

    return CollectionView;

});
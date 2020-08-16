define([
  // Main scripts
  'Pi',
  'backbone',
  'jquery',
  // Templates
  'text!tpl/Project/FinderProject.html',
  // Models
  'models/Project',
  // Backbone Extensions
  'epoxy',
  'Pi/Model',
  'Pi/start/startDataBinding',
  // Plugins
  'jquery-ui'
], function (Pi, Backbone, $, FinderProjectHtml) {
  'use strict'

  var FinderProjectView = Backbone.Epoxy.View.extend({
    /**
     * Data binding.
     */
    bindings: 'data-e-bind',
    bindingHandlers: _.extend(Pi.bindingHandlers, {}),
    attributes: function () {
      return {
        id: 'finder_project' + this.model.getId(),
        class: 'project'
        //		'data-e-bind': "open:open"
      }
    },
    initialize: function () {
      // Rendering must be done during initialization for Epoxy data-binding
      var that = this
      var project = this.model
      var projectId = project.getId(),
        myProject = Pi.user.getId() === project.get('user_id')

      // Does the project belong to the current user?
      var projectUserId = myProject
        ? Pi.user.getId()
        : project.get('user_id').id
      var projectUsername = myProject
        ? Pi.user.getFullName()
        : project.get('user_id').username
      var avatar = myProject
        ? Pi.user.getAvatar()
        : project.get('user_id').avatar

      this.$el.html(
        _.template(FinderProjectHtml, {
          myProject: myProject,
          avatar: avatar,
          id: projectId,
          name: project.get('name'),
          likes: project.get('likes'),
          views: project.get('views'),
          preview: that.getPreview(
            projectUserId,
            projectId,
            project.get('has_preview')
          ),
          description: project.get('description'),
          public: project.get('public'),
          create_time: project.get('create_time'),
          update_time: project.get('update_time'),
          userId: projectUserId,
          username: projectUsername
        })
      )
    },
    //	render: function() {
    //	    this.container.append(this.$el);
    //	},
    getPreview: function (userId, projectId, hasPreview) {
      if (hasPreview) {
        return (
          Pi.publicDir +
          '/' +
          userId +
          '/' +
          Pi.previewFileName +
          projectId +
          '.png'
        )
      } else {
        return Pi.imgPath + Pi.defaultPreviewFileName
      }
    }
  })

  return FinderProjectView
})

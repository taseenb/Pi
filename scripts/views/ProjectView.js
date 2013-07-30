define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    
    // Templates
    "text!tpl/ProjectView.html",
    
    // Models
    "models/Project",
    
    // Backbone Extensions
    'Pi/Model',
    'Pi/start/startDataBinding',
    
    // Plugins
    'jquery-ui'

], function(Pi, Backbone, $, ProjectViewHtml, Project) {

    "use strict";

    var ProjectView = Backbone.Epoxy.View.extend({
	
	
    });
    
    return ProjectView;
    
});
    
    
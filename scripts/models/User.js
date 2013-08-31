define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Collections
    "collections/Projects",
    "collections/Tabs",
    // Models
    "models/Project",
    "models/Tab",
    // Views
    "views/Project/IdeView",
    "views/Project/IconView",
    // Controllers
    'controllers/ProjectController',
    // Backbone Extensions
    'relational',
    'Pi/Model',
    // Helpers
    'Pi/Js'
], function(Pi, Backbone, $, Projects, Tabs, Project, Tab, IdeView, IconView, ProjectController) {

    "use strict";

    var User = Backbone.RelationalModel.extend({
	modelName: "User",
	url: Pi.basePath + '/user',
	relations: [{
		type: Backbone.HasMany,
		key: 'projects',
		relatedModel: Project,
		collectionType: Projects,
		parse: true
	    }],
	defaults: {
	},
	/**
	 * Attributes that can be updated on the server side.
	 */
	safeAttributes: [
	    "username",
	    "lastvisit_at"
	],
	/**
	 * User init.
	 */
	initialize: function()
	{
	    // Set current desktop
	    this.currentDesktop = Pi.desktopView;

	    // Create an array with ids of bootstrapped projects
	    this.bootstrapProjectIds = [];
	    if (Pi.bootstrap.user) {
		_.each(Pi.bootstrap.user.projects, function(project) {
		    this.bootstrapProjectIds.push(parseInt(project.id));
		}, this);
	    }

	    this.set('guest', Pi.bootstrap.isGuest ? true : false);

	    if (!this.isGuest())
		this.update(Pi.bootstrap, false);
	},
	/**
	 * Start the desktop playground with user's Processing sketches or, if guest, a demo sketch.
	 * @param {json} data User model data with its profile and collections (containing only open projects).
	 */
	desktopBootstrap: function(data) {
	    if (this.isGuest() && !this.guestBootstrapped)
	    {
		// Start a demo sketch for the guest if no projects are open
		if (!this.get('projects').length) {
		    var ProjectController = require('controllers/ProjectController');
		    ProjectController.new(Pi.user.getId());
		}
		this.guestBootstrapped = true;
	    }
	    else if (!this.isGuest() && !this.bootstrapped)
	    {
		this.update(data, true);
		this.bootstrapped = true;
	    }
	},
	/**
	 * Update the user with data loaded from server.
	 * @param data {json object} User model data with its profile and projects.
	 * @param fetchProjects {boolean} Whether to update the projects as well with that data.
	 */
	update: function(data, fetchProjects) {
	    // Update isGuest value
	    this.set('guest', data.isGuest ? true : false);
	    
	    // Store bootstrap user data into Pi.user
	    _.each(data.user, function(value, key) {
		//console.log(key + "=" + value);
		this.set(key, value);
	    }, this);

	    // Store bootstrap profile data into Pi.user.profile
	    this.profile = new Backbone.Model();
	    _.each(data.profile, function(value, key) {
		this.profile.attributes[key] = value; // avoid backbone change event
	    }, this);
	    
	    if (this.nav)
		this.nav.render();
	    
	    if (fetchProjects) {
		this.persistNewProjects();
		//this.fetchUserProjects();
		//this.openProjects(data.projects);
	    }
	},
	/**
	 * Get 'guest' attribute from the user.
	 */
	isGuest: function() {
	    return this.get('guest');
	},
	/**
	 * Load projects from json.
	 * @param {json} json Json data with projects.
	 */
//	openProjects: function(json)
//	{
//	    // Get user json data and load projects
//	    var projects = json;
//	    _.each(projects, function(project) {
//		if (project.open) {
//		    ProjectController.open(project.id);
//		}
//	    }, this);
//	},
	/**
	 * Save new projects (not already saved) in the db or destroy projects 
	 * that were not modified by the user.
	 * This method is needed after user's log in, when new projects may be open
	 * and not yet created on the db.
	 */
	persistNewProjects: function() {
	    if (!this.isGuest()) {
		this.get('projects').each(function(project) {
		    if (project.isNew() && !project.get('saved'))
			project.saveSketch(true);
		    else if (project.isNew() && project.get('saved'))
			project.destroy();
		});
	    }
	},
	/**
	 * Return fullname (firstname and lastname) if available or the username.
	 */
	getFullName: function() {
	    if (!this.isGuest()) {
		if (this.profile && (this.profile.firstname || this.profile.lastname))
		    return this.profile.firstname + " " + this.profile.lastname;
		else
		    return this.getUsername();
	    }
	    else
	    {
		return "Guest";
	    }
	},
	/**
	 * Return username or set the username as the first part of the mail and return it.
	 */
	getUsername: function() {
	    if (this.get('username')) {
		return this.get('username');
	    } else {
		var email = this.get('email');
		this.set('username', email.substr(0, email.indexOf('@')));
		return this.get('username');
	    }
	},
	/**
	 * Get user public url (containing user's files and images).
	 */
	getPublicDir: function() {
	    return Pi.publicDir + "/" + this.id;
	},
	/**
	 * Get user's avatar image url.
	 */
	getAvatar: function() {
	    if (this.get('avatar'))
		return this.get('avatar'); //Pi.user.getPublicDir() + "/avatar.jpg";
	    else
		return Pi.imgPath + "/" + Pi.defaultAvatarFileName;
	},
	/**
	 * Show a project if already loaded or try to load it from the server.
	 * @param {integer} id Project id.
	 * @param {string} action Action to perform.
	 * @param {integer} tabId Optional: tab id to open.
	 * @return {boolean} True if project was open, false if it does not exist or there was an error.
	 */
//	openProject: function(id, action, tabId)
//	{
//	    
//	},
	/**
	 * Create an ide with all its views from a Project model.
	 * If data is not a Backbone model, a Project model will be created from the data.
	 * @param {object} project A Project model or json data to create the Project Model.
	 */
//	createIdeView: function(project)
//	{
//	    if (this.openProjectsCount() <= Pi.maxIdeSessions)
//	    {
//		// Create an IdeView
//		project.ideView = new IdeView({
//		    model: project
//		});
//		// Set the container (desktop) for this ide
//		project.ideView.render().openState(); // render and show if open
//
//		// IMPORTANT: always set first the main tab active when loading
//		// a project and set the location.hash with this project id, 
//		// unless there is another path already set
//		project.setMainTabActive();
//		if (!window.location.hash)
//		    window.location.hash = "project/" + project.getId();
//
//		// Create an icon view
//		project.iconTop = 100;
//		project.iconLeft = 100;
//		project.iconView = new IconView({
//		    model: project
//		});
//		project.iconView.render();
//
//		// Set project open
//		project.set('open', 1);
//		return project;
//	    }
//	    else
//	    {
//		if (project.isNew())
//		    Pi.user.get('projects').remove(project);
//		else
//		    project.set('open', 0);
//		Pi.alert("Too Many Windows!",
//			"<p>Please, save and close at least one window.<br>Otherwise your browser could explode!</p>"
//			);
//	    }
//	},
	/**
	 * Count all open projects available in all the collections of the user.
	 * @returns {integer} The number of projects currently open.
	 */
	openProjectsCount: function() {
	    var count = 0;
	    this.get('projects').each(function(project) {
		if (project.get('open'))
		    count++;
	    });
	    return count;
	}

    });

    return User;

});
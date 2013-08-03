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
    // Backbone Extensions
    'relational',
    'Pi/Model',
    // Helpers
    'Pi/Js'
], function(Pi, Backbone, $, Projects, Tabs, Project, Tab, IdeView, IconView) {

    "use strict";

    var User = Backbone.RelationalModel.extend({
	modelName: "User",
	url: Pi.basePath + '/user',
	relations: [{
		type: Backbone.HasMany,
		key: 'projects',
		relatedModel: Project,
		collectionType: Projects,
		reverseRelation: {
		    key: 'user_id',
		    includeInJSON: 'id'
		}
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
	    _.each(Pi.bootstrap.projects, function(project) {
		this.bootstrapProjectIds.push(parseInt(project.id));
	    }, this);
	    //console.log(this.bootstrapProjectIds);
	},
	/**
	 * Start the desktop playground with user's Processing sketches or, if guest, a demo sketch.
	 * @param {json} data User model data with its profile and collections (containing only open projects).
	 */
	bootstrap: function(data) {
	    if (Pi.isGuest && !this.guestBootstrapped)
	    {
		// Start a demo sketch for the guest
		this.newProject();
		this.guestBootstrapped = true;
	    }
	    else if (!Pi.isGuest && !this.bootstrapped)
	    {
		this.update(data, true);
		this.bootstrapped = true;
	    }
	},
	/**
	 * Update the user with data loaded from server.
	 * @param data {json object} User model data with its profile and projects.
	 * @param updateProjects {boolean} Whether to update the projects as well with that data.
	 */
	update: function(data, loadProjects) {
	    Pi.js.stringsToInts(data.user);

	    // Reset user model before loading bootstrap data
	    this.reset();

	    // Update isGuest value
	    Pi.isGuest = data.isGuest;

	    // Store bootstrap user data into Pi.user
	    _.each(data.user, function(value, key) {
		//console.log(key + "=" + value);
		this.set(key, value); // avoid backbone change event
	    }, this);

	    // Store bootstrap profile data into Pi.user.profile
	    this.profile = new Backbone.Model();
	    _.each(data.profile, function(value, key) {
		this.profile.attributes[key] = value; // avoid backbone change event
	    }, this);

	    if (this.nav)
		this.nav.render();

	    if (loadProjects) {
		this.persistNewProjects();
		this.loadProjects(data.projects);
	    }
	},
	/**
	 * Update projects.
	 * @param {json} projectsJson Json data with projects.
	 */
	loadProjects: function(json)
	{
	    // Get user json data and load projects
	    var projects = json;
	    _.each(projects, function(project) {
		Pi.js.stringsToInts(project);
		if (project.open) {
		    this.openProject(project.id);
		}
	    }, this);

	},
	/**
	 * Save new projects (not already saved) in the db or destroy projects 
	 * that were not modified by the user.
	 * This method is needed after user's log in, when new projects may be open
	 * and not yet created on the db.
	 */
	persistNewProjects: function() {
	    if (!Pi.isGuest) {
		this.get('projects').each(function(project) {
		    if (project.isNew() && !project.get('saved'))
			project.saveSketch(true);
		    else if (project.isNew() && project.get('saved'))
			project.destroy();
		});
	    }
	},
	/**
	 * Reset this user model and removes the profile model (clears attributes and listeners).
	 */
	reset: function() {
	    // Clear all attributes, but keep relations ('projects' attribute)
	    _.each(this.attributes, function(value, key) {
		if (key != 'projects')
		    value = undefined;
	    });
	    //console.log(this.attributes);
	    if (this.profile) {
		this.profile.off();
		delete this.profile;
	    }
	    this.off();
	},
	/**
	 * Return fullname (firstname and lastname) if available or the username.
	 */
	getFullName: function() {
	    if (this.profile && (this.profile.firstname || this.profile.lastname))
		return this.profile.firstname + " " + this.profile.lastname;
	    else
		return this.getUsername();
	},
	getPublicDir: function() {
	    return Pi.publicDir + "/" + this.id;
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
	getAvatar: function() {
	    if (this.get('avatar'))
		Pi.user.getPublicDir() + "/avatar.jpg";
	    else
		return Pi.imgPath + "/" + Pi.defaultAvatarFileName;
	},
	/**
	 * Start a new project with a demo sketch.
	 */
	newProject: function()
	{
	    // Create a new project
	    var project = new Project({
		'user_id': this.getId(),
		'open': 1
	    });
	    // Add a tab with the new Project ID (cid) and the demo code
	    project.get('tabs').add(new Tab({
		'name': project.get('name'),
		'project_id': project,
		'code': Pi.demoCode,
		'main': 1
	    }));
	    this.get('projects').add(project);
	    this.createIdeView(project);
	},
	/**
	 * Show a project if already loaded or try to load it from the server.
	 * @param {integer} id Project id.
	 * @param {string} action Action to perform.
	 * @param {integer} tabId Optional: tab id to open.
	 * @return {boolean} True if project was open, false if it does not exist or there was an error.
	 */
	openProject: function(id, action, tabId)
	{
	    var that = this,
		    project = this.get('projects').get(id);

	    if (project && project.get('tabs').length) { // project model already exists
		switch (action) {
		    case "fs":
			project.playSketch({
			    'fullScreen': true
			});
			project.set('fullScreen', true);
			break;
		    case "play":
			project.playSketch({
			    'fullScreen': false
			});
			break;
		    case "code":
			// @TODO open the ide and activate the requested tab

			break;
		    default:
			// Create the Ide if it does not exist. Save the new 'open' state, if changed
			if (!project.ideView) {
			    that.createIdeView(project);
			    project.saveOpenState();
			}
			if (!project.get('open')) {
			    project.set('open', 1);
			    project.saveOpenState();
			}
			project.set('active', 1);
		}
		return true;
	    }
	    else // try to load the project from server and create the model
	    {
		var project = Project.findOrCreate({
		    'id': id
		});
		project.fetch({
		    success: function(model, response, options) {
			// project successfully loaded - recurse to open the ide
			//console.log(model);
			that.openProject(id, action);
			return true;
		    },
		    error: function(model, response, options) {
			// project does not exist
			project.clear({
			    silent: true
			});
			return false;
		    }
		});
	    }
	},
	/**
	 * Create a Project model (new or from db data).
	 * @param {object} data Json data of the project.
	 * @returns {object} The project model.
	 */
//	createProject: function(data) {
//	    // Convert strings containing numbers to integers
////	    var data = Pi.js.stringsToInts(data);
////	    data.tabs = Pi.js.stringsToInts(data.tabs);
//	    return new Project(data);
//	},
//	
	/**
	 * Create an ide with all its views from a Project model.
	 * If data is not a Backbone model, a Project model will be created from the data.
	 * @param {object} project A Project model or json data to create the Project Model.
	 */
	createIdeView: function(project)
	{
	    if (this.openProjectsCount() <= Pi.maxIdeSessions)
	    {
		// Create an IdeView
		project.ideView = new IdeView({
		    model: project
		});
		// Set the container (desktop) for this ide
		project.ideView.render().openState(); // render and show if open

		// IMPORTANT: always set first the main tab active when loading
		// a project and set the location.hash with this project id, 
		// unless there is another path already set
		project.setMainTabActive();
		if (!window.location.hash)
		    window.location.hash = "project/" + project.getId();

		// Create an icon view
		project.iconTop = 100;
		project.iconLeft = 100;
		project.iconView = new IconView({
		    model: project
		});
		project.iconView.render();

		// Set project open
		project.set('open', 1);
		return project;
	    }
	    else
	    {
		if (project.isNew())
		    Pi.user.get('projects').remove(project);
		else
		    project.set('open', 0);
		Pi.alert("Too Many Windows!",
			"<p>Please, save and close at least one window.<br>Otherwise your browser could explode!</p>"
			);
	    }
	},
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
	/**
	 * Updates user data on the server. Only sends changed and safe attributes.
	 */
//	update: function() {
//	    if (!this.isNew())
//	    {
//		console.log(this.changed);
//		var clean = _.pick(this.changed, this.safeAttributes);
//		console.log(clean);
//
//		if (!_.isEmpty(clean)) {
//		    this.save(clean, {
//			'patch': true
//		    }); // update user
//		}
//	    }
//	}

    });

    return User;

});
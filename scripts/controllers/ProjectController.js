define([
    // Main scripts
    'Pi', 'jquery', 'backbone',
	    // Collections
	    // Models
	    'models/Project',
	    'models/Tab',
	    // Views
	    "views/Project/IdeView",
	    "views/Project/IconView",
	    // Controllers (extension)
	    'Pi/Controller'
	    
], function(Pi, $, Backbone, Project, Tab, IdeView, IconView) {

    /**
     * Controller class for project management.
     */
    ProjectController = Backbone.Controller.extend({
	
	/**
	 * Start a new project with a demo sketch.
	 * @param {int} userId The current user id.
	 */
	'new': function(userId)
	{
	    // Create a new project
	    var project = new Project({
		'user_id': userId,
		'open': 1
	    });
	    // Add a tab with the new Project ID (cid) and the demo code
	    project.get('tabs').add(new Tab({
		'name': project.get('name'),
		'project_id': project,
		'code': Pi.demoCode,
		'main': 1
	    }));
	    Pi.user.get('projects').add(project);
	    this.createIdeView(project);
	},
	
	
	/**
	 * Show a project if already loaded or try to load it from the server.
	 * @param {integer} id Project id.
	 * @param {string} action Action to perform.
	 * @param {integer} tabId Optional: tab id to open.
	 */
	'open': function(id, action, tabId) {
	    var that = this,
		    project = Pi.user.get('projects').get(id);
	    
	    console.log("Project id: " + id);
	    console.log(project);
	    if (project)
		console.log("Tabs: " + project.get('tabs').length);
	    
	    if (project && project.get('tabs').length) { // project model exists and is completely loaded
		Pi.desktop.set('active', true);
		// Create the Ide if it does not exist. 
		// Save the new 'open' state, if changed
		if (!project.ideView) {
		    that.createIdeView(project);
		    //project.saveOpenState();
		}
		if (!project.get('open')) {
		    project.set('open', 1);
		    //project.saveOpenState();
		}
		switch (action) {
		    case "fs":
			project.playSketch({
			    'fullScreen': true
			});
			project.set('fullScreen', true);
			break;
		    case "play":
			project.playSketch();
			break;
		    case "code":
			var tab = project.get('tabs').get(tabId);
			if (tab)
			    tab.set('active', 1);
			else
			    project.get('tabs').setMainActive();
			break;
		}
		project.set('active', 1);
//		if (!tabId)
//		    project.get('tabs').setMainActive();
	    }
	    else // try to load the project from server and create the model
	    {
		var project = Project.findOrCreate({
		    'id': id
		});

		// To open a project from another user in the desktop, we have 
		// to create a new project and copy its attributes and tabs.
		project.fetch({
		    'data': {
			'tabs': 1
		    },
		    'success': function(model, response, options) {
			// If the project does not belong to the user: 
			// create a copy and open the copy.
			if (model.get('user_id') != Pi.user.get('id')) {
			    var newTabs = [];
			    model.get('tabs').each(function(tab) {
				tab.attributes.id = undefined;
				tab.attributes.project_id = undefined;
				newTabs.push(tab.attributes);
			    });
			    var newProject = model.clone();
			    newProject.set({
				'id': undefined,
				'user_id': Pi.user.getId(),
				'open': 1,
				'tabs': newTabs
			    });
			    //console.log(newProject);
			    Pi.user.get('projects').add(newProject);
			    that.open(newProject.getId(), action);
			    return;
			}
			// If the project belongs to the user, just open it.
			else
			    that.open(id, action);
		    },
		    'error': function(model, response, options) {
			// The project does not exist
			project.clear({
			    silent: true
			});
		    }
		});
	    }
	},
	
	/**
	 * Create an ide with all its views from a Project model.
	 * If data is not a Backbone model, a Project model will be created from the data.
	 * @param {object} project A Project model or json data to create the Project Model.
	 */
	'createIdeView': function(project)
	{
	    if (Pi.user.openProjectsCount() <= Pi.maxIdeSessions)
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
	}
	
	
    });

    return new ProjectController;

});
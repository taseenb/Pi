define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Collections
    "collections/Tabs",
    // Models
    "models/Ide",
    "models/Tab",
    // Views
    "views/IdeView",
    "views/IconView",
    "views/TabsSelectorView"

], function(Pi, Backbone, $, Tabs, Ide, Tab, IdeView, IconView, TabsSelectorView) {

    "use strict";

    var User = Backbone.Model.extend({
	url: Pi.basePath + '/user',
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
	    this.bootstrap(Pi.bootstrap);
	},
	/**
	 * Start the desktop playground with user's Processing sketches or, if guest, a demo sketch.
	 * @param {json} data User model data with its profile and collections (containing only open projects).
	 */
	bootstrap: function(data) {
	    if (Pi.isGuest && !Pi.guestBootstrapped)
	    {
		// Start a demo sketch for the guest
		this.newSketch();
		Pi.guestBootstrapped = true;
	    }
	    else if (!Pi.isGuest && !Pi.userBootstrapped)
	    {
		this.update(data, true);
		Pi.userBootstrapped = true;
	    }
	},
	/**
	 * Bootstrap the user with starting data loaded from server.
	 * @param data {json object} User model data with its profile and collections.
	 * @param updateSketches {boolean} Whether to update the sketches with the same data.
	 */
	update: function(data, updateSketches) {
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
	    
	    if (updateSketches)
		this.updateSketches(data);
	},
	/**
	 * Open user sketches (from bootstrap data).
	 * @param {json} data User model data with its profile and collections (containing only open projects).
	 */
	updateSketches: function(data)
	{
	    // Get user data if available or load the first bootstrap (Pi.bootstrap)
	    var bootstrap = data ? data : Pi.bootstrap;
	    // Get collections from boostrap
	    var collections = bootstrap.collections;
	    _.each(collections, function(collection)
	    {
		if (collection.projects)
		{
		    _.each(collection.projects, function(project) {
			if (project.open) {
			    this.openIde(project.name, project.tabs, project.id, collection.id);
			}
		    }, this);
		}
	    }, this);
	},
	/**
	 * Reset this user model and removes the profile model (clears attributes and listeners).
	 */
	reset: function() {
	    this.clear();
	    if (this.profile) {
		this.profile.off();
		delete this.profile;
	    }
	    this.off();
	},
	/**
	 * 
	 */
	getFullName: function() {
	    if (this.profile && (this.profile.firstname || this.profile.lastname)) {
		return this.profile.firstname + " " + this.profile.lastname;
	    }
	    return this.get('email');
	},
	/**
	 * Start a basic sketch for a guest, with demo code.
	 */
	newSketch: function()
	{
	    this.openIde(
		    undefined, // _name: is set on ide model initilization
		    [{
			    'code': Pi.demoCode,
			    'main': 1
			}], // _tabs: tabs collection
	    undefined // _id: id will be generated automatically by backbone
		    );
	},
	/**
	 * Create an Ide (new or loaded from db).
	 * @param {string} _name Project name.
	 * @param {object} _tabs Tabs data.
	 * @param {number} _id The id field in the database.
	 */
	openIde: function(_name, _tabs, _id, _collectionId)
	{
	    if (Pi.openIdes.length < Pi.maxIdeSessions)
	    {
		// Create a new ide model with needed attributes
		var ide = new Ide({
		    // If id is undefined then ide.isNew() == true
		    id: _id ? parseInt(_id) : undefined,
		    collection_id: _collectionId ? parseInt(_collectionId) : parseInt(this.get("default_collection")),
		    open: true,
		    name: _name,
		    iconTop: 100,
		    iconLeft: 100
		});

		// Create a new Tabs collection for this Ide
		ide.tabs = new Tabs(); // tabs collection

		// Set the container (desktop) for this ide
		ide.container = this.currentDesktop.$el;

		// Create an IdeView
		ide.view = new IdeView({
		    model: ide
		});
		ide.view.render();

		// Add to the OpenIdes collection
		Pi.openIdes.add(ide);
		
		
		// Create a tabs selector view
		ide.tabsSelector = new TabsSelectorView({
		    model: ide
		});
		
		// Fill the Tabs collection
		_.each(_tabs, function(_tab) {
		    _tab['project_id'] = ide.getId();
		    ide.tabs.add(new Tab(_tab));
		});
		
		ide.tabsSelector.render();
		
		// IMPORTANT: always set first the main tab active when loading
		// a project and set the hash to this project, unless there is 
		// another path already set
		ide.setMainTabActive();
		
		if (!window.location.hash)
		{
		    window.location.hash = "project/" + ide.getId();
		}

		// Create an icon view
		ide.icon = new IconView({
		    model: ide
		});
		ide.icon.render();
		
	    }
	    else
	    {
		Pi.alert("Too Many Windows!", "<p>Please, save and close at least one window.<br>"
			+
			"Otherwise your browser could explode!</p>"
			);
	    }
	},
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
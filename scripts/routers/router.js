define([
    'Pi', 'jquery', 'backbone',
    // Start Pi
    'Pi/start/startUnderscoreTemplate',
    'Pi/start/startDataBinding',
    'Pi/start/startDesktop',
    'Pi/start/startDialogs',
    'Pi/start/startUser',
    // Js and Json helpers
    'Pi/Js'

], function(Pi, $, Backbone) {

    // Start events and site title
    require([
	'Pi/start/startTitle',
	'Pi/start/startEvents'
    ]);

    var Router = Backbone.Router.extend({
	// initialize: function() {},
	// routes: {
	//     //"": "start"
	// },
	// start: function()
	// {
	//
	// },
	/**
	 * Open user's personal space.
	 */
	me: function() {
	    if (!Pi.user.isGuest()) {
		console.log("I am " + Pi.user.get('email'));
	    } else {
		console.log("I am " + undefined);
	    }
	},
	/**
	 * Open or bring to front a particular project ide.
	 */
	openProject: function(id, action)
	{
	    require([
		'Pi/start/startUser'
	    ], function(Pi) {
		// If project is not new (id is an integer)
		if (Pi.js.stringIsInteger(id.replace("/", ""))) {
		    var projectId = parseInt(id);
		    // Avoid double ajax calls by checking the bootstrapped projects
		    // (only the first time this method is called)
		    if (Pi.user.bootstrapProjectIds) {
			if (_.indexOf(Pi.user.bootstrapProjectIds, projectId) == -1)
			    Pi.user.openProject(projectId, action);
			delete Pi.user.bootstrapProjectIds;
		    } else {
			Pi.user.openProject(projectId, action);
		    }
		}
		// Project is new: try to set it active
		else
		{
		    Pi.user.openProject(id, "active");
		}
	    });
	},
	/**
	 * Show desktop coding environment.
	 */
//	art: function() {
//	    // Nothing special.
//	},
	/**
	 * Finder.
	 */
	find: function(id) {
	    require([
		'Pi/start/startFinder'
	    ], function() {
		Pi.user.finderView.show();
		//console.log("Finder id: " + id);
	    });
	},
	/**
	 * Sign out.
	 */
	signout: function() {
	    window.location.href = Pi.basePath + "/user/logout/";
	},
	/**
	 * Static page.
	 * @param {string} page Template file name (without the .html part). This file must be located in tpl/pages/
	 */
//	page: function(page) {
//	    require([
//		'Pi/start/startPages'
//	    ], function() {
//		Pi.page.set({
//		    "template": page
//		});
//		Pi.pageView.show();
//	    });
//	},
	/**
	 * Temporary about.
	 */
	about: function() {
	    require([
		'Pi/start/startDialogs',
		"text!tpl/static/about.html"
	    ], function(Pi, aboutHtml) {
		Pi.dialog.open({
		    dataId: "about",
		    title: 'About',
		    content: aboutHtml
		});
	    });
	},
	/**
	 * Temporary about.
	 */
	contribute: function() {
	    require([
		'Pi/start/startDialogs',
		"text!tpl/static/contribute.html"
	    ], function(Pi, contributeHtml) {
		Pi.dialog.open({
		    dataId: "about",
		    title: 'Contribute to Pi',
		    content: contributeHtml
		});
	    });
	},
	/**
	 * Activated.
	 */
	activated: function() {
	    if (Pi.user.isGuest()) {
		require([
		    'Pi/start/startDialogs'
		], function(Pi) {
		    Pi.dialog.open({
			dataId: "shortMessage",
			title: 'Your account is ready',
			content: "Your account has been activated.<br>You can finally <i class='icon-signin'></i> <a href='#log-in'>Log In</a>."
		    });

		});
	    }
	    else
	    {
		this.goHome();
	    }
	},
	/**
	 * Activated.
	 */
	alreadyActive: function() {
	    if (Pi.user.isGuest()) {
		require([
		    'Pi/start/startDialogs'
		], function(Pi) {
		    Pi.dialog.open({
			dataId: "shortMessage",
			title: 'Your account is active',
			content: "Your account is already active.<br>You can <i class='icon-signin'></i> <a href='#log-in'>Log In</a>."
		    });

		});
	    }
	    else
	    {
		this.goHome();
	    }
	},
	/**
	 * Reset the location hash. 
	 */
	goHome: function()
	{
	    window.location.hash = "";
	},
	/**
	 * Add route paths for guest dialogs (login, signup, password recovery, 
	 * resend activation, etc.)
	 */
	addRoutesForGuests: function() {
	    _.each(Pi.dialog.forGuests, function(id) {
		Pi.router.route(id, function() {
		    Pi.dialog.open({
			'dataId': id,
			'title': Pi.dialog.data[id].title
		    });
		    Pi.user.nav.activate(id);
		});
	    });
	},
	/**
	 * Remove route paths for guest dialogs.
	 */
	removeRoutesForGuests: function() {
	    _.each(Pi.dialog.forGuests, function(id) {
		Pi.router.route(id, function() {
		    return;
		});
	    });
	}
    });

    /**
     * Routes.
     */
    Pi.router = new Router();
    Pi.router.route("signout", "signout");
    Pi.router.route("alreadyActive", "alreadyActive");
    Pi.router.route("activated", "activated");
    Pi.router.route("contribute", "contribute");
    Pi.router.route("about", "about");
//    Pi.router.route("art", "art");
//    Pi.router.route("page/:page(/)", "page");
    Pi.router.route("find(/:id)(/)", "find");
    Pi.router.route(Pi.action.openProject + "/:id(/:action)(/:tabId)(/)", "openProject");
    Pi.router.route("me", "me");
    if (Pi.user.isGuest()) {
	Pi.router.addRoutesForGuests();
    }



    /**
     * Router events.
     */
//    Pi.router.on("route", function(route) {
//	if (route !== "page") {
//	    require([
//		'Pi/start/startPages'
//	    ], function(Pi) {
//		Pi.pageView.hide();
//	    });
//	}
//    });

    Backbone.history.start();

    return Router;
});
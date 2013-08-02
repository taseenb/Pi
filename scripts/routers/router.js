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
	    if (!Pi.isGuest) {
		console.log("I am " + Pi.user.get('email'));
	    } else {
		console.log("I am " + undefined);
	    }
	},
	/**
	 * Open or bring to front a particular ide (and a tab, if defined).
	 */
	openProject: function(id, action)
	{
	    require([
		'Pi/start/startUser'
	    ], function(Pi) {
		var projectId = id.replace("/", "");
		Pi.user.openProject(projectId, action);
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
	find: function(collectionId) {
	    require([
		'Pi/start/startFinder'
	    ], function() {
		Pi.finderView.show();
		//console.log(collectionId);
	    });
	},
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
	    if (Pi.isGuest) {
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
	    if (Pi.isGuest) {
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
    Pi.router.route("find(/:collectionId)(/)", "find");
    Pi.router.route(Pi.action.openProject + "/:id(/:action)(/:tabId)(/)", "openProject");
    Pi.router.route("me", "me");
    if (Pi.isGuest) {
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
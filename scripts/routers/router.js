define([
    'Pi', 'jquery', 'backbone',
    
    // Templates
    "text!tpl/static/about.html",
    "text!tpl/static/contribute.html",
    
    // Start Pi
    'Pi/start/startUnderscoreTemplate',
    'Pi/start/startDataBinding',
    'Pi/start/startDesktop',
    'Pi/start/startDialogs',
    'Pi/start/startUser'

], function(Pi, $, Backbone, aboutHtml, contributeHtml) {

    var Router = Backbone.Router.extend({
	// initialize: function() {},
	routes: {
	    "": "start",
	    ":anything": "redirect"
	},
	start: function()
	{
	    require([
		'Pi/start/startTitle',
		'Pi/start/startEvents'
	    ]);
	},
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
	openProject: function(ideId, tabId, fullScreen)
	{
	    var ide = Pi.openIdes.get(ideId.replace("/", ""));
	    if (ide)
	    {
		ide.set('active', true);
		if (tabId)
		    var tab = ide.tabs.get(tabId.replace("/", ""));
		if (tab)
		    tab.set('active', true);
	    }
	    else
	    {
		this.goHome();
	    }
	    //console.log(fullScreen);
	    if (fullScreen === "fs") {
		ide.playSketch({
		    fullScreen: true
		});
	    } else if (fullScreen === "play") {
		ide.playSketch({
		    fullScreen: false
		});
	    }
	},
	/**
	 * Redirects.
	 * @param {string} route The name of the route.
	 */
	redirect: function(route)
	{
	    if ($.inArray(route, Pi.dialog.names) > -1) {
		this.dialog(route);
		return;
	    }
	    this.goHome();
	},
	/**
	 * Show desktop coding environment.
	 */
	art: function() {
	    // Nothing special.
	},
	/**
	 * Manager.
	 */
	find: function() {
	    require([
		'Pi/start/startManager'
	    ], function() {
		Pi.managerView.open();
	    });
	},
	/**
	 * Static page.
	 * @param {string} page Template file name (without the .html part). This file must be located in tpl/pages/
	 */
	page: function(page) {
	    require([
		'Pi/start/startPages'
	    ], function() {
		Pi.page.set({
		    "template": page
		});
		Pi.pageView.show();
	    });
	},
	/**
	 * Temporary about.
	 */
	about: function() {
	    require([
		'Pi/start/startDialogs',
	    ], function(Pi) {
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
	    ], function(Pi) {
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
	 * Fill a Dialog model and/or directly open a modal dialog from cache.
	 * @param {string} id The name of the dialog to open (must be one of this.dialogs).
	 */
	dialog: function(id)
	{
	    if ($.inArray(id, Pi.dialog.names) > -1)
	    {
		Pi.dialog.open({
		    dataId: id,
		    title: Pi.dialog.data[id].title
		});
		Pi.user.nav.activate(id);
	    }
	    else
		this.goHome();
	}
	,
	/**
	 * Reset the location hash. 
	 */
	goHome: function()
	{
	    window.location.hash = "";
	}
    });


    /**
     * Routes.
     */
    Pi.router = new Router();

    Pi.router.route("alreadyActive", "alreadyActive");
    Pi.router.route("activated", "activated");
    Pi.router.route("contribute", "contribute");
    Pi.router.route("about", "about");
    Pi.router.route("art", "art");
    Pi.router.route("page/:page", "page");
    Pi.router.route("find", "find");
    Pi.router.route("me", "me");
    Pi.router.route(Pi.action.openProject + "/:ideId(/:tabId)(/:fullScreen)", "openProject");



    /**
     * Router events.
     */
    Pi.router.on("route", function(route) {
	if (route !== "page") {
	    require([
		'Pi/start/startPages'
	    ], function(Pi) {
		Pi.pageView.hide();
	    });
	}
    });

    Backbone.history.start();

    return Router;
});
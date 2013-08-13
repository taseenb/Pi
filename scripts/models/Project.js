define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Collections
    'collections/Tabs',
    // Models
    'models/Tab',
    // Views
    'views/Project/OutputView',
    // Processing
    "processing",
    // JsHint
    //"jshint", // JSHINT
    // Backbone Extensions
    'relational',
    'Pi/Model',
    // Other extentions
    'Pi/Logger',
    // Helpers
    'Pi/Js',
    // Start
    "Pi/start/iframeMessenger"

], function(Pi, Backbone, $, Tabs, Tab, OutputView, Processing) {

    "use strict";

    var Project = Backbone.RelationalModel.extend({
	modelName: "Project",
	urlRoot: Pi.basePath + '/project',
	relations: [{
		type: Backbone.HasMany,
		key: 'tabs',
		relatedModel: Tab,
		collectionType: Tabs,
		reverseRelation: {
		    key: 'project_id',
		    includeInJSON: 'id'
		}
	    }],
	/**
	 * Ide is the model for projects (projects table in the db).
	 */
	defaults: {
	    // app
	    autoSave: false,
	    liveCode: false,
	    codeIsNew: false,
	    consoleOpen: false,
	    running: false,
	    isPaused: true,
	    jsMode: false,
	    fullScreen: false,
	    iconClasses: "maximize",
	    outputResized: false,
	    ouputPosition: {
		left: 0,
		top: 0
	    },
	    saved: true,
	    front: true,
	    active: true, // must be true, otherwise ide will not be active when initialized
	    // db "projects"
	    user_id: undefined,
//	    preview_id: undefined,
	    name: undefined,
	    description: undefined,
	    minimized: 0,
	    maximized: 0,
	    open: 0,
	    public: 1,
	    left: undefined,
	    top: undefined,
	    iconLeft: undefined,
	    iconTop: undefined,
	    width: undefined,
	    height: undefined,
	    zIndex: undefined
	},
	/**
	 * Attributes that can be updated on the server side.
	 */
	safeAttributes: [
	    "user_id",
	    "preview_id",
	    "name",
	    "description",
	    "minimized",
	    "maximized",
	    "open",
	    "public"
	],
	/**
	 * Init.
	 */
	initialize: function()
	{
	    // Setup ide window size and position
//	    var setup = this.setupWindow();
//	    this.set({
//		width: setup['width'],
//		height: setup['height'],
//		top: setup['top'],
//		left: setup['left'],
//		zIndex: setup['zIndex']
//	    });

	    // Create a new name for the ide/project, if new
	    if (!this.get('name') && this.isNew())
	    {
		this.set({
		    'name': this.createNewTitle(Pi.sessions)
		});
	    }

	    // Set saved state
//	    if (Pi.user.isGuest())
//		this.set('saved', true);

	    // Start tracking changes and unsaved attributes. Never track 'user_id'.
	    var attrsToTrack = _.without(this.safeAttributes, 'user_id');
	    this.trackUnsaved(attrsToTrack);

	},
	/**
	 * Create an unique Id to attach extra Pi methods (play, pause)
	 * @returns {string} Uid for this ide.
	 */
	getUid: function() {

	    if (!this.uid)
		this.uid = Pi.js.generateUid();
	    return this.uid;
	},
	/**
	 * Run the Processing sketch in a new output window. 
	 * @param {object} options A list of key:value pairs containing options.
	 */
	playSketch: function(options)
	{
	    try {
		this.stopSketch();
		// Create the output view
		if (!this.outputView) {
		    this.outputView = new OutputView({
			model: this
		    });
		    this.outputView.iframeReady = false;
		}
		// Init the output view and wait for the iframe to be ready
		if (this.outputView.iframeReady) {
		    this.outputView.iframeSendCode();
		}
		// Set fullscreen
		this.set('fullScreen', (options && options.fullScreen) ? true : false);
		this.outputView.fullScreenState();
	    }
	    catch (e)
	    {
		console.log(e);
	    }



//	    }
//	    catch (e)
//	    {
//		this.stopSketch({
//		    hide: true,
//		    liveCode: false
//		});
//		var $console;
//		if (!this.ideView) {
//		    Pi.user.createIdeView(this);
//		}
//		$console = this.ideView.$console;
//		$console.html('');
//		//console.log(e);
//		$console.append("<p>" + e.toString() + "</p>");
//		$console[0].scrollLeft = $console[0].scrollWidth;
//		$console[0].scrollTop = $console[0].scrollHeight;
//		this.set('consoleOpen', true);
//	    }
	},
	/**
	 * Override println and print methods in Processing.js. 
	 * println sends the canvas id to the logger, making it possible 
	 * to have different loggers for different instances of Pjs (one for each Ide). 
	 * (NOTE: Processing.logger was overridden by Pi in piLogger.js)
	 * @param {object} pjs The processing JS instance.
	 */
	startPjsLogger: function(pjs) {
	    var canvasId = pjs.externals.canvas.id,
		    logBuffer = [];
	    Processing.logger.ide[canvasId] = this;
	    // Override Processing println
	    pjs.println = function(message) {
		var bufferLen = logBuffer.length;
		if (bufferLen) {
		    Processing.logger.log(logBuffer.join(""), canvasId);
		    logBuffer.length = 0;
		}
		if (arguments.length === 0 && bufferLen === 0)
		    Processing.logger.log("", canvasId);
		else if (arguments.length !== 0)
		    Processing.logger.log(message, canvasId);
	    };
	    // Override Processing print
	    pjs.print = function(message) {
		Processing.logger.log(message, canvasId, true);
	    };
	},
	/**
	 * Start live code mode.
	 */
	startLiveCode: function() {
	    var that = this;
	    this.livePlayInterval = window.setInterval(function() {
		if (that.get('codeIsNew')) {
		    that.playSketch({
			live: true
		    });
		    that.set('codeIsNew', false);
		}
	    }, Pi.liveCodeInterval);
	},
	/**
	 * Stop live code mode.
	 */
	stopLiveCode: function() {
	    window.clearInterval(this.livePlayInterval);
	},
	/**
	 * Check if the sketch is being played.
	 * @return {boolean} True if the sketch is running.
	 */
	isRunning: function() {
	    if (this.outputView) {
		console.log(this.outputView.iframeWindow().pjs);
		return (this.outputView.processingInstance() instanceof Processing);
	    }
	    else
	    {
		return false;
	    }
	},
	/**
	 * Stop the sketch.
	 * @param {object} options List of options: liveCode (boolean), hide (boolean)
	 */
	stopSketch: function(options)
	{
	    // Disable live code if nesessary
	    if (options && options.liveCode)
		this.set('liveCode', options.liveCode);
	    // Check if output window actually exists
	    if (this.outputView)
		this.outputView
			.iframeWindow()
			.postMessage(window.JSON.stringify({
		    'stop': true,
		    'pid': this.getId()
		}),
		"*");

	    if (!_.isEmpty(this.outputView))
	    {
		if (options && options.hide)
		    this.outputView.hide();
	    }
	    this.set({
		'running': false,
		'isPaused': true
	    });
	},
	/**
	 * Close sketch.
	 */
	exitSketch: function()
	{
	    // Data needed to simply save the open/close state of the sketch
	    var that = this;

	    if (!this.get('saved')) {
		$.when(this.askForSave())
			.done(function() {
		    if (!Pi.user.isGuest()) {
			that.set('open', false);
			that.saveSketch();
		    }
		})
			.fail(function() {
		    that.exitWithoutSaving();
		});
	    }
	    else {
		that.exitWithoutSaving();
	    }
	    Pi.router.desktop();
	},
	/**
	 * Exit without saving. 
	 * Save open state for logged users and completely removes the project for guests.
	 */
	exitWithoutSaving: function() {
	    if (!Pi.user.isGuest()) {
		this.set('open', false);
		this.saveOpenState();
	    }
	    else
	    {
		Pi.user.get('projects').remove(this);
	    }
	},
	/**
	 * Save the 'open' attribute of the Project in the db. Open must be 0 or 1;
	 */
	saveOpenState: function() {
	    if (!Pi.user.isGuest() && !this.isNew()) {
		var openState = {
		};
		openState['open'] = this.get('open');
		openState[Pi.csrfTokenName] = Pi.csrfToken;
		this.save(openState, {
		    patch: true
		});
	    }
	},
	/**
	 * Save sketch. Deactivate autosave if save() fails.
	 * @param {boolean} saveTabs Whether to also save tabs. (Defaults to true).
	 */
	saveSketch: function(saveTabs)
	{
	    if (!Pi.user.isGuest()) {
		var that = this;
		$.when(this.smartSave())
			.done(function() {
		    // only save tabs when project is saved (needed for new projects)
		    if (saveTabs !== false) {
			$.when(that.saveTabs())
				.done(function() {
			    that.set('saved', true);
			})
				.fail(function() {
			    that.set('autoSave', false);
			});
		    }
		})
			.fail(function() {
		    that.set('autoSave', false);
		});
	    }
	},
	/**
	 * Save ide tabs
	 */
	saveTabs: function()
	{
	    var saved = $.Deferred(),
		    that = this,
		    tabsLength = this.get('tabs').length,
		    saveCounter = 0;

	    this.get('tabs').each(function(tab) {
		tab.set('project_id', that.get('id'));
		$.when(tab.smartSave())
			.done(function() {
		    saveCounter++;
		    if (tabsLength === saveCounter)
			saved.resolve();
		})
			.fail(function() {
		    saved.reject();
		});
	    });
	    return saved.promise;
	},
	/**
	 * Ask a confirmation to save the sketch.
	 * @return {promise} confirmation Returns a deferred object with user's response.
	 */
	askForSave: function() {
	    // Store in the promise array to overwrite later
	    this.promise['askForSave' + this.getId()] = $.Deferred();
	    // Setup confirmation dialog
	    if (!Pi.user.isGuest()) {
		Pi.confirmation({
		    promise: this.promise['askForSave' + this.getId()],
		    title: "Save sketch",
		    message: "Do you want to save before closing?",
		    buttons: [
			{
			    label: "Save",
			    resolve: true
			},
			{
			    label: "Don't save",
			    resolve: false
			}
		    ]
		});
	    }
	    else
	    {
		Pi.confirmation({
		    promise: this.promise['askForSave' + this.getId()],
		    title: "Do you want to save?",
		    message: "If you want to save your work, please <strong><a href='#log-in'>log in</a></strong>.<br>" +
			    "Don't have an account yet? <strong><a href='#sign-up'>Sign up for Pi</a></strong>.",
		    buttons: [
			{
			    label: "Just close",
			    resolve: false
			}
		    ]
		});
	    }
	    return this.promise['askForSave' + this.getId()];
	},
	/**
	 * Get code from ide tabs. Optionally adds some extra methods at the end of the code (play, pause).
	 * @param {string} uid Unique id: if set, the extra methods will be added.
	 */
	getCode: function(uid)
	{
	    var tabs = this.get('tabs'),
		    code = "";
	    if (tabs.length)
	    {
		tabs.each(function(tab) {
		    code += tab.view.editor.getValue();
		});
	    }
	    // Add Pi extra methods (play, pause)
	    if (uid) {
		code += "void unpause" + uid + "() {loop();} void pause" + uid
			+ "(){noLoop();}";
	    }
	    //console.log(code);
	    return code;
	},
	/**
	 * Get left position for the output window, 
	 * based on ide size and position and container (desktop) width.
	 */
	getOutputLeft: function()
	{
	    var desktopWidth = Pi.user.currentDesktop.$el.width();
	    var bestPosition = this.ideView.$el.width()
		    + parseInt(this.ideView.$el.css('left')) + 50;
	    var left = bestPosition < desktopWidth ? bestPosition : 100;
	    return left;
	},
	/**
	 * Create a new title based on date and Ide sessions.
	 * @param session
	 * @returns {String}
	 */
	createNewTitle: function(session)
	{
	    // Format date: yymmdd
	    var d = new Date();
	    var year = d.getFullYear()
		    .toString()
		    .slice(-2);
	    var month = d.getMonth()
		    .toString();
	    if (month.length < 2)
		month = "0" + month;
	    var day = d.getDate()
		    .toString();
	    if (day.length < 2)
		day = "0" + day;
	    // Get a letter depending on opened sessions
	    var str = "abcdefghijklmnopqstvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	    return "sketch_" + year + month + day + str[session];
	},
	/**
	 * Add a new tab with an emtpy page and a generic name to be edited by the user.
	 */
	addNewTab: function() {
	    var tab = new Tab({
		'project_id': this,
		'name': "New",
		'editMode': true,
		'active': true,
		'main': false,
		'code': " "
	    });
	    this.get('tabs').add(tab);
	    this.ideView.addNewTab(tab);
	    this.set('saved', false);
	},
	/**
	 * Get the (only) active tab of the ide.
	 * @return {model} The tab model instance that is currently active.
	 */
	getActiveTab: function() {
	    return this.get('tabs').find(function(tab) {
		return tab.get('active') === true;
	    });
	},
	/**
	 * Get the (only) main tab.
	 */
	getMainTab: function() {
	    return this.get('tabs').find(function(tab) {
		return tab.isMain() === true;
	    });
	},
	/**
	 * Activates the main tab.
	 */
	setMainTabActive: function() {
	    this.getMainTab()
		    .set({
		active: true
	    });
	},
	/**
	 * Start auto save.
	 */
	startAutoSave: function() {
	    var that = this;
	    this.autoSaveInterval = window.setInterval(function() {
		if (!that.get('saved')) {
		    that.saveSketch();
		    console.log("autosaved @ " + Pi.js.formatDateTime());
		}
	    }, Pi.autoSaveInterval);
	},
	/**
	 * Stop auto save.
	 */
	stopAutoSave: function() {
	    if (this.autoSaveInterval) {
		window.clearInterval(this.autoSaveInterval);
	    }
	}
    });

    return Project;

});
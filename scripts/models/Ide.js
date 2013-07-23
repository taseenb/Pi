define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Collections
    // Models
    'models/Tab',
    // Views
    'views/OutputView',
    // Processing
    "processing",
    // Backbone Extensions
    'Pi/Model',
    // Other extentions
    'Pi/Logger',
    // Helpers
    'Pi/Js'

], function(Pi, Backbone, $, Tab, OutputView, Processing) {

    "use strict";

    var Ide = Backbone.Model.extend({
	urlRoot: Pi.basePath + '/project',
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
	    iconImg: "piSketchIcon.svg",
	    iconClasses: "maximize",
	    saved: true,
	    front: true,
	    active: true, // must be true, otherwise ide will not be active when initialized
	    // db "projects"
	    collection_id: undefined,
	    name: undefined,
	    description: undefined,
	    minimized: false,
	    maximized: false,
	    open: undefined,
	    public: true,
	    left: undefined,
	    top: undefined,
	    iconLeft: undefined,
	    iconTop: undefined,
	    width: undefined,
	    height: undefined,
	    zIndex: undefined,
	    create_time: undefined, // automatically set on server side
	    update_time: undefined  // automatically set on server side
	},
	/**
	 * Attributes that can be updated on the server side.
	 */
	safeAttributes: [
	    "collection_id",
	    "name",
	    "description",
	    "minimized",
	    "maximized",
	    "open",
	    "public",
		    //	"left",
		    //	"top",
		    //	"iconLeft",
		    //	"iconTop",
		    //	"width",
		    //	"height",
		    //	"zIndex"
	],
	/**
	 * Array to store promises.
	 */
	promise: [],
	/**
	 * Init.
	 */
	initialize: function()
	{
	    // Setup ide window size and position
	    var setup = this.setupWindow();
	    this.set({
		width: setup['width'],
		height: setup['height'],
		top: setup['top'],
		left: setup['left'],
		zIndex: setup['zIndex']
	    });
	    // Create a new name for the ide/project, if new
	    if (!this.get('name') && this.isNew())
	    {
		this.set({
		    'name': this.createNewTitle(Pi.sessions)
		});
	    }

	    // Start tracking changes and unsaved attributes.
	    this.trackUnsaved(this.safeAttributes);
	},
	/**
	 * Set the size and position of a new window
	 * (based on the other contents on the desktop).
	 */
	setupWindow: function()
	{
	    // Size and position
	    var width, height, top, left, zIndex, margin = 40,
		    ideCount = Pi.openIdes.length,
		    $desktop = Pi.desktopView.$el,
		    zIndex = ideCount + 1;
	    if ($desktop.width() < (500 + margin * 4))
	    {
		width = $desktop.width() / 1.5;
		left = 0;
	    }
	    else
	    {
		width = 500;
		left = margin * (ideCount + 1);
	    }
	    if ($desktop.height() < 600 + margin)
	    {
		height = $desktop.height();
		top = 0;
	    }
	    else
	    {
		height = 600;
		top = margin * (ideCount + 1);
	    }
	    return {
		'width': width,
		'height': height,
		'top': top,
		'left': left,
		'zIndex': zIndex
	    };
	},
	/**
	 * Run the Processing sketch in a new output window. 
	 */
	playSketch: function(options)
	{
	    this.stopSketch();
	    var $console = this.view.$console;
	    // If not in liveCode mode clear the console before play.
	    if (!(options && options.live)) {
		$console.html('');
	    }
	    // Create an unique Id to attach extra Pi methods (play, pause)
	    if (!this.uid) {
		this.uid = Pi.js.generateUid();
	    }
	    try
	    {
		// Get code and pass the unique id to build the extra Pi methods
		var sketch = Processing.compile(this.getCode(this.uid));
		// Create output view
		if (!this.outputView)
		{
		    this.outputView = new OutputView({
			model: this
		    });
		    this.outputView.render();
		}
		this.set({
		    ouputPosition: {
			left: this.getOutputLeft(),
			top: this.view.$el.css('top')
		    }
		});
		this.outputView.$el.show();
		this.set({
		    'running': true,
		    'isPaused': false
		});

		// Start Processing Js
		this.outputView.processingInstance = new Processing(this.outputView.canvas(), sketch);
		this.startPjsLogger(this.outputView.processingInstance);
		this.outputView.originalWidth = this.outputView.canvas().width;
		this.outputView.originalHeight = this.outputView.canvas().height;
		this.outputView.fullScreen = (options && options.fullScreen) ? true : false;
		this.outputView.fullScreenState();
		this.outputView.liveCodeState();

	    }
	    catch (e)
	    {
		this.stopSketch({
		    hide: true,
		    liveCode: false
		});
		//console.log(e);
		$console.append("<p>" + e.toString() + "</p>");
		$console[0].scrollLeft = $console[0].scrollWidth;
		$console[0].scrollTop = $console[0].scrollHeight;
		this.set('consoleOpen', true);
	    }
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
		return (this.outputView.processingInstance instanceof Processing);
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
	    if (this.outputView
		    && this.outputView.processingInstance instanceof Processing)
	    {
		this.outputView.processingInstance.exit();
	    }
	    // Clear the canvas for a later reuse
	    if (!_.isEmpty(this.outputView))
	    {
		var o = this.outputView;
		if (o)
		{
		    o.context()
			    .clearRect(0, 0, o.canvas().width, o.canvas().height);
		}
		if (options && options.hide)
		    this.outputView.$el.hide();
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
	    var that = this;
	    if (!this.get('saved')) {
		$.when(this.askForSave())
			.done(function() {
		    that.saveSketch();
		    Pi.openIdes.remove(that);
		})
			.fail(function() {
		    Pi.openIdes.remove(that);
		});
	    }
	    else {
		Pi.openIdes.remove(that);
	    }
	},
	/**
	 * Save sketch. Deactivate autosave if save() fails.
	 */
	saveSketch: function()
	{
	    if (!Pi.isGuest) {
		var that = this;
		$.when(this.smartSave())
			.done(function() {
		    // only save tabs when ide is saved (needed for new projects)
		    $.when(that.saveTabs())
			    .done(function() {
			that.set('saved', true);
		    })
			    .fail(function() {
			that.set('autoSave', false);
		    });
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
		    tabsLength = this.tabs.length,
		    saveCounter = 0;

	    this.tabs.each(function(tab) {
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
	 * Delete the sketch.
	 */
	deleteSketch: function() {
	    var that = this;
	    $.when(this.askForDelete())
		    .done(function() {
		that.destroy({
		    success: function(model, response, options) {
			console.log("Destroyed.");
		    },
		    error: function(model, xhr, options) {
			console.log(xhr);
		    }
		});
	    });
	},
	/**
	 * Ask a confirmation to save the sketch.
	 * @return {promise} confirmation Returns a deferred object with user's response.
	 */
	askForSave: function() {
	    // Store in the promise array to overwrite later
	    this.promise['askForSave' + this.getId()] = $.Deferred();
	    // Setup confirmation dialog
	    if (!Pi.isGuest) {
		Pi.confirmation({
		    promise: this.promise['askForSave' + this.getId()],
		    title: "Save sketch",
		    message: "Do you want to save before closing?",
		    buttons: [
			{ 
			    text: "Save",
			    resolve: true
			},
			{
			    text: "Don't save",
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
		    message: "If you want to save your data, please <strong><a href='#log-in'>log in</a></strong>.<br>"+
			    "If you don't have an account yet, <strong><a href='#sign-up'>sign up for Pi</a></strong>.",
		    buttons: [
			{
			    text: "Just close",
			    resolve: false
			},
//			{
//			    text: "Log in",
//			    hash: "log-in"
//			},
//			{
//			    text: "Sign up",
//			    hash: "sign-up"
//			}
		    ]
		});
	    }
	    return this.promise['askForSave' + this.getId()];
	},
	/**
	 * Ask a confirmation to delete the sketch.
	 * @return {promise} confirmation Returns a deferred object with user's response.
	 */
	askForDelete: function() {
	    // Store in the promise array to overwrite later
	    this.promise['askForDelete' + this.getId()] = $.Deferred();
	    // Setup confirmation dialog
	    Pi.confirmation({
		promise: this.promise['askForDelete' + this.getId()],
		cancelResolve: false,
		title: "Delete sketch",
		message: "This sketch will be permanently deleted and cannot be recovered. Are you sure?",
		buttons: [
		    {
			text: "Delete",
			resolve: true
		    }
		]
	    });
	    return response;
	},
	/**
	 * Get code from ide tabs. Optionally adds some extra methods at the end of the code (play, pause).
	 * @param {string} uid Unique id: if set, the extra methods will be added.
	 */
	getCode: function(uid)
	{
	    var tabs = this.tabs,
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
	    var desktopWidth = this.container.width();
	    var bestPosition = this.view.$el.width()
		    + parseInt(this.view.$el.css('left')) + 50;
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
	    this.tabs.add(new Tab({
		project_id: this.getId(),
		name: "New",
		editMode: true,
		active: true,
		main: false,
		code: " "
	    }));
	    this.set('saved', false);
	},
	/**
	 * Get the (only) active tab of the ide.
	 * @return {model} The tab model instance that is currently active.
	 */
	getActiveTab: function() {
	    return this.tabs.find(function(tab) {
		return tab.get('active') === true;
	    });
	},
	/**
	 * Get the (only) main tab.
	 */
	getMainTab: function() {
	    return this.tabs.find(function(tab) {
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

    return Ide;

});
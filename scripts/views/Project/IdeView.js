define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Templates
    "text!tpl/Project/Ide.html",
    // Models
    "models/Project",
    // Views
    "views/Tab/TabView",
    "views/Project/TabsSelectorView",
    // Backbone Extensions
    'epoxy',
    'Pi/Model',
    // Starters
    'Pi/start/startDataBinding',
    // Plugins
    'jquery-ui'

], function(Pi, Backbone, $, IdeViewHtml, Project, TabView, TabsSelectorView) {

    "use strict";

    var IdeView = Backbone.Epoxy.View.extend({
	model: Project,
	/**
	 * Data binding.
	 */
	bindings: "data-e-bind",
	bindingHandlers: _.extend(Pi.bindingHandlers, {
	}),
	/**
	 * Init view.
	 */
	initialize: function()
	{
	    this.listenTo(this.model, "change:open", this.openState);
	    this.listenTo(this.model, "change:minimized", this.minimizedState);
	    this.listenTo(this.model, "change:maximized", this.maximizedState);
	    this.listenTo(this.model, "change:active", this.activeState);
	    this.listenTo(this.model, "change:zIndex", function() {
		this.$el.css('z-index', this.model.get('zIndex'));
	    });
	    this.listenTo(this.model, "change:jsMode", this.jsModeState);
	    this.listenTo(this.model, "change:autoSave", this.autoSaveState);
	    this.listenTo(this.model, "change:liveCode", this.liveCodeState);
	    this.listenTo(this.model, "change:consoleOpen", this.consoleState);
	    this.$el.html(IdeViewHtml).attr({
		'data-e-bind': "active:active,front:front"
	    });
	},
	/**
	 * View main attributes.
	 */
	tagName: 'div',
	className: 'win window-background',
	attributes: function() {
	    var id = this.model.getId();
	    return {
		'id': "ide" + id,
		'data-href': '#' + Pi.action.openProject + '/' + id
	    }
	},
	/**
	 * Helpers.
	 */
	width: function() {
	    return $(this.el).width();
	},
	height: function() {
	    return $(this.el).height();
	},
	top: function() {
	    return $(this.el).css('top');
	},
	left: function() {
	    return $(this.el).css('left');
	},
	storedWidth: undefined,
	storedHeight: undefined,
	storedTop: undefined,
	storedLeft: undefined,
	/**
	 * Events.
	 */
	events:
		{
		    "click .play,.refresh": function(e)
		    {
			e.stopPropagation();
			this.model.playSketch();
		    },
		    "click .stop": function(e)
		    {
			e.stopPropagation();
			this.model.stopSketch({
			    liveCode: false,
			    hide: true
			});
		    },
		    "click .max": "toggleMax",
		    "dblclick .tools": "toggleMax",
		    "click .min": function(e)
		    {
			e.stopPropagation();
			this.model.set({
			    'minimized': 1
			});
		    },
		    "click .exit": function(e)
		    {
			e.preventDefault();
			e.stopPropagation();
			this.model.exitSketch();
		    },
		    "click .save:not(.autosave)": function(e)
		    {
			e.stopPropagation();
			if (!this.model.get('saved')) {
			    if (Pi.user.isGuest())
				window.location.hash = "#log-in";
			    else
				this.model.saveSketch(true);
			}

		    },
		    "click .autosave": function(e)
		    {
			e.stopPropagation();
			if (Pi.user.isGuest())
			    window.location.hash = "#log-in";
			else
			    this.model.set('autoSave', !this.model.get('autoSave')); // toggle autosave
		    },
		    "click .javascript": function(e)
		    {
			e.stopPropagation();
			this.model.set('jsMode', !this.model.get('jsMode')); //toggle jsMode
		    },
		    "click .livecode": function(e)
		    {
			e.stopPropagation();
			this.model.set('liveCode', !this.model.get('liveCode')); //toggle liveCode
		    },
		    "click .toggle_console": function(e)
		    {
			e.stopPropagation();
			this.model.set('consoleOpen', !this.model.get('consoleOpen')); //toggle liveCode
		    },
		    "click .delete": function(e)
		    {
			e.stopPropagation();
			this.model.deleteModel();
		    },
		    "click .add_tab": function(e)
		    {
			e.stopPropagation();
			this.model.addNewTab();
		    },
		    "click .rename_tab": function(e)
		    {
			e.stopPropagation();
			var activeTab = this.model.getActiveTab();
			if (!activeTab)
			    activeTab = this.model.getMainTab();
			activeTab.set({
			    active: true,
			    editMode: true
			});
		    },
		    "click .delete_tab": function(e) {
			e.stopPropagation();
			var activeTab = this.model.getActiveTab();
			if (activeTab.isMain()) {
			    Pi.alert(
				    "That is the main tab",
				    "You are trying to delete the main tab of the project. You should delete the project instead ( <i class='icon-trash'></i> )."
				    );
			    return false;
			}
			this.model.get('tabs').get(activeTab).deleteModel();
			//this.model.get('tabs').remove(activeTab);
		    },
		    "mouseover .tools li": function(e)
		    {
			e.stopPropagation();
			this.$el.find('.tools_title').text($(e.currentTarget).attr("title"));
		    },
		    "mouseout .tools li": function(e)
		    {
			e.stopPropagation();
			this.$el.find('.tools_title').text("");
		    },
		    "mousedown": function(e)
		    {
			e.stopPropagation();
			this.model.set({
			    active: true
			});
			var href = $(e.target).attr('href');
			Pi.router.navigate(href ? href : this.$el.attr('data-href'));
		    },
		    "resizestop": function(event, ui)
		    {
			this.refreshAceEditorSize();
			// Update model
			this.model.set({
			    width: ui.size.width,
			    height: ui.size.height,
			    top: ui.position.top,
			    left: ui.position.left
			});
		    },
		    "dragstop": function(event, ui)
		    {
			// Update model
			this.model.set({
			    top: ui.position.top,
			    left: ui.position.left
			});
		    }
		},
	/**
	 * Render view.
	 */
	render: function()
	{
	    var project = this.model;
	    this.$el.css(
		    this.setupWindow()
//		    {
//		width: project.get('width'),
//		height: project.get('height'),
//		top: project.get('top'),
//		left: project.get('left'),
//		zIndex: project.get('zIndex')
//	    }
	)
		    .appendTo(Pi.user.currentDesktop.$el)
		    .resizable({
		minWidth: 400,
		minHeight: 450,
		ghost: true,
		handles: "all",
		autoHide: true
	    })
		    .draggable({
		cancel: '.code_wrapper, .tabs, .console, .nav_container, .tools li'
	    });

	    // Add tabs and update the tabs selector
	    project.get('tabs').each(function(tab) {
		this.addNewTab(tab);
	    }, this);

	    // Update states
	    this.activeState();
	    this.autoSaveState();

	    // Jquery shortcuts
	    this.$console = this.$el.find('.console');

	    return this;
	},
	/**
	 * Set the size and position of a new window
	 * (based on the other contents on the desktop).
	 */
	setupWindow: function()
	{
	    // Size and position
	    var width, height, top, left, zIndex, margin = 40,
		    ideCount = Pi.user.openProjectsCount(),
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
	 * Creates a new tab view from a tab model.
	 * @param {type} tab The tab model to be added.
	 */
	addNewTab: function(tab) {
	    tab.view = new TabView({
		model: tab
	    });
	    tab.view.render();
	    this.updateTabsSelectorView(tab);
	},
	/**
	 * Update the tab selector (create it if not available yet).
	 * @param {object} tab The tab model to be added to the tabs selector list.
	 */
	updateTabsSelectorView: function(tab) {
	    var project = this.model;
	    if (!project.tabsSelectorView) {
		project.tabsSelectorView = new TabsSelectorView({
		    model: project
		});
	    }
	    project.tabsSelectorView.add(tab);
	},
	/**
	 * Refresh Ace editor size. Needed after any resize of the editor container.
	 */
	refreshAceEditorSize: function() {
	    this.model.get('tabs').each(function(tab)
	    {
		tab.view.editor.resize(true);
	    });
	},
	/**
	 * Show the ide if open, hide if not.
	 */
	openState: function() {
	    if (this.model.get('open'))
		this.$el.show();
	    else
		this.$el.hide();
	},
	/**
	 * Active state.
	 */
	activeState: function()
	{
	    if (this.model.get('active'))
	    {
		this.bringToFront();
		Pi.desktop.set({
		    active: false
		});
	    }
	},
	minimizedState: function() {
	    if (this.model.get('minimized'))
	    {
		this.$el.hide();
	    }
	    else
	    {
		this.model.set({
		    active: true
		});
		this.$el.show();
	    }
	},
	maximizedState: function() {
	    if (this.model.get('maximized'))
	    {
		this.$el.addClass('maximized');
		this.refreshAceEditorSize();
	    }
	    else
	    {
		this.$el.removeClass('maximized');
		this.refreshAceEditorSize();
	    }
	},
	toggleMax: function(e) {
	    e.stopPropagation();
	    this.model.set({
		'maximized': !this.model.get('maximized')
	    });
	},
	/**
	 * Bring to front.
	 */
	bringToFront: function()
	{
	    var that = this,
		    projects = Pi.user.get('projects');
	    projects.each(function(project)
	    {
		if (project.cid !== that.model.cid) {
		    var z = project.attributes.zIndex;
		    project.set({
			zIndex: z - 1,
			active: false,
			front: false
		    });
		}
	    });
	    this.model.set({
		zIndex: Pi.user.openProjectsCount() + 1,
		front: true
	    });
	},
	/**
	 * Get long title.
	 */
	getLongTitle: function()
	{
	    return this.model.get('name') + " - " + Pi.shortName + " (" + Pi.version + ")";
	},
	/**
	 * Javascript view for the active tab.
	 */
	jsModeState: function() {
	    this.model.getActiveTab().view.toggleJsEditor();
	},
	/**
	 * Livecode.
	 */
	liveCodeState: function() {
	    if (this.model.get('liveCode')) {
		this.model.startLiveCode();
	    }
	    else
	    {
		this.model.stopLiveCode();
	    }
	},
	/**
	 * Show/hide console.
	 */
	consoleState: function() {
	    if (this.model.get('consoleOpen')) {
		this.showConsole();
	    }
	    else
	    {
		this.hideConsole();
	    }
	},
	/**
	 * Show the console
	 */
	showConsole: function() {
	    var that = this;
	    this.$el.find('.code_wrapper')
		    .stop(true, true)
		    .animate({
		bottom: 110
	    },
	    200, function() {
		that.refreshAceEditorSize(); // refresh needed by Ace editor
	    });
	},
	/**
	 * Hide the console
	 */
	hideConsole: function() {
	    var that = this;
	    this.$el.find('.code_wrapper')
		    .stop(true, true)
		    .animate({
		bottom: 24
	    },
	    200, function() {
		that.refreshAceEditorSize(); // refresh needed by Ace editor
	    });
	},
	/**
	 * Auto save state on/off.
	 */
	autoSaveState: function() {
	    var saveBtn = this.$el.find(".save"),
		    autoSaveBtn = this.$el.find(".autosave");
	    if (this.model.get('autoSave')) {
		saveBtn.hide();
		autoSaveBtn
//			.addClass('active')
			.attr({
		    title: "Auto Save is on"
		});
		this.model.startAutoSave();
	    }
	    else
	    {
		saveBtn.show();
		autoSaveBtn
//			.removeClass('active')
			.attr({
		    title: "Auto Save is off"
		});
		this.model.stopAutoSave();
	    }
	}
    });

    return IdeView;

});
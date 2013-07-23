define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Templates
    "text!tpl/Ide.html",
    // Models
    "models/Ide",
    // Backbon Extensions
    'Pi/Model',
    // Plugins
    'jquery-ui'

], function(Pi, Backbone, $, IdeHtml, Ide) {

    "use strict";

    var ideTemplate = _.template(IdeHtml);

    var IdeView = Backbone.View.extend({
	model: Ide,
	/**
	 * Init view.
	 */
	initialize: function()
	{
	    // Listen to
	    this.listenTo(this.model, "change:minimized", this.minimizedState);
	    this.listenTo(this.model, "change:saved", this.saveState);
	    this.listenTo(this.model, "change:active", this.activeState);
	    this.listenTo(this.model, "change:zIndex", this.zIndexState);
	    this.listenTo(this.model, "change:front", this.frontState);
	    this.listenTo(this.model, "change:jsMode", this.jsModeState);
	    this.listenTo(this.model, "change:autoSave", this.autoSaveState);
	    this.listenTo(this.model, "change:liveCode", this.liveCodeState);
	    this.listenTo(this.model, "change:consoleOpen", this.consoleState);
	    this.listenTo(this.model, "change:running", this.runningState);
	},
	/**
	 * View main attributes.
	 */
	tagName: 'div',
	className: 'win',
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
		    "click .min": function(e)
		    {
			e.stopPropagation();
			this.model.set({
			    'minimized': true
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
			if (Pi.isGuest)
			    window.location.hash = "#log-in";
			else
			    this.model.saveSketch();

		    },
		    "click .autosave": function(e)
		    {
			e.stopPropagation();
			if (Pi.isGuest)
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
			this.model.deleteSketch();
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
			//this.$el.find('#dropdown' + this.model.getId()).dropdown();
			//console.log("delete tab");
			var activeTab = this.model.getActiveTab();
			if (activeTab.isMain()) {
			    Pi.alert(
				    "That is the main tab!",
				    "You are trying to delete the main tab of the project. You should delete the project instead."
				    );
			    return false;
			}
			this.model.tabs.remove(activeTab);
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
			window.location.hash = href ? href : this.$el.attr('data-href');
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
	    var that = this,
		    ideModel = this.model.attributes;

	    this.$el
		    .html(
		    ideTemplate({
		name: this.model.get('name'),
		id: this.model.getId()
	    })
		    )
		    .addClass('window-background')
		    .attr({
		'id': "ide" + this.model.getId(),
		'data-href': '#' + Pi.action.openProject + '/' + this.model.getId()
	    })
		    .css({
		width: ideModel.width,
		height: ideModel.height,
		top: ideModel.top,
		left: ideModel.left,
		zIndex: ideModel.zIndex
	    })
		    .appendTo(this.model.container)
		    .resizable({
		minWidth: 400,
		minHeight: 450,
		ghost: true,
		handles: "all",
		autoHide: true
	    })
		    .draggable({
		cancel: '.code_wrapper, .tabs, .console',
	    });

	    // Update states
	    this.activeState();
	    this.autoSaveState();
	    this.saveState();

	    // Jquery shortcuts
	    this.$console = this.$el.find('.console');

	    // Render tabs (only after ide is complete)
//	    this.model.tabs.each(function(tab) {
//		tab.view.render();
//	    });


	    return this;
	},
	/**
	 * Refresh Ace editor size. Needed after any resize of the editor container.
	 */
	refreshAceEditorSize: function() {
	    this.model.tabs.each(function(tab)
	    {
		tab.view.editor.resize(true);
	    });
	},
	/**
	 * Change save state.
	 */
	saveState: function()
	{
	    var savedButton = this.$el.find('.save');
	    if (this.model.get('saved'))
	    {
		savedButton.addClass("unactive");
	    }
	    else
	    {
		savedButton.removeClass("unactive");
	    }
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
		this.$el.addClass('active front');
		if (this.model.outputView)
		    this.model.outputView.$el.addClass('active');
	    }
	    else
	    {
		this.$el.removeClass('active');
		if (this.model.outputView)
		    this.model.outputView.$el.removeClass('active');
	    }
	},
	/**
	 * Front state: front window is the first window, even if not active.
	 */
	frontState: function() {
	    if (this.model.get('front'))
	    {
		this.$el.addClass('front');
		if (this.model.outputView)
		    this.model.outputView.$el.addClass('front');
	    }
	    else
	    {
		this.$el.removeClass('front');
		if (this.model.outputView)
		    this.model.outputView.$el.removeClass('front');
	    }
	},
	/**
	 * Z-Index state.
	 */
	zIndexState: function()
	{
	    var z = this.model.get('zIndex');
	    this.$el.css({
		'zIndex': z
	    });
	    if (this.model.outputView) {
		this.model.outputView.$el.css({
		    'zIndex': z + 1
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
	/**
	 * Bring to front.
	 */
	bringToFront: function()
	{
	    var that = this;
	    Pi.openIdes.each(function(model)
	    {
		if (model.cid !== that.model.cid) {
		    var z = model.attributes.zIndex;
		    model.set({
			zIndex: z - 1,
			active: false,
			front: false
		    });
		}
	    });
	    this.model.set({
		zIndex: Pi.openIdes.length + 1,
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
	    if (this.model.get('jsMode')) {
		this.$el.find(".javascript").addClass('active');
	    }
	    else
	    {
		this.$el.find(".javascript").removeClass('active');
	    }
	    this.model.getActiveTab().view.toggleJsEditor();
	},
	/**
	 * Livecode.
	 */
	liveCodeState: function() {
	    if (this.model.get('liveCode')) {
		this.$el.find(".livecode").addClass('active');
		this.model.startLiveCode();
	    }
	    else
	    {
		this.$el.find(".livecode").removeClass('active');
		this.model.stopLiveCode();
	    }
	},
	/**
	 * Show/hide console.
	 */
	consoleState: function() {
	    if (this.model.get('consoleOpen')) {
		this.$el.find(".toggle_console").addClass('active');
		this.showConsole();
	    }
	    else
	    {
		this.$el.find(".toggle_console").removeClass('active');
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
			.addClass('active')
			.attr({
		    title: "Auto Save is on"
		});
		this.model.startAutoSave();
	    }
	    else
	    {
		saveBtn.show();
		autoSaveBtn
			.removeClass('active')
			.attr({
		    title: "Auto Save is off"
		});
		this.model.stopAutoSave();
	    }
	},
	runningState: function() {
	    if (this.model.get('running')) {
		this.$el.find('.play').hide();
		this.$el.find('.refresh').show();
	    }
	    else
	    {
		this.$el.find('.refresh').hide();
		this.$el.find('.play').show();
	    }
	},
	/**
	 * Change play button into Pause on the ide when the sketch is running.
	 * NOT USED ANYMORE.
	 */
	pauseState: function() {
	    if (!this.model.get('isPaused')) {
		this.$el.find('.play').hide();
		this.$el.find('.pause').show();
	    }
	    else
	    {
		this.$el.find('.pause').hide();
		this.$el.find('.play').show();
	    }
	}

    });

    return IdeView;

});
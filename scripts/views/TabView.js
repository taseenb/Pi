define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Templates
    "text!tpl/Tab.html",
    // Ace
    "ace",
    // Plugins
    "bootstrap-dropdown"

], function(Pi, Backbone, $, TabHtml, ace) {

    "use strict";

    var tabTemplate = _.template(TabHtml);

    var TabView = Backbone.View.extend({
	/**
	 * Init view.
	 */
	initialize: function() {
	    // Listen to
	    this.listenTo(this.model, "change:active", this.activeState);
	    this.listenTo(this.model, "change:editMode", this.editModeState);
	    this.listenTo(this.model, "change:name", this.nameState);
	    this.listenTo(this.model, "change:code", this.codeChange);
	    this.listenTo(this.model, "change:saved", this.savedState);

	    // Create a unique Id for the Tab $el
	    this.uniqueId = this.model.getTabUniqueId();
	},
	/**
	 * Tab tag is a "<li>".
	 */
	tagName: "li",
	/**
	 * Render view.
	 * Create the tab and store into $el
	 */
	render: function() {
	    var $tabs = this.model.getIde$().find('.nav-tabs');
	    $tabs.find('#new_tab').before(this.$el);
	    this.renderTab();
	    this.renderEditor();

	    // Set this tab active
	    this.model.set('active', true);

	    // Update the states
	    this.activeState(); // IMPORTANT: show the active tab
	    this.editModeState();
	},
	/**
	 * Events.
	 */
	events: {
	    'mousedown': function(e)
	    {
		e.stopPropagation();
		// Close the tab selector
		// this.model.getIde().tabsSelector.close();
	    },
	    'dblclick': function(e)
	    {
		if (!this.model.get('editMode'))
		{
		    this.model.getIde().tabs.setAll({
			editMode: false
		    },
		    this.model.getId());
		    this.model.set('editMode', true);
		}
	    },
	    'click .cancel': function(e)
	    {
		this.cancelRename();
	    },
	    'click .apply': function(e)
	    {
		this.applyRename();
	    },
	    'keyup input[type="text"]': function(e) {
		//console.log(e.keyCode);
		if (e.keyCode === 13) {
		    // Enter
		    this.applyRename();
		} else if (e.keyCode === 27) {
		    // Esc
		    this.cancelRename();
		}
	    },
	},
	/**
	 * Html for tab.
	 */
	renderTab: function() {
	    var tabHref = '#' + Pi.action.openProject + '/' + this.model.get('project_id') + '/' + this.model.getId();
	    this.$el.attr({
		'id': 'tab' + this.uniqueId,
		'class': this.model.isMain() ? "main" : ""
	    })
		    .html(
		    tabTemplate({
		"tabHref": tabHref,
		"name": this.model.get('name'),
		"fileNameMaxLength": Pi.fileNameMaxLength
	    })
		    );
	},
	/**
	 * Html for editor.
	 */
	renderEditor: function() {
	    var that = this,
		    ide = this.model.getIde(),
		    $ideView = this.model.getIde$(),
		    tab = this.model.attributes,
		    codeId = 'code' + this.uniqueId,
		    javascriptId = 'js' + this.uniqueId;

	    /**
	     * Editor containers (.code_wrapper in css).
	     */
	    $ideView.find('.tab-content').append(
		    '<div class="tab-pane" id=' + this.uniqueId + '>' +
		    '<div id="' + codeId + '" class="code"></div>' +
		    '<div id="' + javascriptId + '" class="code js-code"></div>' +
		    '</div>');
	    /**
	     * Setup Ace editor for the Processing language.
	     */
	    this.editor = ace.edit(codeId);
	    this.editor.getSession().setMode("ace/mode/java");
	    this.editor.setTheme("ace/theme/chrome");
	    this.editor.setValue(this.model.get('code'));
	    this.editor.container.style.fontSize = '13px';
	    this.editor.renderer.setShowGutter(false);
	    this.editor.setHighlightActiveLine(false);
	    this.editor.setShowPrintMargin(false);
	    this.editor.renderer.setHScrollBarAlwaysVisible(true);
	    this.editor.clearSelection();
	    this.editor.gotoLine(0);
	    if (tab.main)
		this.editor.focus();

	    // IMPORTANT! Uncomment the following line to resolve a problem when 
	    // using the ace.js file without the CDN):
	    // this.editor.getSession().setUseWorker(false);

	    /**
	     * Ace editor events.
	     */
	    this.editor.getSession().on('change', function(e) {
		that.model.set('code', that.editor.getValue());
		that.model.set('saved', false);
		if (ide.get('liveCode'))
		    ide.set('codeIsNew', true);
	    });
	    this.editor.getSession().selection.on('changeCursor', function(e) {
		$ideView.find('.status')
			.text(that.editor.selection.getCursor()["row"] + 1);
	    });

	    // Wrap the editor divs in jquery objects
	    this.$editor = $("#" + codeId);
	    this.$editorJs = $('#js' + this.uniqueId).hide();
	},
	/**
	 * Render an Ace editor for read-only javascript.
	 * This editor is only created if needed, if ide jsMode is switched on and this tab is active.
	 */
	renderJsEditor: function() {
	    this.editorJs = ace.edit('js' + this.uniqueId);
	    this.editorJs.getSession().setMode("ace/mode/javascript");
	    this.editorJs.setTheme("ace/theme/chrome");
	    this.editorJs.setReadOnly(true);
	    // Options
	    this.editorJs.container.style.fontSize = '13px';
	    this.editorJs.renderer.setShowGutter(false);
	    this.editorJs.setHighlightActiveLine(false);
	    this.editorJs.setShowPrintMargin(false);
	    this.editorJs.renderer.setHScrollBarAlwaysVisible(true);
	},
	/**
	 * Change active state. 
	 */
	activeState: function() {
	    var ide = this.model.getIde();
	    if (this.model.get('active')) {
		ide.tabs.setAll({
		    active: false
		},
		this.model.getId());
		this.$el.addClass('active');
		// Show code
		ide.view.$el.find('#' + this.uniqueId).show();
	    }
	    else
	    {
		this.$el.removeClass('active');
		// Hide code
		ide.view.$el.find('#' + this.uniqueId).hide();
	    }
	    this.toggleJsEditor();
	},
	/**
	 * Enter/exit from edit mode (rename tab).
	 */
	editModeState: function() {
	    var a = this.$el.find('a'),
		    tabEditor = this.$el.find('.tab_editor');
	    if (this.model.get('editMode')) {
		this.model.getIde().tabs.setAll({
		    editMode: false
		},
		this.model.getId());
		a.hide();
		tabEditor.show().find('input').val(this.model.get('name')).focus();
	    }
	    else
	    {
		a.show();
		tabEditor.hide();
		tabEditor.find('input').val('');
	    }
	},
	/**
	 * Update the name of the tab. 
	 * If this is the main tab, it will update the name of the project/ide too.
	 */
	nameState: function() {
	    var name = this.model.get('name'),
		ide = this.model.getIde();
	    this.$el.find('.tab-name').text(name);
	    if (this.model.isMain()) {
		ide.set('name', name);
	    }
	    // Rename tab selector item
	    ide.tabsSelector.rename(this.model);
	},
	/**
	 * Save state.
	 */
	savedState: function() {
	    //console.log(this.model.get('id') + ": " + this.model.get('saved'));
	    if (this.model.get('saved'))
		this.$el.find('.unsaved').hide();
	    else
		this.$el.find('.unsaved').show();
	},
	/**
	 * Update code state: show code was saved.
	 */
	codeChange: function() {
	    this.model.getIde().set('saved', false);
	},
	/**
	 * Validate the new name, apply the change and exit the editing mode.
	 */
	applyRename: function() {
	    var name = this.$el.find('input').val();
	    if (name.indexOf(" ") !== -1)
		name = Pi.js.camelCase(name);
	    name = name.replace(/-/g, "_");
	    if (/^[A-Za-z0-9_]+$/.test(name))
	    {
		this.model.rename(name);
		this.model.set('saved', false);
		this.model.set('editMode', false);
	    }
	    else
	    {
		Pi.alert("Invalid characters", "Your new tab name contains invalid characters.<br>\n\
		Please use digits, letters or underscore only. And no spaces.");
	    }
	},
	/**
	 * Exit the editing mode without changes.
	 */
	cancelRename: function() {
	    this.model.set('editMode', false);
	},
	/**
	 * Switch the javascript view of this tab (a read only Ace editor).
	 */
	toggleJsEditor: function() {
	    if (this.model.getIde().get('jsMode')) {
		this.startJavascriptMode();
	    }
	    else
	    {
		this.stopJavascriptMode();
	    }
	},
	/**
	 * Swtich on the javascript view for this tab.
	 */
	startJavascriptMode: function() {
	    if (!this.editorJs) {
		this.renderJsEditor();
	    }

	    // Toggle the visibility of the editor.
	    if (!this.$editorJs.is(":visible")) {
		// Update js code
		var jsCode = Processing.compile(this.editor.getValue()).sourceCode;
		// Remove pjs intro line
		jsCode = jsCode.replace(
			"// this code was autogenerated from PJS\n(function($p) {\n",
			"// Javascript compiled version of " + this.model.get("name") + "\n// This code is read-only.\n"
			);
		jsCode = jsCode.replace(/}\)$/, "");
		// Update js editor
		this.editorJs.setValue(jsCode);
		// Clear selection
		this.editorJs.clearSelection();
		// Go to the first line
		this.editorJs.gotoLine(0);
		// Show js, hide processing
		this.$editor.hide();
		this.$editorJs.show();
		this.$el.addClass('js');
	    }
	},
	/**
	 * Switch off the javascript mode.
	 */
	stopJavascriptMode: function() {
	    if (!this.$editor.is(":visible")) {// Hide the editor if existing
		this.$editorJs.hide();
		this.$editor.show();
		this.$el.removeClass('js');
	    }
	}

    });

    return TabView;

});
define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Templates
    "text!tpl/Popup.html",
    // Collections
    // Models
    // Views

    // Backbone Extensions
    'Pi/Model'

], function(Pi, Backbone, $, PopupHtml) {

    var popupTemplate = _.template(PopupHtml);

    var DialogView = Backbone.View.extend({
	initialize: function() {
//	    this.listenTo(this.model, "change:content", this.render);
	    this.listenTo(this.model, "change:height change:width", this.sizeState);
	},
	events: {
	    "click .exit": function() {
		this.hide();
	    }
	},
	render: function() {
	    // Render the requested template (see router)
	    var that = this,
		    model = this.model.attributes,
		    $desktopW = Pi.user.currentDesktop.$el.width(),
		    $desktopH = Pi.user.currentDesktop.$el.height();

	    console.log(model.buttons);

	    this.$el.css({
		height: model.height,
		width: model.width,
		left: $desktopW / 2 - model.width / 2,
		top: $desktopH / 2 - model.height / 2
	    }).html(popupTemplate({
		'content': model.content,
		'title': model.title,
		'buttons': model.buttons && _.keys(model.buttons),
		'alternativeContent': false
	    }));

	    this.show();
	    
	    return this;

//	    this.$el
//		    .html(model.content)
//		    .dialog({
//		title: model.title,
//		modal: true,
//		closeOnEscape: true,
//		autoOpen: false,
//		height: model.height,
//		width: model.width,
//		resizable: false,
//		draggable: false,
//		buttons: model.buttons,
//		close: function() {
//		    Pi.user.nav.deactivateAll();
//		    window.location.hash = "";
//		},
//		create: function() {
//		    // Add Bootstrap style to buttons
//		    that.$el.dialog('widget')
//			    .find(".ui-button")
//			    .not('.ui-dialog-titlebar-close')
//			    .addClass('btn').css({
//			"margin-left": 10
//		    });
//		}
//	    });
//	    // Add close icon
//	    this.$el.dialog('widget')
//		    .find('.ui-dialog-titlebar-close')
//		    .addClass('text-shadow')
//		    .html('<i class="icon-remove-sign"></i>');
//	    this.init = true;
//	    this.sizeState();
//	    this.open();
//	    return this;

	},
	show: function() {
	    this.$el.show();
	},
	hide: function() {
	    this.$el.hide();
	},
	refresh: function() {
	    this.$el.empty();
	    this.render();
	},
	/**
	 * On size change.
	 */
	sizeState: function() {
	    if (this.init) {
		var that = this,
			height = this.model.get("height"),
			width = this.model.get("width");
		that.$el.dialog({
		    position: {
			my: "center",
			at: "center",
			of: window
		    },
		    height: height,
		    width: width
		}).show();
	    }
	}

    });

    return DialogView;


});
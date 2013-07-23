define([
    // Main scripts
    'Pi', 'backbone', 'jquery', 'jquery-ui',
    
    // Backbone Extensions
    
], function(Pi, Backbone, $) {

    "use strict";

    var IconView = Backbone.View.extend({
	initialize: function() {
	    this.listenTo(this.model, "change:minimized", this.visibleState);
	    this.listenTo(this.model, "change:name", this.nameState);
	},
	tagName: 'div',
	className: 'icon no_select',
	events: {
	    "dragstop": function(event, ui) {
		this.model.set({
		    iconTop: ui.position.top,
		    iconLeft: ui.position.left
		});
	    },
	    "click": function(e) {
		e.stopPropagation();
		this.model.set({
		    minimized: false
		});
	    }
	    // DO NOT add the CLICK event here.
	    // draggable fires the click every time it stops (draggable or backbone bug?)
	    // the solution is to set the click listener BEFORE the draggable
	    // see User.js -> openIde()
	},
	render: function() {
	    var ide = this.model.attributes,
		    img = Pi.imgPath + ide.iconImg;

	    this.id = "icon" + this.model.getId();

	    this.$el
		    .html(
		    '<img src="' + img + '"><span>' + ide.name + '</span>'
		    )
		    .addClass(ide.iconClasses)
		    .css({
		"display": ide.minimized ? "block" : "none",
		"top": ide.iconTop,
		"left": ide.iconLeft
	    })
		    .appendTo(
		    this.model.container
		    )
		    .draggable({
		containment: this.model.container,
		zIndex: 100
	    });

	    this.visibleState();

	    return this;
	},
	/**
	 * Show or hide icon (fade in/out).
	 */
	visibleState: function() {
	    if (this.model.get('minimized'))
	    {
		this.$el.fadeIn(200);
	    }
	    else
	    {
		this.$el.fadeOut(200);
	    }
	},
	/**
	 * Change the name if the icon.
	 */
	nameState: function() {
	    var name = this.model.get('name');
	    this.$el.find('span').text(name);
	}
    });
    
    return IconView;

});
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
	    "dblclick": function(e) {
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
	    var project = this.model.attributes,
		    img = Pi.imgPath + Pi.defaultSketchIcon;

	    this.id = "icon" + this.model.getId();

	    this.$el
		    .html(
		    '<img src="' + img + '"><span>' + project.name + '</span>'
		    )
		    .addClass(project.iconClasses)
		    .css({
		"top": project.iconTop,
		"left": project.iconLeft
	    })
		    .appendTo(
		    Pi.user.currentDesktop.$el
		    )
		    .draggable({
		containment: Pi.user.currentDesktop.$el,
		zIndex: 100
	    });
	    
	    this.visibleState();
	    return this;
	},
	/**
	 * Show or hide icon (fade in/out).
	 */
	visibleState: function() {
	    if (this.model.get('minimized') > 0)
		this.$el.fadeIn(100);
	    else
		this.$el.fadeOut(100);
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
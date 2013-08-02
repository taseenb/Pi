define([
    // Main scripts
    'Pi', 'epoxy'

], function(Pi) {

    /**
     * Set of common binding handlers (for Epoxy). 
     */
    Pi.bindingHandlers = {
	hide: function($element, value) {
	    value ? $element.hide() : $element.show();
	},
	show: function($element, value) {
	    value ? $element.show() : $element.hide();
	},
	active: function($element, value) {
	    value ? $element.addClass('active') : $element.removeClass('active');
	},
	front: function($element, value) {
	    value ? $element.addClass('front') : $element.removeClass('front');
	},
	disabled: function($element, value) {
	    value ? $element.addClass('disabled') : $element.removeClass('disabled');
	},
	open: function($element, value) {
	    value ? $element.addClass('open') : $element.removeClass('open');
	}
    };
    
    return Pi;

});
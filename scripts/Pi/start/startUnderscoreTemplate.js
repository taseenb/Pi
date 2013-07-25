define([
    // Main scripts
    //'Pi', 'jquery', 
    'underscore'
    // Collections
    // Models
    // Views
    // Plugins

], function(_) {

    /**
     * Underscore template settings.
     * Note the order of the execution: escape, interpolate, evaluate.
     * Example: you cannot set escape: {{var}} and interpolate: {{-var}}, 
     * because the second would be captured by the first... but you can do the opposite.
     */
    _.templateSettings = {
	escape: /\{\{-(.+?)\}\}/g,    // {{-variable}}
	interpolate: /\{\{(.+?)\}\}/g,	    // {{variable}}
	evaluate: /<%([\s\S]+?)%>/g,    // <% code %>
    };


});
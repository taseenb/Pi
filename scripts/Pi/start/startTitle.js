define([
    // Main scripts
    'Pi', 'jquery'

], function(Pi, $) {

    /**
     * Set web page title.
     */
    var title = $("title").append(" (" + Pi.version + ")");
    
    return title;

});
define([
    // Main scripts
    'Pi', 'jquery',
    // Collections
    // Models
    "models/Page",
    // Views
    "views/PageView",
    
], function(Pi, $, Page, PageView) {

    Pi.page = new Page();
    Pi.pageView = new PageView({
	model: Pi.page
    });
    
    return Pi;
});
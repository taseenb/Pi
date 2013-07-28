define([
    // Main scripts
    'Pi',
    
    // Views
    "views/FinderView",

], function(Pi, FinderView) {

    /**
     * Finder
     */
    Pi.finderView = new FinderView({
	model: Pi.user,
	el: '#finder'
    });
    
    return Pi;
    
});
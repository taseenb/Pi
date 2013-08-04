define([
    // Main scripts
    'Pi',
    
    // Views
    "views/User/FinderView",
    
    // Starters
    "Pi/start/startUser",

], function(Pi, FinderView) {

    /**
     * Create the user finder.
     */
    Pi.user.finderView = new FinderView({
	model: Pi.user,
	el: '#finder'
    });
    
    return Pi;
    
});
define([
    // Main scripts
    'Pi',
    // Collections
    "collections/Projects",
    // Views
    "views/User/FinderView"
], function(Pi, Projects, FinderView) {


    /**
     * Create the user finder.
     */
    Pi.user.finderView = new FinderView({
	model: Pi.user,
	el: '#finder'
    });

    return Pi;

});
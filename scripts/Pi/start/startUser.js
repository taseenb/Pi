define([
    // Main scripts
    'Pi', 'jquery',
    // Collections
    "collections/Ides",
    // Models
    "models/User",
    // Views
    "views/NavView",
    
], function(Pi, $, Ides, User, NavView) {

    /**
     * Open Ides collection
     */
    Pi.openIdes = new Ides();

    /**
     * User
     * IMPORTANT! If id is undefined, User.isNew() will return true.
     */
    Pi.isGuest = Pi.bootstrap.isGuest;
    Pi.user = new User({
	'id': Pi.isGuest ? undefined : parseInt(Pi.bootstrap.user.id)
    });

    /**
     * Nav
     */
    Pi.user.nav = new NavView({
	model: Pi.user,
	el: '#nav'
    });
    Pi.user.nav.render();

    return Pi;
    
});
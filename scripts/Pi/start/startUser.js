define([
    // Main scripts
    'Pi', 'jquery',
    // Collections
    // Models
    "models/User",
    // Views
    "views/User/NavView",
], function(Pi, $, User, NavView) {

    /**
     * Determine if user is authenticated.
     */
    Pi.isGuest = Pi.bootstrap.isGuest;

    /**
     * Create the user model.
     * REMEMBER: if id is undefined, User.isNew() will return true.
     */
    Pi.user = new User({
	'id': Pi.isGuest ? undefined : parseInt(Pi.bootstrap.user.id)
    });
    Pi.user.bootstrap(Pi.bootstrap);
    
    /**
     * Create the user navigation bar view (that belongs to the User model).
     */
    Pi.user.nav = new NavView({
	model: Pi.user,
	el: '#nav'
    });
    Pi.user.nav.render();

    return Pi;
});
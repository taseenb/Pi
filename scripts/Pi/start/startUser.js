define([
    // Main scripts
    'Pi', 'jquery',
    // Collections
    "collections/Projects",
    "collections/Collections",
    // Models
    "models/User",
    // Views
    "views/NavView",
], function(Pi, $, Projects, Collections, User, NavView) {

    /**
     * Determine if user is authenticated.
     */
    Pi.isGuest = Pi.bootstrap.isGuest;

    /**
     * Create an Project collection to store all open projects (in the form of IDE windows).
     */
    Pi.projects = new Projects();

    /**
     * Create the user model.
     * REMEBER: if id is undefined, User.isNew() will return true.
     */
    Pi.user = new User({
	'id': Pi.isGuest ? undefined : parseInt(Pi.bootstrap.user.id)
    });
    
    /**
     * Create a collection of Collection models that belong to the user.
     */
    Pi.user.collections = new Collections();

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
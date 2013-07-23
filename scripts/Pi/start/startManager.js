define([
    // Main scripts
    'Pi', 'jquery',
    
    // Views
    "views/ManagerView",

], function(Pi, $, ManagerView) {

    /**
     * Manager
     */
    Pi.managerView = new ManagerView({
	model: Pi.user,
	el: '#manager'
    });
    //Pi.managerView.render();

    return Pi;
    
});
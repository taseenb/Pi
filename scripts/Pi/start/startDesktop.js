define([
    // Main scripts
    'Pi', 'jquery',
    // Collections
    // Models
    "models/Desktop",
    // Views
    "views/Desktop/DesktopView"
    
    // Plugins

], function(Pi, $, Desktop, DesktopView) {

    /**
     * Desktop
     */
    Pi.desktop = new Desktop();
    Pi.desktopView = new DesktopView({
	model: Pi.desktop,
	el: '#desktop'
    });
    Pi.desktopView.createPiIcon();
    
    return Pi;

});
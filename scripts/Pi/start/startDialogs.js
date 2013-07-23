define([
    // Main scripts
    'Pi', 'jquery',
    // Collections
    // Models
    "models/Dialog",
    // Views
    "views/DialogView"

], function(Pi, $, Dialog, DialogView) {

    /**
     * Pi Dialog windows.
     * This windows are used for interaction and must start before the router.
     * Log in, Sign up, Password recovery, Resend activation email, Alert, etc.
     */
    Pi.dialog = new Dialog();
    Pi.dialog.names = [
	// available dialogs
	"log-in", "sign-up", "password-recovery",
	"resend-activation-email", "alert"
    ];
    Pi.dialogView = new DialogView({
	model: Pi.dialog
    });

    /**
     * Dialog event: when dataId is changed the dialog is reloaded.
     */
    Pi.dialog.on("change:dataId", Pi.dialog.reload);

    /**
     * Open the dialog.
     * If the dialog was already loaded, just open it. Otherwise it will reload 
     * set the new Id to fire the reload.
     * @param {object} data	A list of key:value pairs with the dialog dataId, title, content, etc.
     * @param {string} data	The dataId of the dialog to open.
     */
    Pi.dialog.open = function(data, forceReload) {
	if (_.isObject(data)) {
	    if (!forceReload && Pi.dialog.get('dataId') === data.dataId
		    && Pi.dialog.get('title') === data.title) {
		Pi.dialogView.open();
	    }
	    else
	    {
		Pi.dialog.clear();
		Pi.dialog.set(data);
		Pi.dialogView.refresh();
		if (forceReload) {
		    
		}
	    }
	}
	else if (_.isString(data)) {
	    if (Pi.dialog.get('dataId') === data) {
		Pi.dialogView.open();
	    }
	    else
	    {
		Pi.dialog.set(dataId, data);
	    }
	}
    };

    /**
     * Alert dialog.
     */
    Pi.alert = function(title, content) {
	Pi.dialog.open({
	    dataId: "alert",
	    title: title,
	    content: content
	});
    };

    /**
     * Confirmation dialog.
     * (Force dialog reload to avoid using cached confirmation.)
     */
    Pi.confirmation = function(options) {
	// Create the buttons object for jquery ui dialog: http://api.jqueryui.com/dialog/#option-buttons
	var buttons = {};
	
	// Create buttons
	_.each(options.buttons, function(btn) {
	    
	    buttons[btn.text] = function() {
		$(this).dialog("close");
		if (btn.resolve !== undefined) 
		    btn.resolve ? options.promise.resolve() : options.promise.reject();
		if (btn.hash !== undefined) 
		    window.location.hash = btn.hash;
		if (btn.action !== undefined) 
		    btn.action();
	    };
	    
	});
	
	// Add a cancel button
	buttons['Cancel'] = function() {
	    if (options.cancelResolve !== undefined)
		options.cancelResolve ? options.promise.resolve() : options.promise.reject();
	    $(this).dialog("close");
	};
	// Create the confirmation dialog object
	var dialog = {
	    "dataId": "confirmation",
	    "title": options.title,
	    "content": options.message,
	    "buttons": buttons
	};
	// Open the dialog
	Pi.dialog.open(dialog, true);
    };

});
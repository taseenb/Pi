define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Collections
    // Models
    "models/Dialog",
    // Views
    "views/Dialog/DialogView"

], function(Pi, Backbone, $, Dialog, DialogView) {

    /**
     * Pi Dialog windows.
     * This windows are used for interaction and must start before the router.
     * Log in, Sign up, Password recovery, Resend activation email, Alert, etc.
     */
    Pi.dialog = new Dialog();
    
    Pi.dialogView = new DialogView({
	model: Pi.dialog
    });

    /**
     * Dialog event: when dataId is changed the dialog is reloaded.
     */
    Pi.dialog.on("change:dataId", Pi.dialog.reload);

    /**
     * Open the dialog.
     * If the dialog was already loaded, just open it. Otherwise it will set 
     * the new Id and reload data.
     * @param {object or string} data	A list of key:value pairs with the dialog data. Or a string with the dataId value.
     * @param {boolean} forceReload	Whether the data should be reloaded even if already loaded.
     */
    Pi.dialog.open = function(data, forceReload) {
	if (_.isObject(data)) {
	    if (!forceReload && Pi.dialog.get('dataId') === data.dataId
		    && Pi.dialog.get('title') === data.title) {
		Pi.dialogView.open();
	    }
	    else
	    {
		Pi.dialogView.$el.empty();
		Pi.dialog.clear();
		Pi.dialog.set(data);
		//Pi.dialogView.refresh();
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
	var buttons = {
	    'Ok': function() {
		$(this).dialog("close");
	    }
	};
	Pi.dialog.open({
	    'dataId': "alert",
	    'title': title,
	    'content': content,
	    'buttons': buttons
	});
    };

    /**
     * Confirmation dialog.
     * @param {object} options Key:value pairs with dialog data. dataId defaults to "confirmation".
     */
    Pi.confirmation = function(options) {
	// Create the buttons object for jquery ui dialog: http://api.jqueryui.com/dialog/#option-buttons
	var buttons = {
	};

	// Create buttons
	_.each(options.buttons, function(btn) {

	    buttons[btn.label] = function() {
		if (btn.resolve !== undefined && options.promise)
		    btn.resolve ? options.promise.resolve() : options.promise.reject();
//		if (btn.hash !== undefined) 
//		    window.location.hash = btn.hash;
//		if (btn.action !== undefined) 
//		    btn.action();
		$(this).dialog("close");
	    };

	});

	// Always add a cancel button
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
	// Open the dialog and force rerendering
	Pi.dialog.open(dialog, true);
    };

    return Pi;

});
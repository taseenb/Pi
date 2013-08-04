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
     * the new Id, size, title, buttons and load content.
     * @param {object} data A list of key:value pairs with the dialog data.
     * @param {boolean} forceReload Whether data should be reloaded even if already loaded.
     */
    Pi.dialog.open = function(data, forceReload) {
	if (_.isObject(data)) {
	    if (!forceReload && Pi.dialog.get('dataId') === data.dataId
		    && Pi.dialog.get('title') === data.title) {
		Pi.dialogView.open();
	    }
	    else
	    {
		// Unload the modules for the current dialog - IMPORTANT
		if (Pi.dialog.get('require')) {
		    _.each(Pi.dialog.get('require'), function(module) {
			requirejs.undef(module);
		    });
		}
		// Clear the model
		Pi.dialog.clear({
		    silent: true
		});
		// Set new data into the model
		Pi.dialog.set(data, {
		    silent: true
		});
		// Reload the dialog
		Pi.dialog.reload();
		// Refresh view
		Pi.dialogView.refresh();
	    }
	}
    };

    /**
     * Alert dialog.
     * @param {string} title Alert title.
     * @param {string} content Alert message.
     */
    Pi.alert = function(title, content) {
	Pi.dialog.open({
	    'dataId': "alert",
	    'title': title,
	    'content': content,
	    'buttons': {
		'Ok': function() {
		    $(this).dialog("close");
		}
	    }
	});
    };

    /**
     * Confirmation dialog.
     * @param {object} options Key-value pairs with dialog data. dataId defaults to "confirmation".
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
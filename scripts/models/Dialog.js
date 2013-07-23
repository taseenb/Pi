define([
    // Main scripts
    'Pi', 'backbone', 'jquery',
    // Collections
    // Models
    // Views

    // Backbone Extensions
    'Pi/Model'

], function(Pi, Backbone, $) {

    "use strict";

    var Dialog = Backbone.Model.extend({
	defaults: {
	    title: "",
	    content: "",
	    dataId: undefined,
	    width: 480,
	    height: 380,
	    require: undefined
	},
	reload: function() {
	    var dialogData = this.data[this.get('dataId')];
	    var that = this;

	    _.each(dialogData, function(value, key) {
		// if 'path' property is set, make a POST request on that path
		// otherwise just set attribute in the model
		if (_.isObject(value) && value.path)
		{
		    $.when($.post(Pi.basePath + value.path, Pi.csrf))
			    .done(function(data, textStatus, jqXHR) {
			that.set("content", data);
			if (dialogData.require) {
			    require(dialogData.require);
			    //console.log(dialogData.require);
			}
		    })
			    .fail(function(jqXHR, textStatus, errorThrown) {
			//console.log(jqXHR);
			that.set("content", "<strong>" + jqXHR.status + " error</strong><br>" + jqXHR.responseText);
		    });
		}
		else
		{
		    this.set(key, value);
		}
	    }, this);
	},
	/**
	 * Dialogs data.
	 */
	data: {
	    /*
	     * Ask for Delete.
	     */
	    'askForDelete': function() {
		return {
		    title: "Are you sure?",
		    content: function(params, callback) {
			console.log(params);
			var id = params, // params is the project id to be deleted
				name = User.getProjectNameFromId(id),
				html = '<div class="dialog_content">' +
				"<strong>" + name + "</strong><br>" +
				"Are you sure you want to permanently erase this item?" +
				'</div>';
			return html;
		    },
		    action: function(params, callback) {
			var id = params; // params is the project id to be deleted
			Pi.deleteSketch(id, true);
		    },
		    buttons: function(params, callback) {
			var b = {
			    'Delete': function() {
				Dialog.data.askForDelete.action(params, callback);
				$(this).dialog("close");
			    },
			    'Cancel': function() {
				$(this).dialog("close");
			    }
			};
			return b;
		    }
		}
	    },
	    /*
	     * Save As.
	     */
	    'saveAs': {
		title: "Save As...",
		content: function(params) { // params = Ide object 
		    var currentValue = params.name,
			    html = '<div class="dialog_content">' +
			    'Name <input type="text" value="' + currentValue + '" id="saveAsValue">' +
			    '</div>';
		    return html;
		},
		action: function(params, callback) { // params = Ide object 
		    console.log("saveAs");
		    var ide = params,
			    newName = $("#saveAsValue").val(),
			    oldName = ide.name,
			    $tab = ide.$mainTab,
			    tab = ide.mainTab;
		    // Ide.rename(newName, oldName, $tab, tab, main, isNew)
		    ide.rename(newName, oldName, $tab, tab, 1, true);
		},
		buttons: function(params, callback) {
		    var b = {
			'Save': function() {
			    Dialog.data.saveAs.action(params, callback);
			    $(this).dialog("close");
			},
			'Don\'t save': function() {
			    Dialog.data.doNotSave.action(params, callback);
			    $(this).dialog("close");
			},
			'Cancel': function() {
			    $(this).dialog("close");
			}
		    };
		    return b;
		}
	    },
	    /*
	     * Don't save.
	     */
	    'doNotSave': {
		action: function(params, callback) { // params = Ide object 
		    console.log("doNotSave");
		    var ide = params;
		    ide.saved = true;
		    if (callback)
			callback();
		}
	    },
	    /*
	     * Ask for save.
	     */
	    'askForSave': {
		title: "Save?",
		content: function(params) {
		    var html = '<div class="dialog_content">' +
			    'Do you want to save changes before closing?' +
			    '</div>';
		    return html;
		},
		action: function(params, callback) { // params = Ide object 
		    console.log("askForSave");
		    console.log(params);
		    var ide = params,
			    isNew = ide.isNew,
			    id = ide.id;
		    if (isNew) {
			console.log("ide is new");
			Pi.saveAsSketch(id, callback);
		    } else {
			console.log("ide is old");
			Pi.saveSketch(id, isNew, callback);
		    }
		},
		buttons: function(params, callback) {
		    var b = {
			'Save': function(e) {
			    Dialog.data.askForSave.action(params, function() {
				Pi.exitSketch(params.id, true);
			    });
			    $(this).dialog("close");
			},
			'Don\'t save': function() {
			    Dialog.data.doNotSave.action(params, function() {
				Pi.exitSketch(params.id, true);
			    });
			    $(this).dialog("close");
			},
			'Cancel': function() {
			    $(this).dialog("close");
			}
		    };
		    return b;
		}
	    },
	    /*
	     * Alert.
	     */
	    'alert': {
		width: 360,
		height: 180
	    },
	    /**
	     * Confirmation.
	     */
	    'confirmation': {
		width: 420,
		height: 240
	    },
	    /*
	     * Log In dialog.
	     */
	    'log-in': {
		width: 480,
		height: 380,
		title: "Log In",
		require: ["login-form"],
		content: {
		    path: '/user/login/'
		}
	    },
	    /*
	     * Sign Up dialog.
	     */
	    'sign-up': {
		width: 480,
		height: 380,
		title: "Sign Up",
		require: ["signup-form", "validation-plugin"],
		content: {
		    path: '/user/signup/'
		}
	    },
	    /*
	     * Recovery dialog.
	     */
	    'password-recovery': {
		width: 480,
		height: 320,
		title: "Password Recovery",
		require: ["recovery-form"],
		content: {
		    path: '/user/recovery/'
		}
	    },
	    /*
	     * Activation Resend Email dialog.
	     */
	    'activation-resend-email': {
		width: 480,
		height: 380,
		title: "Resend Activation Email",
		content: {
		    path: Pi.basePath + '/user/activation/resendemail'
		}
	    }
	}
    });

    return Dialog;

});
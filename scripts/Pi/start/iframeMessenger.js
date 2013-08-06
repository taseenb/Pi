define([
    // Main scripts
    'Pi', 'jquery',
	    // Collections
	    // Models
	    // Views
], function(Pi, $) {

    /**
     * Send messages received from the iframe player (run.processingideas.com)
     * to the related Ide View (identified by projectId).
     * @param {object} e Message event object.
     */
    var messenger = function(e) {
	var data = window.JSON.parse(e.data);
	var outputView = getOutputView(data.pid);
	if (outputView) {
	    if (data.ready) {
		outputView.iframeReady = true;
		outputView.iframeSendCode();
	    } else if (data.width && data.height) {
		outputView.iframeSize(data.width, data.height);
	    }
	}
    }
    
    /**
     * Get the Ide view the message is related.
     * @param {string} id Project id received from the iframe.
     */
    var getOutputView = function(id) {
	var project = Pi.user.get('projects').get(id);
	if (project && project.outputView)
	    return project.outputView;
    }

    /**
     * Message event listener.
     */
    window.addEventListener("message", messenger, false);
});
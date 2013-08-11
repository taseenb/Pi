define([
    // Main scripts
    'Pi', 'jquery',
    // Gui
    'Pi/gui/Spinner'

], function(Pi, $, Spinner) {

    // Create a new spinner animation for Ajax calls (pass a canvas id)
    var spinner = new Spinner("ajax-spinner");

    /**
     * Global event handlers.
     */
    $(document)
	    .on('click', '.new', function(e) {
	e.preventDefault();
	e.stopPropagation();
	require(['controllers/ProjectController'], function(ProjectController) {
	    ProjectController.new(Pi.user.getId());
	});
    })
	    .ajaxStart(function(e) {
	spinner.show();
    })
	    .ajaxStop(function() {
	spinner.hide();
    })
	    .ajaxSend(function(e) {
	Pi.lastAjax = e.timeStamp;
	Pi.ajax = true;
    })
	    .ajaxComplete(function(e) {
	Pi.ajax = false;
    })

	    // Ctrl+S or Cmd+S save the active sketch.
	    .keypress(function(e) {
	// Ascii codes: 115 => s // 83 => S // 19 => control
	if ((e.which === 115 || e.which === 83) && ((e.ctrlKey || e.metaKey) || e.which === 19)) {
	    e.preventDefault();
	    if (Pi.user.isGuest())
		window.location.hash = "#log-in";
	    else {
		var activeProject = Pi.user.get('projects').getFirst();
		if (activeProject)
		    activeProject.saveSketch();
	    }
	}
    });

});
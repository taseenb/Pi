<div class="code_wrapper">
    <div id="code<?php echo $tab->id ?>" class="code"></div>
</div>

<script>

    domready(function() {

	var codeId = "code<?php echo $tab->id ?>",
		isMain = <?php echo $tab->main ? "true" : "false" ?>,
		code = "<?php echo str_replace("\n", "\\n\\\n", $tab->code); ?>";

	/**
	 * Setup Ace editor for the Processing language.
	 */
	var editor = ace.edit(codeId);
	editor.getSession().setMode("ace/mode/java");
	editor.setTheme("ace/theme/chrome");
	editor.setValue(code);
	editor.container.style.fontSize = '13px';
	editor.renderer.setShowGutter(false);
	editor.setHighlightActiveLine(false);
	editor.setShowPrintMargin(false);
	editor.renderer.setHScrollBarAlwaysVisible(true);
	editor.clearSelection();
	editor.gotoLine(0);
//    if (isMain)
//	editor = focus();

	// IMPORTANT! Uncomment the following line to resolve a problem when 
	// using the ace.js file without the CDN):
	// editor.getSession().setUseWorker(false);

	/**
	 * Ace editor = events.
	 */
	editor.getSession().on('change', function(e) {
//	    console.log('t');

//	that.model.set('code', that.editor.getValue());
//	that.model.set('saved', false);
//	if (project.get('liveCode'))
//	    project.set('codeIsNew', true);
	});
	editor.getSession().selection.on('changeCursor', function(e) {
//	    console.log(editor.selection.getCursor()["row"] + 1);
//	$ideView.find('.status')
//		.text(that.editor.selection.getCursor()["row"] + 1);
	});


    });
</script>
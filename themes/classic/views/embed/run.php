<div class="fullscreen">
    <div class="canvas_wrapper">
	<canvas id="pi"></canvas>
    </div>
</div>
<script>
    try
    {
	var c = "<?php echo str_replace("\n", "\\n\\\n", $code); ?>";
	var s = Processing.compile(c);
	var pjs = new Processing('pi', s);
    }
    catch (e)
    {
	console.log(e);
    }
    if (window.top === window.self)
    {
	console.log('not embedded');
    }
    else
    {
	console.log('that one is embedded');
    }
</script>
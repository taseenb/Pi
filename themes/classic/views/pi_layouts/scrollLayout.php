<?php
$t = theme();
?>
<!DOCTYPE html>
<html>
    <head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript" src="<?php echo $t; ?>/js/lib/jquery/jquery-2.0.2.min.js"></script>
	<script type="text/javascript" src="<?php echo $t; ?>/js/lib/jquery-ui/jquery-ui-1.10.3.custom.min.js"></script>
	<style>
	    
	    body {
		width: 100%;
		height: 100%;
		position:absolute;
		min-height:100%;
		min-width:100%;
		max-height:100%;
		max-width:100%;
		padding:0;
		margin:0;
		top: 0;
		left: 0;
	    }
	    
	    .viewport {
		position:absolute;
		top:0;
		bottom:0;
		right:0;
		left:0;
		width:100%;
		height:100%;
		overflow: hidden;
	    }
	    
	    .desktop {
		width: 200%;
		height: 200%;
		background: transparent url('<?php echo $t; ?>/img/background/bg_00.png') center repeat;
	    }
	    
	    .icon {
		position:absolute;
		top: 150px;
		left: 150px;
		background: #0073ea;
		border: 3px solid #FFF;
		width: 100px;
		height: 100px;
	    }
	    
	</style>

	<script>
	    window.desktop;

	    
	    $(function() {
		
		var element = $('.viewport').viewport({
		    content: $('#desktop')
		});
		var content = element.viewport('content');
		content.draggable({
		    containment: 'parent',
		    position: 'top left'
		});

	    });
	</script>
	
    </head>
    <body>
	
	<div class="viewport">
	    <!--<div class="desktop_container">-->
	    <div id="desktop" class="desktop">
		<div class="icon"></div>
		<?php echo $content; ?>
	    </div>
	    <!--</div>-->
	</div>
	
	
	
	
	<script>
	
/*    
    jQuery.Viewport 0.2.1
    
    Makes an element as a handy viewport for displaying content
    with absolute position. For all details and documentation:
    http://borbit.github.com/jquery.viewport/
    
    Copyright (c) 2011-2012 Serge Borbit <serge.borbit@gmail.com>
    
    Licensed under the MIT license
*/
(function($) {

$.widget('ui.viewport', {
    options:{
        binderClass: 'viewportBinder'
      , contentClass: 'viewportContent'
      , position: 'center'
      , content: false
      , height: false
      , width: false
    },

    _create: function() {
        var content = this.options.content;

        if (content.tagName != null || $.isArray(content)) {
            this.options.content = $(content);
        }

        this.viewport = createViewport(this.element, this.options);
        this.viewport.adjust();
    },

    update: function() {
        this.viewport.updateContentSize();
        this.viewport.adjust();
    },
    
    adjust: function() {
        this.viewport.adjust();
    },
    
    content: function() {
        return this.viewport.content;
    },
    
    binder: function() {
        return this.viewport.binder;
    },

    size: function(height, width) {
        if (height == null || width == null) {
            return this.viewport.contentSize;
        }
        this.viewport.setContentHeight(height);
        this.viewport.setContentWidth(width);
    },

    height: function(height) {
        if (height == null) {
            return this.viewport.contentSize.height;
        }
        this.viewport.setContentHeight(height);
    },

    width: function(width) {
        if (width == null) {
            return this.viewport.contentSize.width;
        }
        this.viewport.setContentWidth(width);
    }
});

var BINDER_CSS = {position: 'absolute', overflow: 'hidden'}
  , ELEMENT_CSS = {position: 'relative', overflow: 'hidden'}
  , CONTENT_CSS = {position: 'absolute'};

function createViewport(element, options) {
    var contentPosition = {top: 0, left: 0}
      , viewportSize = {height: 0, width: 0}
      , contentSize = {height: 0, width: 0}
      , centerH = true
      , centerV = true
      , diffH = 0
      , diffW = 0;
    
    var binder = $('<div/>').addClass(options.binderClass);
    var content = $('<div/>').addClass(options.contentClass);

    element.css(ELEMENT_CSS);
    content.css(CONTENT_CSS);
    binder.css(BINDER_CSS);

    var contents = false;
    if (!options.content && element.children().length) {
        contents = element.children();
    } else if (options.content) {
        contents = options.content;
    }
    
    updateContentSize();
    updateContentPosition();
    
    if (contents) {
        contents.detach();
        content.append(contents);
    }
    
    binder.append(content).appendTo(element);

    element.bind('dragstop', function(event, ui) {
        if (contentPosition.top != ui.position.top) {
            centerH = false;
        }
        if (contentPosition.left != ui.position.left) {
            centerV = false;
        }
        contentPosition.left = ui.position.left;
        contentPosition.top = ui.position.top;
    });

    function updateContentPosition() {
        var position = options.position.split(' ');

        if (~position.indexOf('bottom')) {
            centerV = false;
            contentPosition.top = viewportSize.height - contentSize.height;
        } else if (~position.indexOf('top')) {
            centerV = false;
            contentPosition.top = 0;
        }

        if (~position.indexOf('right')) {
            centerH = false;
            contentPosition.left = viewportSize.width - contentSize.width;
        } else if (~position.indexOf('left')) {
            centerH = false;
            contentPosition.left = 0;
        }
    }

    function updateContentSize() {
        if (options.width !== false && options.height !== false) {
            content.height(options.height);
            content.width(options.width);
        } else if (contents !== false) {
            content.height(contents.height());
            content.width(contents.width());
        }

        contentSize.height = content.height();
        contentSize.width = content.width();
    }

    var floor = Math.floor;
    
    function adjust() {
        viewportSize.height = element.height();
        viewportSize.width = element.width();

        var diff, newTop, newLeft;

        if (viewportSize.height > contentSize.height) {
            content.css('top', 0);
            binder.css('height', contentSize.height);
            binder.css('top', floor(viewportSize.height / 2) -
                              floor(contentSize.height / 2));
        } else {
            diff = contentSize.height - viewportSize.height;
            binder.css('height', viewportSize.height + diff * 2);
            binder.css('top', -diff);

            if (centerV) {
                contentPosition.top = floor(diff / 2);
                content.css('top', contentPosition.top);
            } else {
                newTop = contentPosition.top + (diff - diffH);
                newTop >= 0 || (newTop = 0);
                contentPosition.top = newTop;
                content.css('top', newTop);
            }
            diffH = diff;
        }

        if (viewportSize.width > contentSize.width) {
            content.css('left', 0);
            binder.css('width', contentSize.width);
            binder.css('left', floor(viewportSize.width / 2) -
                               floor(contentSize.width / 2));
        } else {
            diff = contentSize.width - viewportSize.width;
            binder.css('width', viewportSize.width + diff * 2);
            binder.css('left', -diff);

            if (centerH) {
                contentPosition.left = floor(diff / 2);
                content.css('left', contentPosition.left);
            } else {
                newLeft = contentPosition.left + (diff - diffW);
                newLeft >= 0 || (newLeft = 0);
                contentPosition.left = newLeft;
                content.css('left', newLeft);
            }
            diffW = diff;
        }
    }

    function setContentHeight(height) {
        contentSize.height = height;
        content.height(height);
    }

    function setContentWidth(width) {
        contentSize.width = width;
        content.width(width);
    }

    return {
        adjust: adjust
      , updateContentSize: updateContentSize
      , setContentHeight: setContentHeight
      , setContentWidth: setContentWidth
      , contentSize: contentSize
      , content: content
      , binder: binder
    };
}

})(jQuery);



	    
	</script>
    </body>
</html>

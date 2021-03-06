define([
  // Main scripts
  'Pi',
  'backbone',
  'jquery',
  // Templates
  'text!tpl/Project/Output.html',
  // Backbone add-ons
  'Pi/start/startDataBinding',
  // Plugins
  'jquery-ui',
  'jquery-easing',
  // Start
  'Pi/start/iframeMessenger'
], function (Pi, Backbone, $, OutputHtml) {
  'use strict'

  var OutputView = Backbone.Epoxy.View.extend({
    /**
     * Init view.
     */
    initialize: function () {
      this.listenTo(this.model, 'change:zIndex', function () {
        this.$el.css('z-index', this.model.get('zIndex') + 1)
      })
      this.listenTo(this.model, 'change:ouputPosition', this.positionState)
      this.listenTo(this.model, 'change:fullScreen', this.fullScreenState)

      this.$el.html(OutputHtml).attr({
        'data-e-bind': 'active:active,front:front'
      })
      //var sandbox = Pi.basePath + "/scripts/views/Project/OutputSandbox.html";
      var sandbox = Pi.sandbox
      var iframeUrl =
        sandbox + '/?uid=' + this.model.getUid() + '&pid=' + this.model.getId()

      // console.log(sandbox, iframeUrl)
      this.$iframe().prop('src', iframeUrl)

      // Render view
      this.render()
    },
    /**
     * Data binding.
     */
    bindings: 'data-e-bind',
    bindingHandlers: _.extend(Pi.bindingHandlers, {}),
    className: 'output',
    events: {
      'dragstop ': function (event, ui) {
        this.model.set({
          ouputPosition: {
            top: ui.position.top,
            left: ui.position.left
          }
        })
      },
      'mousedown.active': function (e) {
        e.stopPropagation()
        this.model.set({
          active: true
        })
      },
      'click .stop': function (e) {
        this.model.set('fullScreen', false)
        Pi.router.navigate('/art')
        this.model.stopSketch({
          liveCode: false,
          hide: true
        })
      },
      'click .play, .pause': function (e) {
        this.togglePause()
      },
      'click .fs': function (e) {
        this.model.set('fullScreen', !this.model.get('fullScreen')) // toggle fullScreen on/off
      },
      'click .picture': function (e) {
        this.takePicture()
      }
    },
    /**
     * Render view.
     */
    render: function () {
      this.hide()
      this.$el
        .addClass('win active front no_select')
        .css({
          top: this.model.get('top'),
          zIndex: this.model.get('zIndex') + 1
        })
        .appendTo(Pi.user.currentDesktop.$el)
        .draggable({
          handle: '.title'
        })
      return this
    },
    /**
     * Show/hide this output window.
     */
    show: function () {
      this.$el.css('visibility', 'visible')
      //this.$el.show();
    },
    hide: function () {
      this.$el.css('visibility', 'hidden')
      //this.$el.hide();
    },
    /**
     * Iframe helper selectors.
     */
    $iframe: function () {
      return this.$el.find('iframe')
    },
    iframeWindow: function () {
      return this.$iframe()[0].contentWindow
    },
    iframeDocument: function () {
      return this.$iframe()[0].contentDocument
    },
    /**
     * Communications with the iframe: send processing code to the iframe.
     */
    iframeSendCode: function () {
      var that = this
      var uid = this.model.getUid() // unique Id (needed for play and pause)
      var code = that.model.getCode(uid)
      var pid = that.model.getId() // project Id

      this.iframeWindow().postMessage(
        window.JSON.stringify({
          code: code,
          uid: uid,
          pid: pid
        }),
        '*'
      )
      this.model.set({
        running: true,
        isPaused: false
      })
    },
    /**
     * Communications with the iframe: get the iframe size.
     */
    iframeSize: function (w, h) {
      if (this.originalWidth != w || this.originalHeight != h) {
        this.originalWidth = w
        this.originalHeight = h
        this.setSize(w, h)
        this.position()
        this.adjustSize()
      }
      this.show()
    },
    /**
     * Update position of the window.
     */
    positionState: function () {
      var that = this
      this.$el.css({
        top: that.model.get('ouputPosition').top,
        left: that.model.get('ouputPosition').left
      })
    },
    /**
     * Position the output window in the center of the screen.
     */
    position: function () {
      var w = this.$el.width(),
        h = this.$el.height(),
        titlebarHeight = this.$el.find('.title').outerHeight(true)
      this.model.set({
        ouputPosition: {
          left: window.innerWidth / 2 - w / 2,
          top: window.innerHeight / 2 - h / 2 - titlebarHeight / 2
        }
      })
    },
    /**
     * Check fullscreen state and toggles fullscreen mode on/off.
     */
    fullScreenState: function () {
      if (this.model.get('fullScreen')) {
        this.enterFullScreen()
        Pi.router.navigate(
          Pi.action.openProject + '/' + this.model.getId() + '/fs'
        )
      } else {
        this.exitFullScreen()
        Pi.router.navigate(
          Pi.action.openProject + '/' + this.model.getId() + '/play'
        )
      }
    },
    /**
     * Exit full screen.
     */
    exitFullScreen: function () {
      var that = this
      this.adjustSize()
      Pi.user.nav.show(that, function (output) {
        output.$el.removeClass('fullscreen')
        output.positionState()
        $('#forkongithub').show()
      })
    },
    /**
     * Enter full screen.
     */
    enterFullScreen: function () {
      var that = this
      this.adjustSize()
      Pi.user.nav.hide(that, function (output) {
        output.$el.css({
          zIndex: 111,
          top: 0,
          left: 0
        })
        output.$el.addClass('fullscreen')
        $('#forkongithub').hide()
      })
    },
    /**
     * Take a picture of the current frame.
     */
    takePicture: function () {
      this.iframeWindow().postMessage(
        JSON.stringify({
          takePicture: true,
          pid: this.model.getId()
        }),
        '*'
      )
    },
    /**
     * Append a picture coming from the iframe to the pictures container.
     * @param {object} image Image taken from canvas (within the iframe).
     */
    appendPicture: function (imageSrc) {
      var picturesContainer = this.$el.find('.pictures_container'),
        image = new Image()
      image.src = imageSrc
      if (picturesContainer.find('img').size() >= 5) {
        picturesContainer
          .find('img:eq(-4)')
          .prevAll()
          .remove()
      }
      picturesContainer.append(image)
    },
    /**
     * Calculate the max canvas width, based on window width.
     */
    maxIframeWidth: function () {
      var maxW = 62.5 // percent of the desktop width
      return Math.floor((Pi.desktopView.$el.width() * maxW) / 100)
    },
    /**
     * Calculate the max canvas height, based on window height.
     */
    maxIframeHeight: function () {
      var maxH = 85 // percent of the desktop height
      return (Pi.desktopView.$el.height() * maxH) / 100
    },
    /**
     * Set the size of the iframe part of the window.
     * @param {type} w Width of the iframe_wrapper.
     * @param {type} h Height of the iframe_wrapper.
     */
    setSize: function (w, h) {
      this.$el.find('.iframe_wrapper').css({
        width: w,
        height: h
      })
    },
    /**
     * Adjust size of the output window, if it is too large for the screen.
     */
    adjustSize: function () {
      var w = this.originalWidth,
        h = this.originalHeight
      if (!this.fullScreen) {
        this.reduceToMaxSize(w, h)
        if (w > this.maxIframeWidth() || h > this.maxIframeHeight()) {
          this.model.set('outputResized', true)
        }
      } else {
        if (this.model.get('outputResized')) {
          this.setSize(w, h)
          this.model.set('outputResized', false)
        }
      }
    },
    /**
     * Reduce width and height to fit the screen (recursive).
     * @param {number} w Sketch width.
     * @param {number} h Sketch height.
     */
    reduceToMaxSize: function (w, h) {
      var maxW = this.maxIframeWidth(),
        maxH = this.maxIframeHeight(),
        newW = w,
        newH = h,
        changed = false
      if (w > maxW) {
        //console.log('too wide');
        newW = maxW
        newH = h * (maxW / w)
        changed = true
      } else if (h > maxH) {
        //console.log('too high');
        newW = w * (maxH / h)
        newH = maxH
        changed = true
      } else if (w === h && w > maxW) {
        //console.log('too wide and high');
        newW = maxW
        newH = maxH
        changed = true
      } else {
        //console.log("finally perfect: " + Math.floor(newW) + "x" + Math.floor(newH));
        changed = false
      }
      // If changed, check the size again (recursive).
      // If not changed, check if the current width and height have changed
      // from their original value and apply the change if this is the case.
      if (changed) {
        //console.log("changed! let's check again");
        this.reduceToMaxSize(newW, newH)
      } else if (newW !== this.originalWidth || newH !== this.originalHeight) {
        this.setSize(~~newW, ~~newH)
      }
    },
    /**
     * Toggle pause/play.
     */
    togglePause: function () {
      if (this.model.get('isPaused')) {
        this.model.set('isPaused', false)
        this.iframeWindow().postMessage(
          JSON.stringify({
            unPause: true,
            pid: this.model.getId()
          }),
          '*'
        )
      } else {
        this.model.set('isPaused', true)
        this.iframeWindow().postMessage(
          JSON.stringify({
            pause: true,
            pid: this.model.getId()
          }),
          '*'
        )
      }
    }
  })

  return OutputView
})

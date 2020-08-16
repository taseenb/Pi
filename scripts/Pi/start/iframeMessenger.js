define([
  // Main scripts
  'Pi',
  'jquery'
  // Collections
  // Models
  // Views
], function (Pi, $) {
  // Helper to validate object
  function isObject (o) {
    return (
      null != o &&
      typeof o === 'object' &&
      Object.prototype.toString.call(o) === '[object Object]'
    )
  }

  /**
   * Send messages received from the iframe player (run.pi.taseenb.com)
   * to the related Ide View (identified by projectId).
   * @param {object} e Message event object.
   */
  var messenger = function (e) {
    // console.log(e)

    var data = isObject(e.data) ? e.data : window.JSON.parse(e.data)
    var outputView = getOutputView(data.pid)

    // console.log(data)

    if (outputView) {
      if (data.ready) {
        outputView.iframeReady = true
        outputView.iframeSendCode()
      } else if (data.width && data.height) {
        outputView.iframeSize(data.width, data.height)
      } else if (data.imageSrc) {
        outputView.appendPicture(data.imageSrc)
      }
    }
  }

  /**
   * Get the Ide view the message is related.
   * @param {string} id Project id received from the iframe.
   */
  var getOutputView = function (id) {
    var project = Pi.user.get('projects').get(id)
    if (project && project.outputView) return project.outputView
  }

  /**
   * Message event listener.
   */
  window.addEventListener('message', messenger, false)
})

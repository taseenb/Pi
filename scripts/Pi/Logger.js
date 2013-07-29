define([
    'Pi','processing'
    
], function(Pi, Processing) {

    "use strict";

    Pi.logger = {
	/**
	 * List of Ide instances.
	 */
	ide: [],
	/**
	 * Log a message in the ide console.
	 * @param {string} message The message to log.
	 * @param {string} canvas The canvas Id of the output. Used to find the related Ide and its console. Set undefined if not available.
	 * @param {boolean} inline Whether the message should be appended inline (for print() method).
	 * @param {jqeury} $console The jQuery object of the console.
	 * @returns {Boolean} True if successfully logged in the console. False if console could not be found.
	 */
	log: function(message, canvas, inline, $console) {
	    if (canvas)
	    {
		var ide = this.ide[canvas];
		var $console = ide.view.$console;
	    }
	    else
	    {
		// @TODO - SOLUTION NOT FOUND YET FOR print and println in setup()
		// Canvas id not yet defined in void setup()
		// Log messages before draw() are lost
		//console.log(message);
		return false;
	    }

	    // Clean console and append message
	    var p = $console.find('p, i');
	    var elements = p.length;
	    if (!ide.get('consoleOpen'))
		ide.set('consoleOpen', true);
	    if (elements > Pi.maxConsoleLogs) {
		p.slice(0, elements - Pi.maxConsoleLogs).remove();
	    }
	    //$console.append("<p>" + (new Date()).toLocaleTimeString() + " > " + message + "</p>");
	    if (inline) {
		$console.append("<i>" + message + "</i>");
		$console[0].scrollLeft = $console[0].scrollWidth;
		$console[0].scrollTop = $console[0].scrollHeight;
		return true;
	    }
	    else
	    {
		$console.append("<p>" + message + "</p>");
		$console[0].scrollTop = $console[0].scrollHeight;
		return true;
	    }
	}
    };


    /**
     * Override Processing.logger 
     * and add an array to store ide models related to Processing instances
     */
    Processing.logger = Pi.logger;
    Processing.logger.ide = [];
    
    return Pi;

});
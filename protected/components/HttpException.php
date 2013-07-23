<?php

class HttpException extends CHttpException {

    /**
     * Constructor.
     * @param integer $status HTTP status code, such as 404, 500, etc.
     * @param string $message error message
     * @param integer $code error code
     */
    public function __construct($status, $message = null, $code = 0) {
	
	// Default error messages
	switch ($status) {
	    case 400:
		if (!$message) $message = "Bad Request. Please do not repeat this request again.";
		break;
	    case 401:
		if (!$message) $message = "Unauthorized. Access is denied due to invalid credentials.";
		break;
	    case 403:
		if (!$message) $message = "Forbidden. Access is denied.";
		break;
	    case 404:
		if (!$message) $message = "The requested URL " . $_SERVER['REQUEST_URI'] . " was not found.";
		break;
	    case 500:
		if (!$message) $message = "Server error. Please try again later.";
		break;

	    default:
		break;
	}
	
	// Call parent CHttpException
	parent::__construct($status, $message, $code);
    }

}
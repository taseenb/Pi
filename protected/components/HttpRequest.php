<?php


class HttpRequest extends CHttpRequest
{

    private $_csrfToken;

    private $_restParams;

    public function getCsrfToken()
    {
	if ($this->_csrfToken === null)
	{
	    $session = Yii::app()->session;
	    $csrfToken = $session->itemAt($this->csrfTokenName);
	    if ($csrfToken === null)
	    {
		$csrfToken = sha1(uniqid(mt_rand(), true));
		$session->add($this->csrfTokenName, $csrfToken);
	    }
	    $this->_csrfToken = $csrfToken;
	}
	return $this->_csrfToken;
    }

    /**
     * CSRF token validation with sessions. 
     * Supports POST, PUT, PATCH, DELETE http methods and also allow JSON to be validated.
     * @param type $event
     * @throws CHttpException If the user token is not valid.
     */
    public function validateCsrfToken($event)
    {
	if ($this->getIsPostRequest() ||
		$this->getIsPutRequest() ||
		$this->getIsDeleteRequest() ||
		$this->requestType == "PATCH"
	)
	{
	    $userToken = "";
	    $session = Yii::app()->session;
	    $tokenFromSession = $session->itemAt($this->csrfTokenName);
	    $method = $this->getRequestType();
	    switch ($method)
	    {
		case 'POST':
		    $userToken = $this->getPost($this->csrfTokenName);
		    break;
		case 'DELETE':
		    $userToken = $this->getDelete($this->csrfTokenName);
		    break;
	    }

	    // Is it Json?
	    if (!$userToken)
	    {
		$json = CJSON::decode($this->rawBody);
		$userToken = $json[$this->csrfTokenName];
	    }

	    //CVarDumper::dump($json);
	    Yii::log("Method: " . $this->getRequestType(), "warning");
	    Yii::log("User token: " . $userToken, "warning");
	    Yii::log("Session token: " . $tokenFromSession, "warning");
//	    
	    // Check if the token in the request is equal to the token stored in the session
	    if ($session->contains($this->csrfTokenName) && !empty($userToken))
		$valid = $tokenFromSession === $userToken;
	    else
		$valid = false;
	    if (!$valid)
		throw new CHttpException(400, Yii::t('yii', 'The CSRF token could not be verified.'));
	}
    }

    /**
     * Returns whether this is a PATCH request.
     * @return boolean whether this is a PATCH request.
     * @since 
     */
    public function getIsPatchRequest()
    {
	return (isset($_SERVER['REQUEST_METHOD']) && !strcasecmp($_SERVER['REQUEST_METHOD'], 'PATCH'));
    }

    /**
     * Returns the named PATCH parameter value.
     * If the PATCH parameter is null and input is Json, an array with all the parameters will be returned.
     * If the PATCH parameter is null and input is not Json, the raw body will be returned.
     * If the PATCH parameter does not exist or if the current request is not a PATCH request,
     * the second parameter to this method will be returned.
     * @param string $name the PATCH parameter name
     * @param mixed $defaultValue the default parameter value if the PATCH parameter does not exist and the PATCH array is empty.
     * @return mixed the PATCH parameter value
     * @since
     */
    public function getPatch($name = null, $defaultValue = null)
    {
	if ($this->isPatchRequest)
	{
	    // Json validation?
	    $json = CJSON::decode($this->rawBody);
	    if ($json)
	    {
		if (isset($name) && isset($json[$name]))
		    return $json[$name];
		else
		    return $json;
	    }
	    else
		return $this->rawBody;
	}
	else
	    return $defaultValue;
    }

}
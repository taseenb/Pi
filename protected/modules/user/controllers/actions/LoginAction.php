<?php


class LoginAction extends CAction
{

    /**
     * Display and validate the login form.
     */
    public function run()
    {
	if (Yii::app()->user->isGuest)
	{
	    $controller = $this->getController();

	    $defender = new Defender();
	    if (!$defender->isSafeIp())
	    {
		exit(); //throw new HttpException(403, "Forbidden. Locked ip.");
	    }

	    if (request()->isPostRequest && request()->isAjaxRequest)
	    {
		$form = new LoginForm;

		// Add captcha after 3 failed logins (4th try)
		if ($defender->failedLogins >= $defender->maxLoginsBeforeCaptcha)
		    $form->captcha = true;

		if (isset($_POST['LoginForm']))
		{
		    $form->attributes = $_POST['LoginForm'];
		    if ($form->validate())
		    {
			$this->_saveLastVisit();
			$defender->removeFailedLogins();

			// Get user bootstrap data (array)
			$bootstrap = Pi::getUserBootstrap(false);
			$bootstrap['errors'] = false;
			$bootstrap['message'] = "<strong>Logged in.</strong> Loading...";

			header('Content-type: application/json');
			echo CJSON::encode($bootstrap);
			// *** USER IS NOW LOGGED IN ***
		    }
		    else
		    {
			if ($defender->failedLogins > 3)
			    sleep($defender->failedLogins);
			$defender->recordFailedLogin();

			header('Content-type: application/json');
			echo CJSON::encode(array(
			    'captcha' => $form->captcha,
			    'errors' => true,
			    'errorMessage' => $this->_getErrorsString($form->getErrors()),
			    'captcha' => $form->captcha,
			    'leftLogins' => $defender->failedLoginsAllowed - $defender->failedLogins
			));
			//throw new HttpException(401, $error);
		    }
		}
		else
		{
		    $controller->renderPartial(
			    '/user/_login', array('model' => $form), false, true
		    );
		}
	    }
	    else
	    {
		throw new HttpException(400);
	    }
	}
	else
	{
	    header('Content-type: application/json');
	    echo CJSON::encode(array("message" => "Already logged in."));
	}
    }

    /**
     * Get a string from an array of validation errors.
     */
    private function _getErrorsString($array)
    {
	$errors = "";
	foreach ($array as $key => $errorsList)
	{
	    foreach ($errorsList as $value)
	    {
		$errors .= $value;
	    }
	}
	return $errors;
    }

    /**
     * Save the time of the successful login.
     */
    private function _saveLastVisit()
    {
	$user = User::model()->notsafe()->findByPk(Yii::app()->user->id);
	$user->lastvisit_at = time();
	$user->save();
    }

}
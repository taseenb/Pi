<?php


class SignupAction extends CAction
{

    /**
     * User registration.
     */
    public function run()
    {
	$controller = $this->getController();
	
	$user = new SignupForm; // Create a new User (SignupForm extends from User)
	$profile = new Profile; // Create a new Profile for the user
	$profile->regMode = true;
	
	$defender = new Defender();
	if (!$defender->isSafeIp()) {
	    exit();
	    //throw new HttpException(403, "Forbidden. Locked ip.");
	}

	// Make sure it is ajax
	if (request()->isPostRequest && request()->isAjaxRequest)
	{
	    // Ajax validator (without submit)
	    if (isset($_POST['SignupFormStep']) && $_POST['SignupFormStep'] === 'one')
	    {
		echo CActiveForm::validate(array($user, $profile));
		Yii::app()->end();
	    }

	    // Submit
	    if (isset($_POST['SignupForm']))
	    {
		// Get User and Profile attributes
		$user->attributes = $_POST['SignupForm'];
		$profile->attributes = isset($_POST['Profile']) ? $_POST['Profile'] : array();

		if ($user->validate() && $profile->validate())
		{
		    //VALIDATED
		    $this->_register($user, $profile);
		}
		else
		{
		    //NOT VALIDATED
		    echo CActiveForm::validate(array($user, $profile));
		}
		Yii::app()->end();
	    }

	    // Display registration form
	    $controller->renderPartial(
		    '/user/_signup', array('model' => $user, 'profile' => $profile), false, true // whether the rendering result should be postprocessed using processOutput
	    );
	}
	else
	    throw new HttpException(400);
    }

    /**
     * Create a new user in the db and send activation mail if necessary (without validation).
     */
    protected function _register($user, $profile)
    {
	$user->activkey = UserModule::encrypting(microtime() . $user->password);
	$user->password = UserModule::encrypting($user->password);
	$user->verifyPassword = UserModule::encrypting($user->verifyPassword);
	$user->superuser = 0;
	$user->status = User::UNACTIVE;
	// Create a username shuffling the characters of the email before @
	$user->username = Helper::removeSpecialChars(str_shuffle(current(explode("@", $user->email))));

	// Save new User
	// Do not validate, since it was already validated: 
	// that also solves a problem with captcha double validation count
	if ($user->save(false))
	{
	    // Create default User Collection // COLLECTIONS ARE NOT USED ANYMORE IN PI!
	    //$user->default_collection = $user->createDefaultCollection();
	    //$user->save(false, array("default_collection"));
	    
	    // Create user public folder
	    $path = Yii::getPathOfAlias('webroot') . DS . Yii::app()->params['publicDirName'] . DS;
	    Yii::log('Created directory: ' . $path, 'warning');
	    F::makeWritableDir($path . $user->id);

	    // Save Profile
	    $profile->user_id = $user->id;
	    $profile->save();

	    // Send activation mail
	    $user->sendActivationMail($user->activkey);

	    // Send success message in json.
	    $successMessage = "<p><strong>You are almost done!</strong><br>
		Please check your email and activate your account.</p>
		<div class='alert alert-info'>A message was sent to <strong>{{email}}</strong></div>";
	    $message = array(
		'status' => 'success',
		'message' => UserModule::t($successMessage, array("{{email}}" => $user->email))
	    );
	    header('Content-type: application/json');
	    echo CJSON::encode($message);
	}
	else
	{
	    throw new HttpException(500, 'Server error. Could not save user data.');
	}
    }

}
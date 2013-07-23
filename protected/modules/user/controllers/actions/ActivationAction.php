<?php


/**
 * Final step of sign up process.
 * Activate the user by checking email and activation key.
 */
class ActivationAction extends CAction
{

    /**
     * Current controller.
     * @var type 
     */
    private $_controller;

    /**
     * Get activation key and email from the activation url.
     * $_GET['key'] is the Activation Key
     * $_GET['l'] is the Local part of the Email
     * $_GET['d'] is the Domain part of the Email
     */
    public function run()
    {
	$this->_controller = $this->getController(); // get SignupController
	$this->_controller->layout = '//pi_layouts/neutral';

	if (isset($_GET['key']) && isset($_GET['l']) && isset($_GET['d']))
	{
	    $email = strip_tags($_GET['l'] . "@" . $_GET['d']);
	    $key = $_GET['key'];

	    if (filter_var($email, FILTER_VALIDATE_EMAIL))
		$user = User::model()->notsafe()->findByAttributes(array('email' => $email));

	    $this->_tryToActivate($user, $key);
	}
	else
	    throw new HttpException(400); // bad request - parameters missing
    }

    /**
     * Try to activate the user, if it exists.
     * @throws HttpException Server Error if activation data is valid but the user cannot be saved on the db.
     */
    private function _tryToActivate($user, $key)
    {
	if (isset($user) && $user->status == User::ACTIVE)
	{
	    // Account is already active
	    $this->_controller->render(
		    '/user/message', array(
		'title' => UserModule::t("User activation"),
		'content' => UserModule::t("Your account is already active.")
		    )
	    );
	}
	elseif (isset($user->activkey) && $user->activkey == $key && $user->status == User::UNACTIVE)
	{
	    // Activate account
	    $user->activkey = UserModule::encrypting(microtime());
	    $user->status = User::ACTIVE;
	    if ($user->save())
	    {
		$this->_controller->render(
			'/user/message', array(
		    'title' => UserModule::t("User activation"),
		    'content' => UserModule::t("Your account has been activated.")
			)
		);
	    }
	    else
		throw new HttpException(500); // not saved - error
	}
	else
	    throw new HttpException(403); // forbidden - no user
    }

}
<?php


/**
 * UserIdentity represents the data needed to identity a user.
 * It contains the authentication method that checks if the provided
 * data can identity the user.
 */
class UserIdentity extends CUserIdentity
{

    private $_id;

    const ERROR_EMAIL_INVALID = 3;

    const ERROR_STATUS_NOTACTIV = 4;

    const ERROR_STATUS_BAN = 5;

    const ERROR_CAPTCHA = 6;

    /**
     * Authenticates a user with email and password.
     * @return boolean whether authentication succeeds.
     */
    public function authenticate()
    {

	if (strpos($this->username, "@"))
	{
	    $user = User::model()->notsafe()->findByAttributes(array('email' => $this->username));
	}

	if ($user === null)
	{
	    if (strpos($this->username, "@"))
	    {
		$this->errorCode = self::ERROR_EMAIL_INVALID;
	    }
	}
	else if (Yii::app()->getModule('user')->encrypting($this->password) !== $user->password)
	{
	    $this->errorCode = self::ERROR_PASSWORD_INVALID;
	}
	else if ($user->status == 0 && Yii::app()->getModule('user')->loginNotActiv == false)
	{
	    $this->errorCode = self::ERROR_STATUS_NOTACTIV;
	}
	else if ($user->status == -1)
	{
	    $this->errorCode = self::ERROR_STATUS_BAN;
	}
	else
	{
	    $this->_id = $user->id;
	    $this->username = $user->username;
	    $this->errorCode = self::ERROR_NONE;
	}
	return !$this->errorCode;
    }

    /**
     * Get the user id.
     * @return integer the ID of the user record
     */
    public function getId()
    {
	return $this->_id;
    }

}
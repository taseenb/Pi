<?php


/**
 * ChangePassword class.
 * ChangePassword is the data structure for keeping
 * user change password form data. It is used by the 'changepassword' action of 'UserController'.
 */
class ChangePassword extends CFormModel
{

    public $oldPassword;

    public $password;

    public $verifyPassword;

    public function rules()
    {

	$minPwdLength = Yii::app()->params['minPwdLength'];

	return Yii::app()->controller->action->id == 'recovery' ? array(
	    array('password, verifyPassword', 'required'),
	    array('password, verifyPassword', 'length', 'max' => 64, 'min' => $minPwdLength, "tooLong" => "Too many characters!", "tooShort" => "$minPwdLength characters or more. Be tricky."),
	    array('verifyPassword', 'compare', 'compareAttribute' => 'password', 'message' => UserModule::t("Passwords do not match.")),
		) : array(
	    array('oldPassword, password, verifyPassword', 'required'),
	    array('password', 'length', 'max' => 64, 'min' => $minPwdLength, "tooLong" => "Too many characters!", "tooShort" => "$minPwdLength characters or more. Be tricky."),
	    array('verifyPassword', 'compare', 'compareAttribute' => 'password', 'message' => UserModule::t("Passwords do not match.")),
	    array('oldPassword', 'verifyOldPassword'),
	);
    }

    /**
     * Declares attribute labels.
     */
    public function attributeLabels()
    {
	return array(
	    'oldPassword' => UserModule::t("Your Old Password"),
	    'password' => UserModule::t("Create a New Password"),
	    'verifyPassword' => UserModule::t("Retype Your Password"),
	);
    }

    /**
     * Verify Old Password
     */
    public function verifyOldPassword($attribute, $params)
    {
	if (User::model()->notsafe()->findByPk(Yii::app()->user->id)->password != Yii::app()->getModule('user')->encrypting($this->$attribute))
	    $this->addError($attribute, UserModule::t("Old Password is incorrect."));
    }

}
<?php


/**
 * SignupForm class.
 * SignupForm is the data structure for keeping
 * user registration form data. It is used by the 'registration' action of 'UserController'.
 */
class SignupForm extends User
{

    public $verifyPassword;

    public $verifyCode;

    public function rules()
    {
	$minPwdLength = Yii::app()->params['minPwdLength'];
	$rules = array(
	    array('password, verifyPassword, email', 'required', 'message' => UserModule::t("This field is required.")),
	    array('email', 'email', 'message' => 'Enter a valid email.'),
	    array('password', 'length', 'max' => 64, 'min' => $minPwdLength, "tooLong" => "Too many characters!", "tooShort" => "$minPwdLength characters or more. Be tricky."),
	    array('verifyPassword', 'compare', 'compareAttribute' => 'password', 'message' => UserModule::t("Passwords do not match.")),
	    array('email', 'unique', 'message' => UserModule::t("This user already exists.")),
	);
	if (!(isset($_POST['SignupFormStep']) && $_POST['SignupFormStep'] === 'one')) {
	    array_push($rules, array('verifyCode', 'captcha', 'allowEmpty' => 'false', 'message' => 'Captcha incorrect, try again.'));
	}
	
	return $rules;
    }

}
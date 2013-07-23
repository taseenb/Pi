<?php

/**
 * RecoveryForm class.
 * RecoveryForm is the data structure for keeping
 * user recovery form data. It is used by the 'recovery' action of 'UserController'.
 */
class RecoveryForm extends CFormModel {

    public $email, $user_id;

    /**
     * Declares the validation rules.
     * The rules state that username and password are required,
     * and password needs to be authenticated.
     */
    public function rules() {
	return array(
	    array('email', 'required'),
	    array('email', 'email'),
	    array('email', 'checkexists'),
	);
    }

    /**
     * Declares attribute labels.
     */
    public function attributeLabels() {
	return array(
	    'email' => UserModule::t("email"),
	);
    }

    /**
     * Validation rule that checks if the email exists in the database.
     * @param type $attribute
     * @param type $params
     */
    public function checkexists($attribute, $params) {
	if (!$this->hasErrors()) {  // we only want to authenticate when no input errors
	    $user = User::model()->findByAttributes(array('email' => $this->email));
	    if ($user) 
		$this->user_id = $user->id;
	    if ($user === null) 
		$this->addError("email", UserModule::t("Email is not valid."));
	}
    }

}
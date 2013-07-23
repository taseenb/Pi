<?php


/**
 * LoginForm class.
 * LoginForm is the data structure for keeping
 * user login form data. It is used by the 'login' action of 'SiteController'.
 */
class LoginForm extends CFormModel
{

    public $email;

    public $password;

    public $rememberMe;

    public $verifyCode;
    
    /**
     * Tells if Captcha is active in the form. Defaults to false.
     * (This can be activated after a certain amount of failed logins).
     * @var boolean 
     */
    public $captcha = false;

    /**
     * Declares the validation rules.
     * The rules state that email and password are required,
     * and password needs to be authenticated.
     */
    public function rules()
    {
	if ($this->captcha) $this->scenario = 'captchaRequired';
	
	return array(
	    array('email, password', 'required'),
	    array('email, password, verifyCode', 'required', 'on'=>'captchaRequired'),
	    array('verifyCode', 'captcha', 'allowEmpty' => "false", "message"=>"Unauthorized. Invalid credentials or captcha."),
	    array('rememberMe', 'boolean'),
	    array('password', 'authenticate')
        );
    }

    /**
     * Declares attribute labels.
     */
    public function attributeLabels()
    {
	return array(
	    'rememberMe' => UserModule::t("Remember me next time"),
	    'email' => UserModule::t("Email"),
	    'password' => UserModule::t("Password"),
	    'captcha' => UserModule::t("Captcha"),
	);
    }

    /**
     * Authenticates email and password.
     * This is the 'authenticate' validator as declared in rules().
     */
    public function authenticate($attribute, $params)
    {
	// Only try to authenticate when there are no other input errors in the form
	if (!$this->hasErrors())
	{  
	    $identity = new UserIdentity($this->email, $this->password);
	    $identity->authenticate();
	    
	    $invalidMessage = "Unauthorized. Invalid credentials.";
	    if ($this->captcha) $invalidMessage = "Unauthorized. Invalid credentials or captcha.";

	    switch ($identity->errorCode)
	    {
		case UserIdentity::ERROR_NONE:
		    $duration = $this->rememberMe ? Yii::app()->controller->module->rememberMeTime : 0;
		    Yii::app()->user->login($identity, $duration);
		    break;
		case UserIdentity::ERROR_EMAIL_INVALID:
		    $this->addError("username", $invalidMessage);
		    break;
		case UserIdentity::ERROR_PASSWORD_INVALID:
		    $this->addError("password", $invalidMessage);
		    break;
		case UserIdentity::ERROR_STATUS_NOTACTIV:
		    $this->addError("status", "Unauthorized. Not active.");
		    break;
		case UserIdentity::ERROR_STATUS_BAN:
		    $this->addError("status", "Unauthorized. Locked.");
		    break;
	    }
	}
    }

}



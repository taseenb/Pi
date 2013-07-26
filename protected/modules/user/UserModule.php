<?php

/**
 * Yii-User module
 * 
 * @author Mikhail Mangushev <mishamx@gmail.com> 
 * @link http://yii-user.2mx.org/
 * @license http://www.opensource.org/licenses/bsd-license.php
 * @version $Id: UserModule.php 132 2011-10-30 10:45:01Z mishamx $
 */
class UserModule extends CWebModule {

    /**
     * @var int
     * @desc items on page
     */
    public $user_page_size = 10;

    /**
     * @var int
     * @desc items on page
     */
    public $fields_page_size = 10;

    /**
     * @var string
     * @desc hash method (md5,sha1 or algo hash function http://www.php.net/manual/en/function.hash.php)
     */
    public $hash = 'md5';

    /**
     * @var boolean
     * @desc use email for activation user account
     */
    public $sendActivationMail = true;

    /**
     * @var boolean
     * @desc allow auth for is not active user
     */
    public $loginNotActiv = false;

    /**
     * @var boolean
     * @desc activate user on registration (only $sendActivationMail = false)
     */
    public $activeAfterRegister = false;

    /**
     * @var boolean
     * @desc login after registration (need loginNotActiv or activeAfterRegister = true)
     */
    public $autoLogin = false;
    public $activationUrl = array("/user/activation");
    public $bootstrapUrl = array("/user/bootstrap");
    public $registrationUrl = array("/user/signup");
    public $recoveryUrl = array("/user/recovery");
    public $loginUrl = array("/user/login");
    public $logoutUrl = array("/user/logout");
    public $profileUrl = array("/user/profile");
    public $returnUrl = array("/user/profile");
    public $returnLogoutUrl = array("/");

    /**
     * @var int
     * @desc Remember Me Time (seconds), defalt = 2592000 (30 days)
     */
    public $rememberMeTime = 2592000; // 30 days
    public $fieldsMessage = '';

    /**
     * @var array
     * @desc User model relation from other models
     * @see http://www.yiiframework.com/doc/guide/database.arr
     */
    public $relations = array();

    /**
     * @var array
     * @desc Profile model relation from other models
     */
    public $profileRelations = array();

    /**
     * @var boolean - true to activate captcha
     */
    public $captcha = array('registration' => false);

    /**
     * @var boolean
     */
    //public $cacheEnable = false;

    public $tableUsers = '{{users}}';
    public $tableProfiles = '{{profiles}}';
    public $tableProfileFields = '{{profiles_fields}}';
    public $defaultScope = array(
	'with' => array('profile'),
    );
    static private $_user;
    static private $_users = array();
    static private $_userByName = array();
    static private $_admin;
    static private $_admins;

    /**
     * @var array
     * @desc Behaviors for models
     */
    public $componentBehaviors = array();

    public function init() {
	// this method is called when the module is being created
	// you may place code here to customize the module or the application
	// import the module-level models and components
	$this->setImport(array(
	    'user.models.*',
	    'user.components.*',
	));

	//Yii::app()->theme = 'classic';
    }

    public function getBehaviorsFor($componentName) {
	if (isset($this->componentBehaviors[$componentName])) {
	    return $this->componentBehaviors[$componentName];
	} else {
	    return array();
	}
    }

    public function beforeControllerAction($controller, $action) {
	if (parent::beforeControllerAction($controller, $action)) {
	    // this method is called before any module controller action is performed
	    // you may place customized code here
	    return true;
	}
	else
	    return false;
    }

    /**
     * @param $str
     * @param $params
     * @param $dic
     * @return string
     */
    public static function t($str = '', $params = array(), $dic = 'user') {
	if (Yii::t("UserModule", $str) == $str)
	    return Yii::t("UserModule." . $dic, $str, $params);
	else
	    return Yii::t("UserModule", $str, $params);
    }

    /**
     * @return hash string.
     */
    public static function encrypting($string = "") {
	$hash = Yii::app()->getModule('user')->hash;
	if ($hash == "md5")
	    return md5($string);
	if ($hash == "sha1")
	    return sha1($string);
	else
	    return hash($hash, $string);
    }

    /**
     * @param $place
     * @return boolean 
     */
    public static function doCaptcha($place = '') {
	if (!extension_loaded('gd'))
	    return false;
	if (in_array($place, Yii::app()->getModule('user')->captcha))
	    return Yii::app()->getModule('user')->captcha[$place];
	return false;
    }

    /**
     * Return admin status.
     * @return boolean
     */
    public static function isAdmin() {
	if (Yii::app()->user->isGuest)
	    return false;
	else {
	    if (!isset(self::$_admin)) {
		if (self::user()->superuser)
		    self::$_admin = true;
		else
		    self::$_admin = false;
	    }
	    return self::$_admin;
	}
    }

    /**
     * Return admins.
     * @return array syperusers names
     */
    public static function getAdmins() {
	if (!self::$_admins) {
	    $admins = User::model()->active()->superuser()->findAll();
	    $return_name = array();
	    foreach ($admins as $admin)
		array_push($return_name, $admin->username);
	    self::$_admins = ($return_name) ? $return_name : array('');
	}
	return self::$_admins;
    }

    public static function sendMail($email, $subject, $message) {
	Yii::import('ext.phpmailer.PhpMailer');
	$message = wordwrap($message, 70);
	$mail = new PhpMailer(true);
	try {
	    $mail->SetFrom(Yii::app()->params['infoEmail'], 'Processing Ideas');
	    $mail->Subject = $subject;
	    $mail->Body = $message;
	    $mail->AddAddress($email, '');
	    // SMTP settings
	    $mail->IsSMTP();
	    $mail->Host = Yii::app()->params['Host'];
	    $mail->Username = Yii::app()->params['Username'];
	    $mail->Password = Yii::app()->params['Password'];
	    $mail->SMTPAuth = Yii::app()->params['SMTPAuth'];
	    $mail->SMTPSecure = Yii::app()->params['SMTPSecure'];
	    $mail->Port = Yii::app()->params['Port'];
	    
	    //$mail->AltBody='To view the message, please use an HTML compatible email viewer!';
	    //$mail->MsgHTML($message);
	    //$mail->SMTPDebug = 1;  // 1 = errors and messages // 2 = messages only
	    return $mail->Send();
	} catch (phpmailerException $e) {
	    Yii::log($e->errorMessage(), "error"); 
	    // $e->errorMessage(); //Pretty error messages from PHPMailer
	    //exit();
	} catch (Exception $e) {
	    Yii::log($e->getMessage(), "error");
	    //echo $e->getMessage(); //Boring error messages from anything else!
	    //exit();
	}
	//return true;
    }

    /**
     * Return safe user data.
     * @param user id not required
     * @return user object or false
     */
    public static function user($id = 0, $clearCache = false) {
	if (!$id && !Yii::app()->user->isGuest)
	    $id = Yii::app()->user->id;
	if ($id) {
	    if (!isset(self::$_users[$id]) || $clearCache)
		self::$_users[$id] = User::model()->with(array('profile'))->findbyPk($id);
	    return self::$_users[$id];
	}
	else
	    return false;
    }

    /**
     * Return safe user data.
     * @param user name
     * @return user object or false
     */
    public static function getUserByName($username) {
	if (!isset(self::$_userByName[$username])) {
	    $_userByName[$username] = User::model()->findByAttributes(array('username' => $username));
	}
	return $_userByName[$username];
    }

    /**
     * Return safe user data.
     * @param user id not required
     * @return user object or false
     */
    public function users() {
	return User;
    }

}

<?php


/**
 * The followings are the available columns in table 'users':
 * @var integer $id
 * @var string $username
 * @var string $password
 * @var string $email
 * @var string $activkey
 * @var integer $lastvisit
 * @var integer $superuser
 * @var integer $status
 * @var timestamp $lastvisit_at
 */
class User extends ActiveRecord
{

    const ACTIVE = 1;

    const UNACTIVE = 0;

    const BANNED = -1;

    /**
     * Returns the static model of the specified AR class.
     * @return CActiveRecord the static model class
     */
    public static function model($className = __CLASS__)
    {
	return parent::model($className);
    }

    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
	return Yii::app()->getModule('user')->tableUsers;
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
	// NOTE: you should only define rules for those attributes that
	// will receive user inputs.CConsoleApplication
	if (get_class(Yii::app()) == 'CConsoleApplication' || (get_class(Yii::app()) != 'CConsoleApplication' && Yii::app()->getModule('user')->isAdmin()))
	{
	    $array = array(
		array('username', 'length', 'max' => 20, 'min' => 3, 'message' => UserModule::t("Incorrect username (length between 3 and 20 characters).")),
		array('password', 'length', 'max' => 128, 'min' => 5, 'message' => UserModule::t("Incorrect password (minimal length 5 symbols).")),
		array('email', 'email'),
		array('username', 'unique', 'message' => UserModule::t("This user's name already exists.")),
		array('email', 'unique', 'message' => UserModule::t("This user's email address already exists.")),
		array('username', 'match', 'pattern' => '/^[A-Za-z0-9_]+$/u', 'message' => UserModule::t("Incorrect symbols (A-z0-9).")),
		array('status', 'in', 'range' => array(self::UNACTIVE, self::ACTIVE, self::BANNED)),
		array('superuser', 'in', 'range' => array(0, 1)),
		array('email, superuser, status', 'required'),
		array('create_time, lastvisit_at, superuser, status', 'numerical', 'integerOnly' => true),
		array('id, username, password, email, activkey, lastvisit_at, superuser, status', 'safe', 'on' => 'search'),
	    );
	}
	else
	{
	    if (Yii::app()->user->id == $this->id)
	    {
		$array = array(
		    //array('username, email', 'required'),
		    array('email', 'required'),
		    //array('username', 'length', 'max' => 20, 'min' => 3, 'message' => UserModule::t("Incorrect username (length between 3 and 20 characters).")),
		    array('email', 'email'),
		    //array('username', 'unique', 'message' => UserModule::t("This user's name already exists.")),
		    //array('username', 'match', 'pattern' => '/^[A-Za-z0-9_]+$/u', 'message' => UserModule::t("Incorrect symbols (A-z0-9).")),
		    array('email', 'unique', 'message' => UserModule::t("This user's email address already exists.")),
		);
	    }
	    else
	    {
		$array = array();
	    }
	}
	return $array;
    }

    /**
     * @return array relational rules.
     */
    public function relations()
    {
	$relations = Yii::app()->getModule('user')->relations;
	if (!isset($relations['profile']))
	    $relations['profile'] = array(
		self::HAS_ONE,
		'Profile',
		'user_id'
	    );
	if (!isset($relations['projects']))
	    $relations['projects'] = array(
		self::HAS_MANY,
		'Project',
		'user_id',
		'with' => 'tabs'
	    );
//	if (!isset($relations['defaultCollection']))
//	    $relations['defaultCollection'] = array(
//		self::HAS_ONE,
//		'Collection',
//		'default_collection'
//	    );
	return $relations;
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
	return array(
	    'id' => UserModule::t("Id"),
	    'username' => UserModule::t("username"),
	    'password' => UserModule::t("password"),
	    'verifyPassword' => UserModule::t("Retype Password"),
	    'email' => UserModule::t("E-mail"),
	    'verifyCode' => UserModule::t("Verification Code"),
	    'activkey' => UserModule::t("activation key"),
	    'lastvisit_at' => UserModule::t("Last visit"),
	    'superuser' => UserModule::t("Superuser"),
	    'status' => UserModule::t("Status"),
	    'update_time' => UserModule::t("Update Time"),
	    'create_time' => UserModule::t("Create Time"),
//	    'default_collection' => UserModule::t("Default Collection"),
	);
    }

    public function scopes()
    {
	return array(
	    'active' => array(
		'condition' => 'status=' . self::ACTIVE,
	    ),
	    'notactive' => array(
		'condition' => 'status=' . self::UNACTIVE,
	    ),
	    'banned' => array(
		'condition' => 'status=' . self::BANNED,
	    ),
	    'superuser' => array(
		'condition' => 'superuser=1',
	    ),
	    'notsafe' => array(
		'select' => 'id, username, password, email, activkey, lastvisit_at, superuser, status',
	    ),
	);
    }

    public function defaultScope()
    {
	return CMap::mergeArray(Yii::app()->getModule('user')->defaultScope, array(
		    'alias' => 'user',
		    'select' => 'user.id, user.username, user.email, user.lastvisit_at, user.superuser, user.status, user.update_time, user.create_time',
	));
    }

    public static function itemAlias($type, $code = NULL)
    {
	$_items = array(
	    'UserStatus' => array(
		self::UNACTIVE => UserModule::t('Not active'),
		self::ACTIVE => UserModule::t('Active'),
		self::BANNED => UserModule::t('Banned'),
	    ),
	    'AdminStatus' => array(
		'0' => UserModule::t('No'),
		'1' => UserModule::t('Yes'),
	    ),
	);
	if (isset($code))
	    return isset($_items[$type][$code]) ? $_items[$type][$code] : false;
	else
	    return isset($_items[$type]) ? $_items[$type] : false;
    }

    /**
     * Retrieves a list of models based on the current search/filter conditions.
     * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
     */
    public function search()
    {
	// Warning: Please modify the following code to remove attributes that
	// should not be searched.

	$criteria = new CDbCriteria;

	$criteria->compare('id', $this->id);
	$criteria->compare('username', $this->username, true);
	$criteria->compare('password', $this->password);
	$criteria->compare('email', $this->email, true);
	$criteria->compare('activkey', $this->activkey);
	$criteria->compare('lastvisit_at', $this->lastvisit_at);
	$criteria->compare('superuser', $this->superuser);
	$criteria->compare('status', $this->status);
	$criteria->compare('update_time', $this->update_time);
	$criteria->compare('create_time', $this->create_time);
//	$criteria->compare('default_collection', $this->default_collection);

	return new CActiveDataProvider(get_class($this), array(
	    'criteria' => $criteria,
	    'pagination' => array(
		'pageSize' => Yii::app()->getModule('user')->user_page_size,
	    ),
	));
    }

    public function getCreatetime()
    {
	return $this->create_time;
    }

    public function setCreatetime($value)
    {
	$this->create_time = time();
    }

    public function getLastvisit()
    {
	return $this->lastvisit_at;
    }

    public function setLastvisit($value)
    {
	$this->lastvisit_at = time();
	//$this->lastvisit_at=date('Y-m-d H:i:s',$value);
    }

    /**
     * Create a default collection for the current user.
     * All users must have a default collection, 
     * that cannot be deleted until the user is deleted.
     */
//    public function createDefaultCollection()
//    {
//	// Create the default collection for the current user
//	$collection = new Collection;
//	$collection->user_id = $this->id;
//	$collection->name = "Your Collection";
//	$collection->description = "This is your default collection.";
//
//	if ($collection->save())
//	{
//	    return $collection->id;
//	}
//	else
//	{
//	    throw new CHttpException(500, 'Server error. Could not create the default user collection.');
//	}
//    }

    /**
     * Send a new activation code via mail.
     * Used immediatly after signup or on user request.
     */
    public function sendActivationMail($activkey = null)
    {

	if ($this->status == 0)
	{ // make sure the user is User::UNACTIVE
	    // If an activekey is not provided from the registration process, create a new one
	    if (!$activkey)
	    {
		$this->activkey = UserModule::encrypting(microtime() . $this->password);
		if (!$this->save())
		{
		    Yii::log('Did not send email and could not update activkey on user id ' . $this->id, 'error');
		    return false;
		}
	    }

	    // Create an activation Url.
	    // $activationUrl = Yii::app()->createAbsoluteUrl('/user/signup/activation', array("activkey" => $this->activkey, "email" => $this->email));
	    $activationUrl = $this->_activationUrl($this->activkey, $this->email);

	    // Send mail.
	    return UserModule::sendMail(
			    // To
			    $this->email,
			    // Subject 
			    "Welcome to Processing Ideas",
			    // Body 
			    "Hi,
		    \nYou registered a new account at Processing Ideas.
		    \nPlease activate your account by following this url: $activationUrl
		    \nThank you,
		    \nPi
		    \nhttp://processingideas.com"
	    );
	}
	else
	    throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
    }

    /**
     * Create an activation Url with activKey and email.
     * The email is split in local and domain parts to avoid problems with the "@" characters.
     * @param string $activKey
     * @param string $email
     * @return string Activation url.
     */
    private function _activationUrl($activKey, $email)
    {

	// Split the local part of the email from the domain
	$at = strpos($email, '@');
	$local = substr($email, 0, $at);
	$domain = str_replace($local . "@", "", $email);

	return Yii::app()->createAbsoluteUrl(
			'/user/activation', array(
		    "key" => $activKey,
		    "l" => $local,
		    "d" => $domain
			)
	);
    }

}
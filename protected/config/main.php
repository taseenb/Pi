<?php
// Set paths
$root = realpath(dirname(__FILE__) . '/../..');
$configRoot = dirname(__FILE__);

// Load secrets


// Load params
$params = require($configRoot . '/params.php');

// Load local config
$configLocal = file_exists($configRoot . '/main-local.php') ? require($configRoot . '/main-local.php') : array();

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return CMap::mergeArray(array(

	'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',

	'name' => 'Processing Ideas',

	'defaultController' => 'site',

	'sourceLanguage' => '00',

	'language' => 'en',

	// preloading 'log' component
	'preload' => array('log'),

	'theme' => 'classic',

	// autoloading model and component classes
	'import' => array(
		'application.models.*',
		'application.components.*',
		'application.modules.user.models.*',
		'application.modules.user.components.*',
		'application.modules.rights.*',
		'application.modules.rights.components.*',
	),

	'modules' => array(
		'user' => array(
			'returnUrl' => array("/"),
			'returnLogoutUrl' => array("/")
		),
		'rights' => array(
			'userNameColumn' => 'username', // Name of the user name column in the database.
		),

	),
	'components' => array(
		'cache' => extension_loaded('apc') ?
			array(
				'class' => 'CApcCache',
			) :
			array(
				'class' => 'CDbCache',
				'connectionID' => 'db',
				'autoCreateCacheTable' => true,
				'cacheTableName' => 'cache',
			),
		'mailer' => array(
			'class' => 'application.extensions.phpmailer.PhpMailer',
		),
		'session' => array(
			'sessionName' => 'PISESSID',
			'cookieMode' => 'only',
			'class' => 'system.web.CDbHttpSession',
			'connectionID' => 'db',
			'sessionTableName' => 'pi_sessions',
			'timeout' => 86400, // 24 hours
		),
		'request' => array(
			'class' => 'application.components.HttpRequest',
			'enableCsrfValidation' => true,
			'csrfTokenName' => 'picsrftokenname',
			'enableCookieValidation' => true
		),
		'user' => array(
			'class' => 'RWebUser',
			// enable cookie-based authentication
			'allowAutoLogin' => true,
			'loginUrl' => array('/user/login'),
		),
		'authManager' => array(
			'class' => 'RDbAuthManager',
			'connectionID' => 'db',
			'defaultRoles' => array('Authenticated', 'Guest'),
		),
		'clientScript' => array(
			'scriptMap' => array(
				// Never include jquery
				'jquery.js' => false
			)
		),
		'urlManager' => array(
			'caseSensitive' => false,
			'urlFormat' => 'path',
			'showScriptName' => false,
			'rules' => array(
				// REST patterns
				// Get a single model
				array('<controller>/read', 'pattern' => '<controller:(project|tab|collection)>/<id:\d+>', 'verb' => 'GET'),
				// Get a list of models
				array('<controller>/read', 'pattern' => '<controller:(project|tab|collection)>s', 'verb' => 'GET'),
				// Create a new model
				array('<controller>/create', 'pattern' => '<controller:(project|tab|collection)>', 'verb' => 'POST'),
				// Update an existing model
				array('<controller>/update', 'pattern' => '<controller:(project|tab|collection)>/<id:\d+>', 'verb' => 'PUT,PATCH'),
				// Delete an existing model
				array('<controller>/delete', 'pattern' => '<controller:(project|tab|collection)>/<id:\d+>', 'verb' => 'DELETE'),

				// Embed
				'embed/<id:\d+>' => 'embed/run/<id>',

				// User
				'user/<action:\w+>/*' => 'user/user/<action>',

				// Yii default
				//'<controller:\w+>/<id:\d+>'=>'<controller>/view',
				'static/<page:\w+>' => 'site/page/view/<page>',
				'<controller:\w+>/<action:\w+>/<id:\d+>' => '<controller>/<action>',
				'<controller:\w+>/<action:\w+>' => '<controller>/<action>',
			),
		),
		'db' => array(
			//'connectionString' => $params['db.connectionString'],
			'connectionString'   => "mysql:host={$params['db.host']};dbname={$params['db.name']}" . (isset($params['db.unix_socket']) ? ";unix_socket={$params['db.unix_socket']}" : ""),
			'username'           => $params['db.username'],
			'password'           => $params['db.password'],
			'tablePrefix'	     => $params['db.tablePrefix'],
			'charset'            => 'utf8',
			'enableParamLogging' => YII_DEBUG,
			'emulatePrepare'     => true,
			// 'enableProfiling'=> YII_DEBUG,
			'schemaCachingDuration' => YII_DEBUG ? 0 : 86400000,  // 1000 days
		),
		'errorHandler' => array(
			// use 'site/error' action to display errors
			'errorAction' => 'site/error',
		),
		'log' => array(
			'class' => 'CLogRouter',
			'routes' => array(
				array(
					'class' => 'CFileLogRoute',
					'levels' => 'error, warning',
				),
				//				array(
				//					'class'=>'CWebLogRoute',
				//				),
				//				array(
				//					'class'=>'CEmailLogRoute',
				//					'levels'=>'error',
				//					'filter'=>'CLogFilter',
				//					'emails' => array('developer@example.com'),
				//					'enabled' => !YII_DEBUG,
				//				),
			),
		),
	),

	'params' => $params,

), $configLocal);

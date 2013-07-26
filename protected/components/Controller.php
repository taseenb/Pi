<?php


/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class Controller extends CController
{

    /**
     * @var string the default layout for the controller view. Defaults to '//layouts/column1',
     * meaning using a single column layout. See 'protected/views/layouts/column1.php'.
     */
    public $layout = '//layouts/column1';

    /**
     * @var array context menu items. This property will be assigned to {@link CMenu::items}.
     */
    public $menu = array();

    /**
     * @var array the breadcrumbs of the current page. The value of this property will
     * be assigned to {@link CBreadcrumbs::links}. Please refer to {@link CBreadcrumbs::links}
     * for more details on how to specify this property.
     */
    public $breadcrumbs = array();

    /**
     * @return array action filters
     */
    public function filters()
    {
	return array(
	    'accessControl', // perform access control for CRUD operations
		//'postOnly + delete', // we only allow deletion via POST request
	);
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules()
    {
	return array(
	    array('allow', 'actions' => array(
		    'contact',
		    'page', // static pages (site controller)
		    'bootstrap',
		    'login',
		    'logout',
		    'signup',
		    'activation',
		    'resendEmail',
		    'error',
		    'captcha',
		    'recovery',
		    // REST
		    'read',
		),
		'users' => array('*'),
	    ),
	    array('allow', 'actions' => array(
		    'admin',
		    // REST
		    'create',
		    'update',
		    'delete',
		),
		'users' => array('@'),
	    ),
	    array('deny', 'users' => array('*')),
	);
    }

    /**
     * Action classes used by controllers.
     * @return array
     */
    public function actions()
    {
	return array(
	    'bootstrap' => array(
		'class' => 'application.controllers.actions.BootstrapAction',
	    ),
	    'captcha' => array(
		'class' => 'CCaptchaAction',
		'backColor' => 0xFFFFFF,
		'testLimit' => 2 // cannot be less than 2 otherwise it will not save() the model
	    ),
	    'page' => array(
		'layout' => false,
		'class' => 'CViewAction',
	    )
	);
    }

    /**
     * Avoid duplicate core scripts on ajax requests.
     */
    protected function beforeAction($action)
    {
	// Disable automatic Yii loading for js libraries with ajax requests.
	if (Yii::app()->request->isAjaxRequest)
	{
	    Yii::app()->clientScript->scriptMap['jquery.min.js'] = false;
	    Yii::app()->clientScript->scriptMap['jquery-ui.min.js'] = false;
	    Yii::app()->clientScript->scriptMap['jquery-2.0.2.min.js'] = false;
	}
	return parent::beforeAction($action);
    }

    /**
     * Send raw HTTP response
     * @param int $status HTTP status code
     * @param string $body The body of the HTTP response
     * @param string $contentType Header content-type
     * @return HTTP response
     */
    protected function sendResponse($status = 200, $body = '', $contentType = 'application/json')
    {
	// Set the status
	$statusHeader = 'HTTP/1.1 ' . $status . ' ' . $this->getStatusCodeMessage($status);
	header($statusHeader);
	// Set the content type
	header('Content-type: ' . $contentType);

	echo $body;
	Yii::app()->end();
    }

    /**
     * Return the http status message based on integer status code
     * @param int $status HTTP status code
     * @return string status message
     */
    protected function getStatusCodeMessage($status)
    {
	$codes = array(
	    100 => 'Continue',
	    101 => 'Switching Protocols',
	    200 => 'OK',
	    201 => 'Created',
	    202 => 'Accepted',
	    203 => 'Non-Authoritative Information',
	    204 => 'No Content',
	    205 => 'Reset Content',
	    206 => 'Partial Content',
	    300 => 'Multiple Choices',
	    301 => 'Moved Permanently',
	    302 => 'Found',
	    303 => 'See Other',
	    304 => 'Not Modified',
	    305 => 'Use Proxy',
	    306 => '(Unused)',
	    307 => 'Temporary Redirect',
	    400 => 'Bad Request',
	    401 => 'Unauthorized',
	    402 => 'Payment Required',
	    403 => 'Forbidden',
	    404 => 'Not Found',
	    405 => 'Method Not Allowed',
	    406 => 'Not Acceptable',
	    407 => 'Proxy Authentication Required',
	    408 => 'Request Timeout',
	    409 => 'Conflict',
	    410 => 'Gone',
	    411 => 'Length Required',
	    412 => 'Precondition Failed',
	    413 => 'Request Entity Too Large',
	    414 => 'Request-URI Too Long',
	    415 => 'Unsupported Media Type',
	    416 => 'Requested Range Not Satisfiable',
	    417 => 'Expectation Failed',
	    500 => 'Internal Server Error',
	    501 => 'Not Implemented',
	    502 => 'Bad Gateway',
	    503 => 'Service Unavailable',
	    504 => 'Gateway Timeout',
	    505 => 'HTTP Version Not Supported',
	);
	return (isset($codes[$status])) ? $codes[$status] : '';
    }

    /**
     * Custom exceptions.
     */
    public function exception($code)
    {
	throw new HttpException($code);
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer the ID of the model to be loaded
     */
    public function loadModel($id)
    {
	$modelClass = ucfirst(Yii::app()->controller->id);
	$model = $modelClass::model()->findByPk($id);
	if ($model === null)
	    throw new CHttpException(404, 'The requested page does not exist.');
	return $model;
    }

}
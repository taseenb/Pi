<?php

/**
 * UController is the customized base controller class for the User module.
 * All controller classes for this module should extend from this base class.
 */
class UController extends Controller {
    
    /**
     * @var string the default layout for the controller view. Defaults to '//layouts/column1',
     * meaning using a single column layout. See 'protected/views/layouts/column1.php'.
     */
    public $layout = '//layouts/neutral';

    /**
     * @return array action filters
     */
    public function filters() {
	return CMap::mergeArray(parent::filters(), array(
		    'accessControl', // perform access control for CRUD operations
	));
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules() {
	return array(
	    array('allow', 'actions' => array(
		    'login',
		    'logout',
		    'signup',
		    'activation',
		    'resendEmail',
		    'recovery'
		),
		'users' => array('*'),
	    ),
	    array('allow', 'actions' => array(
//		    'index',
		    'view',
//		    'update',
//		    'admin',
//		    'delete',
			// User
			'save',
//			'avatar',
			// Profile
//			'edit'
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
    public function actions() {
	return CMap::mergeArray(parent::actions(), array(
		'login' => array(
		    'class' => 'application.modules.user.controllers.actions.LoginAction'
		),
		'signup' => array(
		    'class' => 'application.modules.user.controllers.actions.SignupAction'
		),
		'activation' => array(
		    'class' => 'application.modules.user.controllers.actions.ActivationAction'
		),
		'recovery' => array(
		    'class' => 'application.modules.user.controllers.actions.RecoveryAction'
		)
	));
    }


}
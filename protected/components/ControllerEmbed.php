<?php


class ControllerEmbed extends Controller
{

    public $layout = '//pi_layouts/embed';

    public function filters()
    {
	return array(
	    'accessControl', // perform access control for CRUD operations
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
		    'run',
		    'tab',
		),
		'users' => array('*'),
	    ),
	    array('allow', 'actions' => array(
		// 'view',
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
//	    'bootstrap' => array(
//		'class' => 'application.controllers.actions.BootstrapAction',
//	    )
	);
    }

}
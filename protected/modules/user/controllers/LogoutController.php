<?php

class LogoutController extends UController
{
	public $defaultAction = 'logout';
	
	
	
	/**
	 * Logout the current user and redirect to returnLogoutUrl.
	 */
	public function actionLogout()
	{
		Yii::app()->user->logout(true);
		//$this->redirect(Yii::app()->controller->module->returnLogoutUrl);
		$this->redirect(Yii::app()->homeUrl);
	}

}
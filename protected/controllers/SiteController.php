<?php

/** 
 * PI DEFAULT CONTROLLER.
 * This is the default controller of the Pi application.
 */

class SiteController extends Controller
{
	
	/*
	 * Main layout.
	 */
	public $layout='//pi_layouts/main';
	
	/*
	 * Bootstrap User data (default action).
	 */
	public $defaultAction = 'bootstrap';
	

	/**
	 * This is the action to handle external exceptions.
	 */
	public function actionError()
	{
		if($error=Yii::app()->errorHandler->error)
		{
			if(Yii::app()->request->isAjaxRequest) {
				echo $error['message'];
			} else {
				$this->layout='//pi_layouts/error';
				$this->render('error', $error);
			}
		}
	}

	/**
	 * Displays the contact page
	 */
	public function actionContact()
	{
		$this->layout='//pi_layouts/neutral';
	    
		$model=new ContactForm;
		if(isset($_POST['ContactForm']))
		{
			$model->attributes=$_POST['ContactForm'];
			if($model->validate())
			{
				$name='=?UTF-8?B?'.base64_encode($model->name).'?=';
				$subject='=?UTF-8?B?'.base64_encode($model->subject).'?=';
				$headers="From: $name <{$model->email}>\r\n".
					"Reply-To: {$model->email}\r\n".
					"MIME-Version: 1.0\r\n".
					"Content-type: text/plain; charset=UTF-8";

				mail(Yii::app()->params['adminEmail'],$subject,$model->message,$headers);
				Yii::app()->user->setFlash('contact','Thank you for contacting us. We will respond to you as soon as possible.');
				$this->refresh();
			}
		}
		$this->render('contact',array('model'=>$model));
	}

	/**
	 * Logs out the current user and redirect to homepage.
	 */
	public function actionLogout()
	{
		Yii::app()->user->logout();
		$this->redirect(Yii::app()->homeUrl);
	}
}
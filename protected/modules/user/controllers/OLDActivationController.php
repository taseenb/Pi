<?php

class ActivationController extends Controller
{
	public $defaultAction = 'activation';
	public $layout = '//pi_layouts/neutral';

	
	/**
	 * Activation user account
	 */
	public function actionActivation () {
		
		if (isset($_GET['email']) && isset($_GET['activkey'])) {
			
			$email = str_replace("%40", "@", $_GET['email']);
			$activkey = $_GET['activkey'];
		
			$user = User::model()->notsafe()->findByAttributes(array('email'=>$email));
			
			if (isset($user) && $user->status) {
				
				// Account already active
				$this->render('/user/message', array('title'=>UserModule::t("User activation"),'content'=>UserModule::t("Your account is active.")));
				
			} elseif (isset($user->activkey) && ($user->activkey==$activkey)) {
				
				// Activate account
				$user->activkey = UserModule::encrypting(microtime());
				$user->status = User::ACTIVE;
				if ($user->save())
				    $this->render('/user/message',array('title'=>UserModule::t("User activation"),'content'=>UserModule::t("Your account has been activated."))); 
				else
				    throw new CHttpException(500, 'Server Error. Please try again later.');
			} else {
				
			    // Incorrect data (mail and/or activkey not valid)
			    $this->layout = '//pi_layouts/error';
			    $this->render('/user/message',array('title'=>UserModule::t("User activation"),'content'=>UserModule::t("Incorrect activation URL.")));
			}
			
		} else {
			
			// Incorrect data (mail and/or activkey not available)
			$this->layout = '//pi_layouts/error';
			$this->render('/user/message',array('title'=>UserModule::t("User activation"),'content'=>UserModule::t("Incorrect activation URL.")));
		}
		
	}
	
	
	
	public function actionResendEmail() {
	    echo 1;
	    
	}
	

}
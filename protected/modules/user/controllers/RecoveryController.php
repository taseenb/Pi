<?php


class RecoveryController extends UController
{

    public $defaultAction = 'recovery';

    public $layout = '//pi_layouts/neutral';

    /**
     * Password recovery.
     */
    public function actionRecovery()
    {
	$defender = new Defender();
	if (!$defender->isSafeIp())
	{
	    exit();
	}

	if (Yii::app()->user->isGuest)
	{
	    $email = isset($_GET['email']) ? $_GET['email'] : null;
	    $activkey = isset($_GET['activkey']) ? $_GET['activkey'] : null;
	    if ($email && $activkey)
	    {
		$this->_changePasswordForm($email, $activkey);
	    }
	    else if (request()->isAjaxRequest && request()->isPostRequest)
	    {
		$this->_recoveryForm();
	    }
	    else
	    {
		throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
	    }
	}
	else
	{
	    $this->redirect(Yii::app()->baseUrl);
	}
    }

    /**
     * A form to create a new password, based on user email and activation key. (changepassword.php)
     */
    private function _changePasswordForm($email, $activkey)
    {
	$form = new ChangePassword;
	$user = User::model()->notsafe()->findByAttributes(array('email' => $email));

	if (isset($user) && $user->activkey == $activkey)
	{
	    $this->layout='//pi_layouts/neutral';

	    if (isset($_POST['ChangePassword']))
	    {
		$form->attributes = $_POST['ChangePassword'];

		if ($form->validate())
		{
		    $user->password = Yii::app()->controller->module->encrypting($form->password);
		    $user->activkey = Yii::app()->controller->module->encrypting(microtime() . $form->password);

		    // Activate the user if it is not activated
		    // @TODO is this really safe HERE?
		    if ($user->status == 0)
		    {
			$user->status = 1;
		    }

		    if ($user->save())
		    {
			$this->redirect(Yii::app()->baseUrl . "/#log-in", true);
		    }
		    else
		    {
			throw new CHttpException(500, 'Server Error. Please try again later.');
		    }
		}
		else
		{
		    Yii::app()->user->setFlash('recoveryMessage', $this->_errorsHtml($form->getErrors()));
		    $this->refresh();
		}
	    }
	    $this->render('changepassword', array('form' => $form));
	}
	else
	{
	    throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
	}
    }

    /**
     * Recovery form action (_recovery.php).
     */
    private function _recoveryForm()
    {
	$form = new RecoveryForm;
	if (isset($_POST['RecoveryForm']))
	{
	    $form->attributes = $_POST['RecoveryForm'];

	    if ($form->validate())
	    {
		$user = User::model()->notsafe()->findbyPk($form->user_id);
		$activation_url = 'http://' . $_SERVER['HTTP_HOST'] . $this->createUrl(implode(Yii::app()->controller->module->recoveryUrl), array("activkey" => $user->activkey, "email" => $user->email));
		$subject = UserModule::t("You have requested a new password for {site_name}", array(
			    '{site_name}' => Yii::app()->name,
		));
		$message = UserModule::t("You have requested a new password for {site_name}. To create a new password, please go to: {activation_url}.", array(
			    '{site_name}' => Yii::app()->name,
			    '{activation_url}' => $activation_url,
		));

		if (UserModule::sendMail($user->email, $subject, $message))
		{
		    // Send json data
		    header('Content-type: application/json');
		    echo CJSON::encode(array('errors' => false));
		    return true;
		}
		else
		{
		    throw new CHttpException(500, 'Server error. Could not send the mail. Please try again later.');
		}
	    }
	    else
	    {
		throw new CHttpException(400, 'Invalid request. This email is not valid or does not exist.');
	    }
	}
	$this->renderPartial('_recovery', array('form' => $form), false, true);
    }

    /**
     * Converts Yii form errors array in html.
     * @param type $errorsArray CModel::getErrors() array.
     * @return string Html string with the list of errors for every attribute.
     */
    private function _errorsHtml($errorsArray)
    {
//	$errorsHtml = "";
	$errorsHtml = "<ul>";
	foreach ($errorsArray as $attribute => $errors)
	{
	    //$errorsHtml .= "<li>" . $attribute . "<ul>";
	    //$errorsHtml .= "<ul>";
	    foreach ($errors as $error)
	    {
		$errorsHtml .= "<li>" . $error . "</li>";
	    }
	    //$errorsHtml .= "</ul>";
	    //"</li>";
	}
	$errorsHtml .= "</ul>";
	return $errorsHtml;
    }

}
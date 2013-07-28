<?php

class UserController extends UController {

    /**
     * @var CActiveRecord the currently loaded data model instance.
     */
    private $_model;
    
    public function actionLogout()
    {
	    Yii::app()->user->logout();
	    $this->redirect(Yii::app()->homeUrl);
    }

    /**
     * Displays a particular model.
     */
//    public function actionView() {
//	$model = $this->loadModel();
//	$this->render('view', array(
//	    'model' => $model,
//	));
//    }

    /**
     * Lists all models.
     */
//    public function actionIndex() {
//	$dataProvider = new CActiveDataProvider('User', array(
//	    'criteria' => array(
//		'condition' => 'status>' . User::BANNED,
//	    ),
//	    'pagination' => array(
//		'pageSize' => Yii::app()->controller->module->user_page_size,
//	    ),
//	));
//
//	$this->render('index', array(
//	    'dataProvider' => $dataProvider,
//	));
//    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     */
//    public function loadModel() {
//	if ($this->_model === null) {
//	    if (isset($_GET['id']))
//		$this->_model = User::model()->findbyPk($_GET['id']);
//	    if ($this->_model === null)
//		throw new CHttpException(404, 'The requested page does not exist.');
//	}
//	return $this->_model;
//    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer the primary key value. Defaults to null, meaning using the 'id' GET variable
     */
    public function loadUser($id = null) {
	if ($this->_model === null) {
	    if ($id !== null || isset($_GET['id']))
		$this->_model = User::model()->findbyPk($id !== null ? $id : $_GET['id']);
	    if ($this->_model === null)
		throw new CHttpException(404, 'The requested page does not exist.');
	}
	return $this->_model;
    }

    /**
     * 
     */
//    public function actionAvatar() {
//	
//	//echo "avatar";
//	
//	if (Yii::app()->request->isPostRequest) {
//	    //file_put_contents('img.png', base64_decode($base64string));
//	    // upload avatar
//	} else {
//	    // get avatar url
//	}
//	
//    }
    

}

<?php

class CollectionController extends Controller
{

    /**
     * Action classes used by this controller.
     * @return array
     */
    public function actions()
    {
	return array(
	    // Collection specific actions
	    'list' => array(
		'class' => 'application.controllers.actions.CollectionListAction',
	    ),
	    'read' => array(
		'class' => 'application.controllers.actions.CollectionReadAction',
	    ),
	    // Actions shared by Collection, Project and Tab models
	    'create' => array(
		'class' => 'application.controllers.actions.CreateAction',
	    ),
	    'update' => array(
		'class' => 'application.controllers.actions.UpdateAction',
	    ),
	    'delete' => array(
		'class' => 'application.controllers.actions.DeleteAction',
	    ),
	);
    }

    /**
     * Displays a particular model.
     * @param integer $id the ID of the model to be displayed
     */
//    public function actionView($id)
//    {
//	$this->render('view', array(
//	    'model' => $this->loadModel($id),
//	));
//    }
//
//    /**
//     * Creates a new model.
//     * If creation is successful, the browser will be redirected to the 'view' page.
//     */
//    public function actionCreate()
//    {
//	$model = new Collection;
//
//	// Uncomment the following line if AJAX validation is needed
//	// $this->performAjaxValidation($model);
//
//	if (isset($_POST['Collection']))
//	{
//	    $model->attributes = $_POST['Collection'];
//	    if ($model->save())
//		$this->redirect(array('view', 'id' => $model->id));
//	}
//
//	$this->render('create', array(
//	    'model' => $model,
//	));
//    }
//
//    /**
//     * Updates a particular model.
//     * If update is successful, the browser will be redirected to the 'view' page.
//     * @param integer $id the ID of the model to be updated
//     */
//    public function actionUpdate($id)
//    {
//	$model = $this->loadModel($id);
//
//	// Uncomment the following line if AJAX validation is needed
//	// $this->performAjaxValidation($model);
//
//	if (isset($_POST['Collection']))
//	{
//	    $model->attributes = $_POST['Collection'];
//	    if ($model->save())
//		$this->redirect(array('view', 'id' => $model->id));
//	}
//
//	$this->render('update', array(
//	    'model' => $model,
//	));
//    }
//
//    /**
//     * Deletes a particular model.
//     * If deletion is successful, the browser will be redirected to the 'admin' page.
//     * @param integer $id the ID of the model to be deleted
//     */
//    public function actionDelete($id)
//    {
//	$this->loadModel($id)->delete();
//
//	// if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
//	if (!isset($_GET['ajax']))
//	    $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
//    }
//
//    /**
//     * Lists all models.
//     */
//    public function actionIndex()
//    {
//	$dataProvider = new CActiveDataProvider('Collection');
//	$this->render('index', array(
//	    'dataProvider' => $dataProvider,
//	));
//    }

    /**
     * Manages all models.
     */
    public function actionAdmin()
    {
	$model = new Collection('search');
	$model->unsetAttributes();  // clear any default values
	if (isset($_GET['Collection']))
	    $model->attributes = $_GET['Collection'];

	$this->render('admin', array(
	    'model' => $model,
	));
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer the ID of the model to be loaded
     */
//    public function loadModel($id)
//    {
//	$model = Collection::model()->findByPk($id);
//	if ($model === null)
//	    throw new CHttpException(404, 'The requested page does not exist.');
//	return $model;
//    }

    /**
     * Performs the AJAX validation.
     * @param CModel the model to be validated
     */
//    protected function performAjaxValidation($model)
//    {
//	if (isset($_POST['ajax']) && $_POST['ajax'] === 'collection-form')
//	{
//	    echo CActiveForm::validate($model);
//	    Yii::app()->end();
//	}
//    }

}



<?php


class ProjectController extends Controller
{
    /**
     * Action classes used by this controller.
     * @return array
     */
    public function actions()
    {
	return array(
	    // Project specific actions
	    'read' => array(
		'class' => 'application.controllers.actions.ProjectReadAction',
	    ),
	    'list' => array(
		'class' => 'application.controllers.actions.ProjectListAction',
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

    /**
     * Open a particular Project.
     */
    public function actionOpen($id)
    {
	if (request()->isAjaxRequest)
	{

	    // Get user id
	    $userId = Yii::app()->user->getId();
	    // Load user data
	    $user = User::model()->findByPk($userId);

	    // Make sure user is active
	    if ($user->status == User::ACTIVE)
	    {

		// Get project id requested
		//$id = request()->getPost('projectId');
		// Load Project
		$model = $this->loadModel($id);
		// Get related collection
		$collection = $model->collection;

		// Make sure the collection belongs to the user
		if ($collection->user_id == $userId)
		{

		    // Set Project as open
		    $model->open = 1;
		    // Store Project and Tabs data into an array
		    $pi = $model->attributes;
		    // get tabs (each one contains a piece of code)
		    foreach ($model->tabs as $tab)
		    {
			$pi['tabs'][$tab->id] = $tab->attributes;
		    }

		    if ($model->save())
		    {
			header('Content-type: application/json');
			echo CJSON::encode($pi);
		    }
		    else
		    {
			throw new CHttpException(500, 'Error while trying to close the project.');
		    }
		}
		else
		{
		    throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
		}
	    }
	}
    }

    /**
     * Close a Project.
     */
    public function actionClose($id)
    {
	if (request()->isAjaxRequest)
	{
	    // Get user id
	    $userId = Yii::app()->user->getId();
	    // Load user data
	    $user = User::model()->findByPk($userId);
	    // Make sure user is active
	    if ($user->status == User::ACTIVE)
	    {
		// Load Project
		$model = $this->loadModel($id);
		$model->open = 0;
		if ($model->save())
		{
		    echo 1;
		}
		else
		{
		    throw new CHttpException(500, 'Error while trying to close the project.');
		}
	    }
	}
    }

    /**
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
//    public function actionCreate()
//    {
//	$model = new Project;
//
//	// Uncomment the following line if AJAX validation is needed
//	// $this->performAjaxValidation($model);
//
//	if (isset($_POST['Project']))
//	{
//	    $model->attributes = $_POST['Project'];
//	    if ($model->save())
//		$this->redirect(array('view', 'id' => $model->id));
//	}
//
//	$this->render('create', array(
//	    'model' => $model,
//	));
//    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
//    public function actionUpdate($id)
//    {
//	$model = $this->loadModel($id);
//
//	// Uncomment the following line if AJAX validation is needed
//	// $this->performAjaxValidation($model);
//
//	if (isset($_POST['Project']))
//	{
//	    $model->attributes = $_POST['Project'];
//	    if ($model->save())
//		$this->redirect(array('view', 'id' => $model->id));
//	}
//
//	$this->render('update', array(
//	    'model' => $model,
//	));
//    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
//    public function actionDelete($id)
//    {
//	echo $this->loadModel($id)->delete();
//
//	// if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
//	// if(!isset($_GET['ajax']))
//	// 	$this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
//    }

    /**
     * Lists all models of the current user.
     */
//    public function actionIndex()
//    {
//	if (request()->isAjaxRequest)
//	{
//	    // Get user id
//	    $userId = Yii::app()->user->getId();
//	    // Load user data
//	    $user = User::model()->findByPk($userId);
//
//	    // Check if it is a Post and Ajax request + make sure user is active
//	    if ($user->status == User::ACTIVE)
//	    {
//		//$withTabs = request()->getPost('withTabs');
//		$pi = array();
//		foreach ($user->collections as $collection)
//		{
//		    $pi[$collection->id] = $collection->attributes;
//		    foreach ($collection->projects as $project)
//		    {
//			$pi[$collection->id]['projects'][$project->id] = $project->attributes;
//			// if ($withTabs) {
//			//    foreach($project->tabs as $tab) {
//			//        $pi[$collection->id]['projects'][$project->id]['tabs'][$tab->id] = $tab->attributes;
//			//    }
//			// }
//		    }
//		}
//		header('Content-type: application/json');
//		echo CJSON::encode($pi);
//	    }
//	}
//    }


    /**
     * Manages all models.
     */
    public function actionAdmin()
    {
	$model = new Project('search');
	$model->unsetAttributes();  // clear any default values
	if (isset($_GET['Project']))
	    $model->attributes = $_GET['Project'];

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
//	$model = Project::model()->findByPk($id);
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
//	if (isset($_POST['ajax']) && $_POST['ajax'] === 'project-form')
//	{
//	    echo CActiveForm::validate($model);
//	    Yii::app()->end();
//	}
//    }

}



<?php
/* @var $this TabController */
/* @var $model Tab */

$this->breadcrumbs=array(
	'Tabs'=>array('index'),
	$model->id=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
	array('label'=>'List Tab', 'url'=>array('index')),
	array('label'=>'Create Tab', 'url'=>array('create')),
	array('label'=>'View Tab', 'url'=>array('view', 'id'=>$model->id)),
	array('label'=>'Manage Tab', 'url'=>array('admin')),
);
?>

<h1>Update Tab <?php echo $model->id; ?></h1>

<?php echo $this->renderPartial('_form', array('model'=>$model)); ?>
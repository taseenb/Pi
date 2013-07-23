<?php
/* @var $this TabController */
/* @var $model Tab */

$this->breadcrumbs=array(
	'Tabs'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List Code', 'url'=>array('index')),
	array('label'=>'Manage Code', 'url'=>array('admin')),
);
?>

<h1>Create Tab</h1>

<?php echo $this->renderPartial('_form', array('model'=>$model)); ?>
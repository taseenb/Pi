<?php
/* @var $this CollectionController */
/* @var $model Collection */

$this->breadcrumbs=array(
	'Collections'=>array('index'),
	$model->name=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
	array('label'=>'List Collection', 'url'=>array('index')),
	array('label'=>'Create Collection', 'url'=>array('create')),
	array('label'=>'View Collection', 'url'=>array('view', 'id'=>$model->id)),
	array('label'=>'Manage Collection', 'url'=>array('admin')),
);
?>

<h1>Update Collection <?php echo $model->id; ?></h1>

<?php echo $this->renderPartial('_form', array('model'=>$model)); ?>
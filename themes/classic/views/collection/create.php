<?php
/* @var $this CollectionController */
/* @var $model Collection */

$this->breadcrumbs=array(
	'Collections'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List Collection', 'url'=>array('index')),
	array('label'=>'Manage Collection', 'url'=>array('admin')),
);
?>

<h1>Create Collection</h1>

<?php echo $this->renderPartial('_form', array('model'=>$model)); ?>
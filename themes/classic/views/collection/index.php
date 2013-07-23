<?php
/* @var $this CollectionController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Collections',
);

$this->menu=array(
	array('label'=>'Create Collection', 'url'=>array('create')),
	array('label'=>'Manage Collection', 'url'=>array('admin')),
);
?>

<h1>Collections</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>

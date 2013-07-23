<?php
/* @var $this TabController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Tabs',
);

$this->menu=array(
	array('label'=>'Create Code', 'url'=>array('create')),
	array('label'=>'Manage Code', 'url'=>array('admin')),
);
?>

<h1>Tabs</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>

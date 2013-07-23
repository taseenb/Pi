<?php
$this->pageTitle=Yii::app()->name . ' - Error';
?>

<br><br><br><br>
<h1>Error <?php echo $code; ?></h1>
<br><br>
<p class="error">
<?php echo CHtml::encode($message); ?>
</p>
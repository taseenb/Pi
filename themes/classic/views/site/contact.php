<?php
$this->pageTitle = Yii::app()->name . ' - Contact Us';
$this->breadcrumbs = array(
    'Contact',
);
?>

<div class="row">
    <div class="span12">

	<h3>Contact Us</h3>

	<?php if (Yii::app()->user->hasFlash('contact')): ?>

    	<div class="flash-success">
		<?php echo Yii::app()->user->getFlash('contact'); ?>
    	</div>

	<?php else: ?>

    	<p>
    	    If you have business inquiries or other questions, please fill out the following form to contact us. Thank you.
    	</p>

	    <?php
	    $form = $this->beginWidget('CActiveForm', array(
		'id' => 'contact-form',
		'enableClientValidation' => true,
		'clientOptions' => array(
		    'validateOnSubmit' => true,
		),
	    ));
	    ?>

    	<p class="note">Fields with <span class="required">*</span> are required.</p>

	    <?php echo $form->errorSummary($model); ?>

	    <?php echo $form->labelEx($model, 'name'); ?>
	    <?php echo $form->textField($model, 'name', array('class'=>'input-xlarge')); ?>
	    <?php echo $form->error($model, 'name'); ?>

	    <?php echo $form->labelEx($model, 'email'); ?>
	    <?php echo $form->textField($model, 'email', array('class'=>'input-xlarge')); ?>
	    <?php echo $form->error($model, 'email'); ?>

	    <?php echo $form->labelEx($model, 'subject'); ?>
	    <?php echo $form->textField($model, 'subject', array('maxlength' => 128, 'class'=>'input-xlarge')); ?>
	    <?php echo $form->error($model, 'subject'); ?>

	    <?php echo $form->labelEx($model, 'message'); ?>
	    <?php echo $form->textArea($model, 'message', array('class'=>'input-xlarge', 'rows'=>6)); ?>
	    <?php echo $form->error($model, 'message'); ?>

	    <?php if (CCaptcha::checkRequirements()): ?>

		<?php echo $form->labelEx($model, 'verifyCode'); ?>
		<div>
		    <?php $this->widget('CCaptcha'); ?>
		    <?php echo $form->textField($model, 'verifyCode'); ?>
		</div>
		<div class="hint">Please enter the letters as they are shown in the image above.
		    <br/>Letters are not case-sensitive.</div>
		<?php echo $form->error($model, 'verifyCode'); ?>

	    <?php endif; ?>

    	<br><br>
	    <?php echo CHtml::submitButton('Submit', array('class' => 'btn btn-large')); ?>

	    <?php $this->endWidget(); ?>

	<?php endif; ?>


    </div>
</div>
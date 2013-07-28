<?php
$this->pageTitle = Yii::app()->name . ' - ' . UserModule::t("Change Password");
$minPwdLength = Yii::app()->params['minPwdLength'];
?>

<div class='row'>
    <div class='span12'>

	<h3><?php echo UserModule::t("Create a New Password"); ?></h3>

	<?php if (Yii::app()->user->hasFlash('recoveryMessage')): ?>
    	<div class="success">
		<?php echo Yii::app()->user->getFlash('recoveryMessage'); ?>
    	</div>
	<?php endif; ?>

	<?php echo CHtml::beginForm(); ?>

	<?php echo CHtml::errorSummary($form); ?>

	<p class="hint">
	    <?php echo UserModule::t("Password length: $minPwdLength characters or more."); ?>
	</p>

	<div class="control-group">
	    <div class="controls">
		<div class="input-prepend">
		    <span class="add-on">
			<i class="icon-key"></i>
		    </span>
		    <?php echo CHtml::activePasswordField($form, 'password', array('placeholder' => 'Create a Password')); ?>
		</div>
		<small class="text-warning message"></small>
	    </div>
	</div>


	<div class="control-group">
	    <div class="controls">
		<div class="input-prepend">
		    <span class="add-on">
			<i class="icon-key"></i>
		    </span>
		    <?php echo CHtml::activePasswordField($form, 'verifyPassword', array('placeholder' => 'Retype Your Password')); ?>
		</div>
		<small class="text-warning message"></small>
	    </div>
	</div>


	<div class='clear'></div>

	<?php echo CHtml::submitButton(UserModule::t("Save"), array('class' => 'btn btn-large')); ?>

	<?php echo CHtml::endForm(); ?>

    </div>
</div>
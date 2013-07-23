<?php $this->pageTitle=Yii::app()->name . ' - '.UserModule::t("Change Password"); ?>

<h1><?php echo UserModule::t("Change Password"); ?></h1>

<?php if (Yii::app()->user->hasFlash('recoveryMessage')): ?>
    <div class="success">
    <?php echo Yii::app()->user->getFlash('recoveryMessage'); ?>
    </div>
<?php endif; ?>

<div class="form">
<?php echo CHtml::beginForm(); ?>

	<?php echo CHtml::errorSummary($form); ?>
	
	<div class="row">
	<?php echo CHtml::activeLabelEx($form,'password'); ?>
	<?php echo CHtml::activePasswordField($form,'password'); ?>
	<p class="hint">
	<?php echo UserModule::t("Minimal password length 4 symbols."); ?>
	</p>
	</div>
	
	<div class="row">
	<?php echo CHtml::activeLabelEx($form,'verifyPassword'); ?>
	<?php echo CHtml::activePasswordField($form,'verifyPassword'); ?>
	</div>
	
	
	<div class="row submit">
	<?php echo CHtml::submitButton(UserModule::t("Save")); ?>
	</div>

<?php echo CHtml::endForm(); ?>
</div><!-- form -->
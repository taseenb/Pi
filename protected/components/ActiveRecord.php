<?php

class ActiveRecord extends CActiveRecord {

    /**
     * Automatically fills create_time and update_time AR attributes
     * when creating or updating a record.
     * @return CActiveRecord parent class static method
     */
    protected function beforeValidate() {
	if ($this->isNewRecord) {
	    $this->create_time = $this->update_time = time();
	    if (!$this->update_time)
		$this->update_time = time();
	}
	else {
	    $this->update_time = time();
	}
	return parent::beforeValidate();
    }

    /**
     * Get only safe attributes from a model (for example, hide passwords and internal data).
     * @param array $protectedFields List of strings with attributes to hide.
     */
    public function getSafeAttributes($protectedFields) {
	$safe = array();
	foreach ($this->getAttributes() as $key => $value) {
	    if (!in_array($key, $protectedFields)) {
		$safe[$key] = $value;
	    }
	}
	return $safe;
    }
    
    
    /**
     * Remove the Captcha session (used onAfterSave).
     * This is a WORKAROUND to avoid captcha image to be kept after a successful save.
     */
    protected function removeCaptchaSession()
    {
	$session = Yii::app()->session;
	$prefixLen = strlen(CCaptchaAction::SESSION_VAR_PREFIX);
	foreach ($session->keys as $key)
	{
	    if (strncmp(CCaptchaAction::SESSION_VAR_PREFIX, $key, $prefixLen) == 0)
		$session->remove($key);
	}
    }
    
    /**
     * After save event.
     * @param type $event
     */
    protected function afterSave() {
	$this->removeCaptchaSession();
	parent::afterSave();
    }
    
    
    
    /**
     * Tells wether a Pi model (Collection, Project or Tab) belongs to the current logged user.
     * @return {boolean} True if the current user is the owner of the model.
     */
    public function belongsToUser() {
	$class = get_class($this);
	$userId = Yii::app()->user->getId();
	switch ($class)
	{
	    case "Collection":
		return $userId == $this->user_id;
		break;
	    case "Project":
		return $userId == $this->collection->user_id;
		break;
	    case "Tab":
		return $userId == $this->project->collection->user_id;
		break;
	    default:
		return null;
	}
    }
    

}
<?php


/**
 * Model delete.
 */
class DeleteAction extends CAction
{

    public function run($id)
    {
	if (Pi::isValidUser())
	{
	    $model = $this->getController()->loadModel($id);
	    if ($model->belongsToUser())
	    {
		$delete = $model->delete();
		header('Content-type: application/json');
		echo CJSON::encode(array("success" => $delete));
	    }
	    else
		echo "This model does not belong to you.<br>";
	}
	else
	    echo "You should log in to delete this model.";
    }

}
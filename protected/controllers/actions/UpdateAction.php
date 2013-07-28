<?php


/**
 * Project model update.
 */
class UpdateAction extends CAction
{

    /**
     * These attributes CANNOT be updated by the user.
     * @var array $_protectedUpdate 
     */
    private $_protectedAttrs = array(
	"id", "create_time", "update_time"
    );

    /**
     * Get json input and save the attributes in the model.
     * @param type $id Tab id to update.
     * @throws HttpException If save() fails throw an error.
     */
    public function run($id)
    {
	$controller = $this->getController();

	$patch = Yii::app()->request->getPatch();

	// Get json
	// $patch = Json::getArray();

	if (!empty($patch))
	{
	    // Get Tab model
	    $model = $controller->loadModel($id);
	    // Only get existing model attributes
	    $modelAttrs = array_intersect_key($patch, $model->attributes);
	    // Only get safe attributes
	    $safeAttrs = array_diff($modelAttrs, $this->_protectedAttrs);
	    
	    // Convert booleans to integers
	    $safeAttrs = Helper::boolToInt($safeAttrs);

	    if (!empty($safeAttrs))
	    {
		$model->attributes = $safeAttrs;
		if ($model->save())
		{
		    header('Content-type: application/json');
		    $safeAttrs["success"] = true;
		    echo CJSON::encode($safeAttrs);
		}
		else
		{
		    //echo Helper::getErrorsString($model->getErrors());
		    throw new HttpException(500, Helper::getErrorsString($model->getErrors()));
		}
	    }
	}
    }


}
<?php


/**
 * Project model create.
 */
class CreateAction extends CAction
{

    /**
     * These attributes CANNOT be created by the user.
     * @var array $_protectedAttrs 
     */
    private $_protectedAttrs = array(
	"id", "create_time", "update_time"
    );

    /**
     * Get json input and create a new model.
     * @throws HttpException If save() fails throw an error.
     */
    public function run()
    {
	// Get json
	$json = Json::getArray();

	if (!empty($json))
	{
	    $controller = $this->getController();
	    $modelClass = ucfirst($controller->getId());
	    // Get Tab model
	    $model = new $modelClass;
	    // Only get existing model attributes
	    $modelAttrs = array_intersect_key($json, $model->attributes);
	    // Only get safe attributes
	    $safeAttrs = array_diff($modelAttrs, $this->_protectedAttrs);

	    $model->attributes = $safeAttrs;

	    if ($model->save())
	    {
		header('Content-type: application/json');
		$safeAttrs["id"] = (integer) $model->id;
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
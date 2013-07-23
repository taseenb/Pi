<?php


/**
 * Collection model read.
 * Reply with a Json representation of a Collection.
 * Mandatory parameter:
 * - id (int) The Collection id/primary key.
 * 
 * Optional parameters can be provided through GET or POST:
 * - children (int) If it should contain also children data: the Projects (1) and Tabs (2).
 */
class CollectionReadAction extends CAction
{

    public function run($id=null)
    {
	// Get children and parent optional parameters through GET or POST
	$children = (integer) request()->getParam('children');

	if(Pi::isValidUser())
	{
	    $collection = $this->getController()->loadModel($id);
	    if ($collection->belongsToUser())
	    {
		header('Content-type: application/json');
		echo Pi::getDataFromCollection($collection, 0, $children);
	    }
	    else
		echo "This collection does not belong to you.<br>";
	}
	else
	    echo "You should log in to see this collection.";
    }

}
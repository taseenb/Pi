<?php


/**
 * Collection model read.
 * Reply with a Json representation of a Collection or several collections.
 * @param {int} id The Collection id/primary key. If not proveded, 
 * all collections of the current user will be returned.
 * 
 * Optional parameters can be provided through GET or POST:
 * GET or POST @param {int} children How many levels of children models 
 * should be returned: 1 for Projects, 2 for Projects and Tabs.
 */
class CollectionReadAction extends CAction
{

    public function run($id = null)
    {
	// Get children and parent optional parameters through GET or POST
	$children = (integer) request()->getParam('children');

	if (Pi::isValidUser())
	{
	    if ($id == null)
	    {
		header('Content-type: application/json');
		echo Pi::getCollectionsFromUser();
	    }
	    else
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
	}
	else
	    echo "You should log in to see this collection.";
    }

}
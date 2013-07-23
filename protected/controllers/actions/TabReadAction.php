<?php


/**
 * Tab model read.
 * Reply with a Json representation of a Tab.
 * Mandatory parameter:
 * - id (int) The Tab id/primary key.
 * 
 * Optional parameters can be provided through GET or POST:
 * - parent (int) If it should contain also parent model data: the tab Project (1) and Collection (2).
 */
class TabReadAction extends CAction
{

    public function run($id=null)
    {
	// Get children and parent optional parameters through GET or POST
	$parents = (integer) request()->getParam('parents');

	if(Pi::isValidUser())
	{
	    $tab = $this->getController()->loadModel($id);
	    if ($tab->belongsToUser())
	    {
		header('Content-type: application/json');
		echo Pi::getDataFromTab($tab, $parents);
	    }
	    else
		echo "This tab does not belong to one of your projects.<br>";
	}
	else
	    echo "You should log in to see this tab.";
    }

}
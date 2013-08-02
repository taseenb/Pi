<?php


/**
 * Tab model read.
 * Reply with a Json representation of a Tab.
 * Mandatory parameter:
 * @param {integer} id The Tab id/primary key.
 */
class TabReadAction extends CAction
{

    public function run($id)
    {
	if(Pi::isValidUser())
	{
	    $tab = $this->getController()->loadModel($id);
	    if ($tab->belongsToUser())
	    {
		header('Content-type: application/json');
		echo Pi::getDataFromTab($tab);
	    }
	    else
		echo "This tab does not belong to one of your projects.<br>";
	}
	else
	    echo "You should log in to see this tab.";
    }

}
<?php


/**
 * Project model read.
 * Reply with a Json representation of a Project.
 * Mandatory parameter:
 * - id (int) The Project id/primary key.
 * 
 * Optional parameters can be provided through GET or POST:
 * - children (int) If it should contain also children data: the project Tabs (1).
 * - parent (int) If it should contain also parent model data: the project Collection (1).
 */
class ProjectReadAction extends CAction
{

    public function run($id=null, $children=null, $parents=null)
    {
	// Set defaults (get children, not parent)
	is_null($children) ? $children = 1 : (integer) $children;
	is_null($parents) ? $parents = 0 : (integer) $parents;

	if(Pi::isValidUser())
	{
	    if ($id==null) {
		header('Content-type: application/json');
		echo Pi::getProjectsFromUser();
	    }
	    else
	    {
		$project = $this->getController()->loadModel($id);
		if ($project->belongsToUser())
		{
		    header('Content-type: application/json');
		    echo Pi::getDataFromProject($project, $parents, $children);
		}
		else
		    echo "This project does not belong to one of your collections.<br>";
	    }
	}
	else
	    echo "You should log in to see this/these project/s.";
    }

}
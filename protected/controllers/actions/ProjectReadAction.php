<?php

//use Pi;


/**
 * Project model read.
 * Reply with a Json representation of a Project.
 * @param {integer} id The Project id/primary key.
 * @param {boolean} tabs If it should contain also tabs data:.
 */
class ProjectReadAction extends CAction
{
    public function run($id=null, $tabs=true)
    {
	if(Pi::isValidUser())
	{
	    if ($id==null) {
		header('Content-type: application/json');
		echo Pi::getProjectsFromUser(Pi::getUser(), $tabs);
	    }
	    else
	    {
		$project = $this->getController()->loadModel($id);
		if ($project->belongsToUser())
		{
		    header('Content-type: application/json');
		    echo Pi::getDataFromProject($project, $tabs);
		}
		else
		    echo "This project does not belong to one of your collections.<br>";
	    }
	}
	else
	    echo "You should log in to see this/these project/s.";
    }

}
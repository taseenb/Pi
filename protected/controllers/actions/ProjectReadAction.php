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
    public function run($id = null, $tabs = true, $ownedByUser = false, $top = null, $page = 0)
    {
	if (!$id)
	{
	    if ($ownedByUser)
	    {
		if (Pi::isValidUser())
		{
		    header('Content-type: application/json');
		    echo Pi::getProjectsFromUser(Pi::getUser(), $tabs);
		}
		else
		    echo "You should log in to see this/these project/s.";
	    }
	    else
	    {
		if (in_array($top, Pi::$validTopValues)) {
		    header('Content-type: application/json');
		    echo Pi::getTopProjects($top);
		}
		else
		    echo "Invalid top value.";
	    }
	}
	else
	{
	    $project = $this->getController()->loadModel($id);
	    if ($project) { 
		if ($project->belongsToUser() || $project->public)
		{
		    header('Content-type: application/json');
		    echo Pi::getDataFromProject($project, $tabs);
		}
		else
		    echo "This project is private.";
	    }
	    else
		echo "The project requested does not exist.";
	}
    }

    
//    public function run($id=null, $tabs=true, $ownedByUser=false, $top=null)
//    {
//	if(Pi::isValidUser())
//	{
//	    if ($id==null) {
////		VarDumper::dump(Pi::getProjectsFromUser(Pi::getUser(), $tabs, false));
//		header('Content-type: application/json');
//		echo Pi::getProjectsFromUser(Pi::getUser(), $tabs);
//	    }
//	    else
//	    {
//		$project = $this->getController()->loadModel($id);
//		if ($project->belongsToUser())
//		{
//		    header('Content-type: application/json');
//		    echo Pi::getDataFromProject($project, $tabs);
//		}
//		else
//		    echo "This project does not belong to one of your collections.<br>";
//	    }
//	}
//	else
//	    echo "You should log in to see this/these project/s.";
//    }

}
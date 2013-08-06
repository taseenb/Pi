<?php


class EmbedController extends ControllerEmbed
{

    public $defaultAction = 'run';

    public function actionRun($id)
    {
	// Load js + css
	$cs = Yii::app()->clientScript;
	$baseLibUrl = Yii::app()->baseUrl;
	$cs->registerScriptFile($baseLibUrl . "/scripts/lib/processing/processing-1.4.1.min.js");
	$cs->registerCssFile(theme() . "/css/embed.css");
	
	// Get code
	if ($id && !request()->isPostRequest) {
	    $project = Project::model()->findByPk($id);
	    if ($project) {
		$code = "";
		foreach ($project->tabs as $tab) {
		    $code .= $tab->code;
		}
		$this->render("run", array('name'=>$project->name,'id'=>$id,'code'=>$code));
	    }
	    else
	    {
		$this->render("empty");
	    }
	}
	else if (request()->isPostRequest && request()->isAjaxRequest && is_string($id)) {
	    $this->render("run", array('code'=>$id));
	}
    }
    
    
    
    
    public function actionTab($id) {
	// Load js + css
	$cs = Yii::app()->clientScript;
	$baseLibUrl = Yii::app()->baseUrl;
	$cs->registerScriptFile($baseLibUrl . "/scripts/lib/ready/ready.min.js");
	$cs->registerScriptFile($baseLibUrl . "/scripts/lib/ace-builds/src-noconflict/ace.js");
	$cs->registerCssFile(theme() . "/css/embed_tab.css");
	
	// Get code
	$tab = Tab::model()->findByPk($id);
	if (is_string($tab->code)) {
	    $this->render("tab", array('tab'=>$tab));
	}
	else
	{
	    echo "Ooops. This code does not exist.";
	}
    }

}
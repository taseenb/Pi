<?php


class BootstrapAction extends CAction
{

    public function run()
    {
	$json = Pi::getUserBootstrap();
	$this->getController()->render('bootstrap', array(
	    'bootstrapUserData' => $json
	));
    }

}
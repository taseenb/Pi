<?php

$yii = dirname(__FILE__) . '/../shared/yii_framework/yiilite.php';
$config = dirname(__FILE__) . '/protected/config/main.php';

// Globals
require_once(dirname(__FILE__) . '/globals.php');

// remove the following lines when in production mode
defined('YII_DEBUG') or define('YII_DEBUG', false);
// specify how many levels of call stack should be shown in each log message
// defined('YII_TRACE_LEVEL') or define('YII_TRACE_LEVEL',3);

require_once($yii);
Yii::createWebApplication($config)->run();

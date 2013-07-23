<?php
/**
 * This is the shortcut to DIRECTORY_SEPARATOR
 */
defined('DS') or define('DS',DIRECTORY_SEPARATOR);
 
/**
 * This is the shortcut to Yii::app()
 */
function app()
{
    return Yii::app();
}

/**
 * This is the shortcut to Yii::app()->request
 */
function request()
{
    return Yii::app()->request;
}
 
/**
 * This is the shortcut to Yii::app()->clientScript
 */
//function cs()
//{
//    // You could also call the client script instance via Yii::app()->clientScript
//    // But this is faster
//    return Yii::app()->getClientScript();
//}
 
/**
 * This is the shortcut to Yii::app()->user.
 */
function user() 
{
    return Yii::app()->getUser();
}
 
/**
 * This is the shortcut to Yii::app()->createUrl()
 */
function url($route,$params=array(),$ampersand='&')
{
    return Yii::app()->createUrl($route,$params,$ampersand);
}
 
/**
 * This is the shortcut to CHtml::encode
 */
function h($text)
{
    return htmlspecialchars($text,ENT_QUOTES,Yii::app()->charset);
}
 
/**
 * This is the shortcut to CHtml::link()
 */
function l($text, $url = '#', $htmlOptions = array()) 
{
    return CHtml::link($text, $url, $htmlOptions);
}


/**
 * This is the shortcut to CHtml::image()
 */
function img($src, $alt = '', $htmlOptions = array()) {
    return CHtml::image($src, $alt, $htmlOptions);
}

 
/**
 * This is the shortcut to Yii::t() with default category = 'app'
 */
function t($message, $category = 'app', $params = array(), $source = null, $language = null) 
{
    return Yii::t($category, $message, $params, $source, $language);
}
 
/**
 * This is the shortcut to Yii::app()->request->baseUrl
 * If the parameter is given, it will be returned and prefixed with the app baseUrl.
 */
function bu($url=null) 
{
    static $baseUrl;
    if ($baseUrl===null)
        $baseUrl=Yii::app()->getRequest()->getBaseUrl();
    return $url===null ? $baseUrl : $baseUrl.'/'.ltrim($url,'/');
}

/**
 * This is the shortcut to Yii::app()->theme->baseUrl
 * If the parameter is given, it will be returned and prefixed with the app baseUrl.
 */
function theme($url=null) 
{
    static $baseUrl;
    if ($baseUrl===null)
        $baseUrl=Yii::app()->theme->baseUrl;
    return $url===null ? $baseUrl : $baseUrl.'/'.ltrim($url,'/');
}


 
/**
 * Returns the named application parameter.
 * This is the shortcut to Yii::app()->params[$name].
 */
function param($name) 
{
    return Yii::app()->params[$name];
}


/**
 * Returns the current language.
 */

function lang() {
    return Yii::app()->language;
}


/**
 * Returns shared absolute path.
 */
function shared() {
    return Yii::app()->theme->basePath . "/views/shared/";
}



/**
 * Calls Yii::log($var, 'error');
 */
function debug($var) {
    Yii::log($var, 'error');
}



/**
 * Returns the token name for CSRF.
 */
function csrfTokenName() {
    return Yii::app()->request->csrfTokenName;
}
/**
 * Returns the token for CSRF.
 */
function csrfToken() {
    return Yii::app()->request->getCsrfToken();
}





<?php


class Pi extends CComponent
{
    /**
     * Store whether the user exists and is active.
     * @var boolean True if the user is valid. 
     */
    private static $_user;

    private static $_isValidUser;

    /**
     * Check whether the user exists and is active.
     * @return boolean True if the user is valid. 
     */
    public static function isValidUser()
    {
	if (!isset(self::$_isValidUser))
	{
	    $user = self::getUser();
	    self::$_isValidUser = $user && ($user->status == User::ACTIVE);
	}
	return self::$_isValidUser;
    }

    /**
     * Get the user data (active record).
     */
    public static function getUser()
    {
	if (!isset(self::$_user))
	{
	    $userId = Yii::app()->user->getId();
	    self::$_user = User::model()->findByPk($userId);
	}
	return self::$_user;
    }

    /**
     * Get a json string from a Project active record, with related parents and children models.
     * @param object $project Project active record object.
     * @param {int} $parents Levels of parent models (ie: collection is 2 levels from a tab).
     * @param {int} $children Levels of children models (ie: projects are 1 level from collection).
     * @param {boolean} $json Whether to encode the resulting array in json. Default true;
     * @return {json or array} Json or array representation of the records.
     */
    public static function getDataFromProject($project, $tabs = true, $json = true)
    {
	$p = $project->attributes;
	// Add tabs if children are requested
	if ($tabs)
	{
	    $p['tabs'] = array();
	    foreach ($project->tabs as $tab)
	    {
		array_push($p['tabs'], $tab->attributes);
	    }
	}
	return $json ? CJSON::encode($p) : $p;
    }

    /**
     * Get a json string from a Tab active record, with related parents and children models.
     * @param object $tab Tab active record object.
     * @param {int} $parents Levels of parent models (ie: collection is 2 levels from a tab).
     * @param {int} $children Levels of children models (ie: projects are 1 level from collection).
     * @param {boolean} $json Whether to encode the resulting array in json. Default true;
     * @return {json or array} Json or array representation of the records.
     */
    public static function getDataFromTab($tab, $json = true)
    {
	$t = $tab->attributes;
	return $json ? CJSON::encode($t) : $t;
    }

    /**
     * Get all the projects of the user.
     * @param {boolean} $json Whether to encode the resulting array in json. Default true;
     * @return {json or array} Json or array representation of the records.
     */
    public static function getProjectsFromUser($user, $withTabs = false, $json = true, $onlyOpenProjects = false)
    {
	$p = array();
	foreach ($user->projects as $project)
	{
	    if (!$onlyOpenProjects || $project->open)
	    {
		$projectArray = self::getDataFromProject($project, $withTabs ? 1 : 0, false);
		array_push($p, $projectArray);
	    }
	}
	return $json ? CJSON::encode($p) : $p;
    }

    /**
     * Get User data + his/her collections and open projects.
     */
    public static function getUserBootstrap($json = true)
    {
	if (!Yii::app()->user->isGuest && self::isValidUser())
	{
	    $user = self::getUser();

	    $array = array(
		'isGuest' => false,
		'user' => array(),
		'profile' => array(),
		'collections' => array(),
	    );

	    // User array
	    $array['user'] = array(
		'id' => $user->id,
		'username' => $user->username,
		'email' => $user->email,
		'old_lastvisit_at' => $user->lastvisit_at,
		'lastvisit_at' => time(),
		'status' => $user->status,
		'default_collection' => $user->default_collection,
		'create_time' => $user->create_time,
		'update_time' => $user->update_time,
	    );

	    // Profile array
	    $protectedFields = array("user_id", "create_time", "update_time");
	    foreach ($user->profile as $key => $value)
	    {
		if (!in_array($key, $protectedFields))
		{
		    $array['profile'][$key] = $value;
		}
	    }
	    // Projects (only open)
	    $array['projects'] = self::getProjectsFromUser($user, false, false, true);
	}
	else
	{
	    // User is guest or not active or banned
	    $array = array(
		'isGuest' => true,
		'username' => 'Guest',
	    );
	}
	return $json ? CJSON::encode($array) : $array;
    }

}
<?php
$root = realpath(dirname(__FILE__) . '/../..');

// Secrets file
// IMPORTANT: Must be created and included in .gitignore!
$secrets = require($root . '/secrets.php');

/**
	 * This file contains local application parameters.
	 * To get this parameters in the application use ---> Yii::app()->params[$name]
 */
// please notice the order of the merged arrays. It is important and reflectes an ineritance hirarchy in a sense
$paramsLocal = file_exists($configRoot . '/params-local.php') ? require($configRoot . '/params-local.php') : array();

return CMap::mergeArray(array(
	/**
	 * MySQL database connection settings
	 * ======================================================
	 */
	'db.host' => $secrets['db.host'],
	'db.name' => $secrets['db.name'],
	'db.username' => $secrets['db.username'],
	'db.password' => $secrets['db.password'],
	// 'db.unix_socket' => $secrets['db.unix_socket'],
	'db.tablePrefix' => 'pi_',
	/**
	 * 
	 * Emails.
	 * ======================================================
	 */
	'infoEmail' => $secrets['email.info'],
	'adminEmail' => $secrets['email.admin'],
	/**
	 * 
	 * SMTP settings
	 * ======================================================
	 */
	'Host' => $secrets['email.host'],
	'Username' => $secrets['email.username'],
	'Password' => $secrets['email.password'],
	'SMTPSecure' => "ssl",
	'SMTPAuth' => true,
	'Port' => 465,
	/**
	 * 
	 * Security settings
	 * ======================================================
	 */
	/**
	 * Minimum allowed length for a user's password.
	 */
	'minPwdLength' => 6,
	/**
	 * 
	 * App settings
	 * ======================================================
	 */
	'sandbox' => $secrets['sandbox'],
	'finderItemsPerPage' => 10,
	'publicDirName' => 'files',
	'defaultAvatarFileName' => 'default_avatar.gif',
	'defaultPreviewFileName' => 'default_sketch.jpg',
	'previewFileName' => 'processing_ideas_preview_'

), $paramsLocal);

<?php


class Helper extends CComponent
{

    /**
     * Get a one line string from an array of validation errors.
     */
    public static function getErrorsString($array)
    {
	$errors = "";
	foreach ($array as $key => $errorsList)
	{
	    foreach ($errorsList as $value)
	    {
		$errors .= $value;
	    }
	}
	return $errors;
    }

}
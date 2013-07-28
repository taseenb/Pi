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

    /**
     * Convert spaces in _ and removes any special charactar from the string.
     * @param {string} $string The string.
     * @return {sting} A clean string.
     */
    public static function removeSpecialChars($string)
    {
	$string = str_replace(" ", "-", $string); // Replaces all spaces with hyphens.
	$string = preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
	return preg_replace('/-+/', '-', $string); // Replaces multiple hyphens with single one.
    }

    /**
     * Given an array, convert all boolean values to integers.
     */
    public static function boolToInt($array)
    {
	if (is_array($array)) {
	    foreach ($array as $key => $value)
	    {
		if (is_bool($value))
		    $array[$key] = (int) $value;
	    }
	    return $array;
	}
	else
	    return false;
    }

}
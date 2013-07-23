<?php


class Json extends CJSON
{

    /**
     * Decode JSON into a Php array.
     * @return array Representation of json input as an array.
     */
    public static function getArray()
    {
	return CJSON::decode(Yii::app()->request->getRawBody(), true);
    }

    /**
     * Decode JSON into Php variables.
     * @return mixed 
     */
    public static function getMixed()
    {
	return CJSON::decode(Yii::app()->request->getRawBody());
    }

}
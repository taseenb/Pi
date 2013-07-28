<?php


/**
 * File System helper class.
 */
class F extends CComponent
{

    /**
     * Removes a directory and all its subdirectories.
     * @param type $dir The directory path.
     * @return boolean True if directory was successfully removed.
     */
    public static function recursiveRmdir($dir)
    {
	if (substr($dir, -1) == "/")
	    $dir = substr($dir, 0, -1);
	if (is_dir($dir))
	{
	    $objects = scandir($dir);
	    foreach ($objects as $object)
	    {
		if ($object != "." && $object != "..")
		{
		    if (filetype($dir . "/" . $object) == "dir")
			self::recursiveRmdir($dir . "/" . $object);
		    else
			unlink($dir . "/" . $object);
		}
	    }
	    reset($objects);
	    if (rmdir($dir))
	    {
		return true;
	    }
	}
    }

    /**
     * Delete file or directory.
     * @param type $file File or directory path.
     * @return boolean True if succeded or if file does not exist.
     */
    public static function delete($file)
    {
	if (file_exists($file))
	{
	    if (is_dir($file))
	    {
		return rmdir($file);
	    }
	    else if (is_file($file))
	    {
		return unlink($file);
	    }
	}
	else
	{
	    return true;
	}
    }

    /**
     * Create a directory.
     * @param type $dir Path to the directory.
     * @return boolean True if directory already exists and if creation was successful.
     */
    public static function makeDir($dir)
    {
	if (file_exists($dir))
	{
	    return true;
	}
	else
	{
	    if (mkdir($dir, 0755, true))
		return true;
	}
    }

    /**
     * Create a public writable directory or make an existing directory writable (777).
     * @param type $dir Path to the directory.
     * @return boolean True if succeded.
     */
    public static function makeWritableDir($dir)
    {
	if (!file_exists($dir))
	{
	    if (mkdir($dir, 0777, true))
		return true;
	} else if (!is_writable($dir))
	{
	    if (chmod($dir, 0777))
		return true;
	}
    }

    /**
     * Get a string of the file size formatted in MB.
     * @param integer $n The value to format.
     * @return string
     */
    public static function size($n)
    {
	return number_format($n / 1024 / 1024, 2) . ' MB';
    }

    /**
     * Remove the extension from a file name or path.
     * @param type $f File name or path.
     * @return string The file name or path without extension.
     */
    public static function removeExtension($f)
    {
	$ext = pathinfo($f, PATHINFO_EXTENSION);
	return $f = str_replace('.' . $ext, '', $f);
    }

    /**
     * Get the file extension from a file name or path.
     * @param type $fileName
     * @return type
     */
    public static function getFileExtention($fileName)
    {
	return pathinfo($fileName, PATHINFO_EXTENSION);
    }

    /**
     * Replace accents from a string (file name or path).
     * @param string $var
     * @return string
     */
    public static function replaceAccents($var)
    {
	$a = array('À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'ß', 'à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ', 'Ā', 'ā', 'Ă', 'ă', 'Ą', 'ą', 'Ć', 'ć', 'Ĉ', 'ĉ', 'Ċ', 'ċ', 'Č', 'č', 'Ď', 'ď', 'Đ', 'đ', 'Ē', 'ē', 'Ĕ', 'ĕ', 'Ė', 'ė', 'Ę', 'ę', 'Ě', 'ě', 'Ĝ', 'ĝ', 'Ğ', 'ğ', 'Ġ', 'ġ', 'Ģ', 'ģ', 'Ĥ', 'ĥ', 'Ħ', 'ħ', 'Ĩ', 'ĩ', 'Ī', 'ī', 'Ĭ', 'ĭ', 'Į', 'į', 'İ', 'ı', 'Ĳ', 'ĳ', 'Ĵ', 'ĵ', 'Ķ', 'ķ', 'Ĺ', 'ĺ', 'Ļ', 'ļ', 'Ľ', 'ľ', 'Ŀ', 'ŀ', 'Ł', 'ł', 'Ń', 'ń', 'Ņ', 'ņ', 'Ň', 'ň', 'ŉ', 'Ō', 'ō', 'Ŏ', 'ŏ', 'Ő', 'ő', 'Œ', 'œ', 'Ŕ', 'ŕ', 'Ŗ', 'ŗ', 'Ř', 'ř', 'Ś', 'ś', 'Ŝ', 'ŝ', 'Ş', 'ş', 'Š', 'š', 'Ţ', 'ţ', 'Ť', 'ť', 'Ŧ', 'ŧ', 'Ũ', 'ũ', 'Ū', 'ū', 'Ŭ', 'ŭ', 'Ů', 'ů', 'Ű', 'ű', 'Ų', 'ų', 'Ŵ', 'ŵ', 'Ŷ', 'ŷ', 'Ÿ', 'Ź', 'ź', 'Ż', 'ż', 'Ž', 'ž', 'ſ', 'ƒ', 'Ơ', 'ơ', 'Ư', 'ư', 'Ǎ', 'ǎ', 'Ǐ', 'ǐ', 'Ǒ', 'ǒ', 'Ǔ', 'ǔ', 'Ǖ', 'ǖ', 'Ǘ', 'ǘ', 'Ǚ', 'ǚ', 'Ǜ', 'ǜ', 'Ǻ', 'ǻ', 'Ǽ', 'ǽ', 'Ǿ', 'ǿ');
	$b = array('A', 'A', 'A', 'A', 'A', 'A', 'AE', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'D', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 's', 'a', 'a', 'a', 'a', 'a', 'a', 'ae', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'n', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y', 'A', 'a', 'A', 'a', 'A', 'a', 'C', 'c', 'C', 'c', 'C', 'c', 'C', 'c', 'D', 'd', 'D', 'd', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'G', 'g', 'G', 'g', 'G', 'g', 'G', 'g', 'H', 'h', 'H', 'h', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'IJ', 'ij', 'J', 'j', 'K', 'k', 'L', 'l', 'L', 'l', 'L', 'l', 'L', 'l', 'l', 'l', 'N', 'n', 'N', 'n', 'N', 'n', 'n', 'O', 'o', 'O', 'o', 'O', 'o', 'OE', 'oe', 'R', 'r', 'R', 'r', 'R', 'r', 'S', 's', 'S', 's', 'S', 's', 'S', 's', 'T', 't', 'T', 't', 'T', 't', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'W', 'w', 'Y', 'y', 'Y', 'Z', 'z', 'Z', 'z', 'Z', 'z', 's', 'f', 'O', 'o', 'U', 'u', 'A', 'a', 'I', 'i', 'O', 'o', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'A', 'a', 'AE', 'ae', 'O', 'o');
	$var = str_replace($a, $b, $var);
	return $var;
    }

    
    
    
    
    
    
    
    
    
    
    /**
     * Manage uploaded files within an AR model + rename and copy the
     * file into the public folder.
     * @param type $model
     * @param type $attribute
     * @return boolean
     */
    public static function uploadFile($model, $attribute = "file", $id = null, $attachment = false, $name = null, $overwrite = false)
    {

	$file = CUploadedFile::getInstance($model, $attribute);

	if ($file)
	{

	    // Set directory (subdirectory of "media" folder).
	    $defaultDir = strtolower(get_class($model)) . date('yW');
	    $dir = $folder ? $folder : $defaultDir;

	    // Get extension and create a new file name.
	    $ext = $file->getExtensionName();
	    $id = $id ? $id : self::uniqId();
	    $newFilename = self::createFileName($ext, $id, $name, $model);

	    // Load file data into the model.
	    $model->filename = $newFilename;
	    if ($attachment)
	    {
		$model->folder = param('publicFolder') . DS . strtolower(get_class($model));
	    }
	    else
	    {
		$model->folder = $dir;
	    }
	    $model->filesize = $file->getSize();
	    $model->filetype = $file->getType();

	    // Get public folder absolute path and make dir if ncessary.
	    $absPath = ArtManager::getMediaAbsolutePath() . $model->folder . DS;
	    self::makeWritableDir($absPath);
	    $path = $absPath . $newFilename;


	    if ($overwrite)
	    {
		if ($file = $file->saveAs($path))
		{
		    chmod($path, 0755);
		    return $file;
		}
		else
		{
		    Yii::log("Error while saving an uploaded file - overwrite was true.", "error");
		    return false;
		}
	    }
	    else
	    {
		if ($file = self::tryToSave($file, $path, $id))
		{
		    return $file;
		}
		else
		{
		    Yii::log("Error while trying to save an uploaded file.", "error");
		    return false;
		}
	    }
	}
	else
	{
	    Yii::log("Uploaded file is not valid or does not exist.", "error");
	    return false;
	}
    }

    /**
     * Create a new file name.
     */
    public static function createFileName($ext, $id = null, $name = null, $model = null)
    {

	$id = $id ? $id : self::uniqId();

	if ($name)
	{
	    $basicName = $name;
	}
	else if (isset($model->{'name_' . lang()}))
	{
	    $basicName = $model->{'name_' . lang()};
	}
	else if (isset($model->name))
	{
	    $basicName = $model->name;
	}
	else
	{
	    $basicName = "";
	}

	if ($basicName && strlen($basicName) > 2)
	{
	    $newFilename = self::createSeoFileName($basicName, true) . "-galeriecharlot";
	    $newFilename .= $id ? "-" . $id : "-" . $uniqId;
	    $newFilename .= "." . $ext;
	}
	else if (!is_null($model))
	{
	    $newFilename = get_class($model) . "-galeriecharlot";
	    $newFilename .= $id ? "-" . $id : "-" . $uniqId;
	    $newFilename .= "." . $ext;
	}
	else
	{
	    $newFilename = "galeriecharlot-" . $uniqId . "." . $ext;
	}

	return $newFilename;
    }

    /**
     * 
     * @param type $fileName
     * @param type $title
     * @return string 
     */
    public static function createSeoFileName($title = "", $isFileName = false)
    {
	if ($title == "")
	{
	    return date("Ymd");
	}
	else
	{
	    /**
	     *  remove extension, spaces and last dot, and repeated "---"
	     */
	    $title = str_replace(array(" ", "\n", "<br>", "&amp;", "&"), "-", $title);
	    $title = str_replace(array("------", "-----", "----", "---", "--"), "-", $title);
	    /**
	     *  replace accents
	     */
	    $title = self::replaceAccents($title);
	    /**
	     *  delete and replace rest of special chars
	     */
	    // $search = array('/[^a-z0-9\-<>]/', '/[\-]+/', '/<[^>]*>/');
	    $search = array('/[^A-Za-z0-9\-<>]/', '/<[^>]*>/');
	    $replace = array('', '', '');
	    $title = preg_replace($search, $replace, $title);
	    /**
	     *  limit filename and title to 20 chars and remove repeated "---"
	     */
	    if ($isFileName)
	    {
		$title = strtolower($title);
		$title = (strlen($title) > 20) ? substr($title, 0, 20) : $title;
	    }

	    return $title;
	}
    }

    /**
     * Create an unique id (shorter and more flexible than php uniqid()).
     */
    public static function uniqId()
    {
	return base_convert(rand(9999, 99999999), 10, rand(14, 36));
    }

    /**
     * Recursive function that tries to save a file. If it finds an 
     * existing file with same path name it changes the unique id in the 
     * file name and tries to save again.
     */
    public static function tryToSave($file, $path, $id)
    {
	if (file_exists($path))
	{
	    $newId = self::uniqId();
	    $newPath = str_replace($id, $newId, $path);
	    self::tryToSave($file, $newPath, $newId);
	}
	else
	{
	    $saved = $file->saveAs($path);
	    chmod($path, 0755);
	    return $saved;
	}
    }

    /**
     * Create a SEO name from a model and a file instance.
     * @param AR $model
     * @param string $ext File extension.
     * @return string
     */
    public static function seoFileName($model, $ext)
    {
	// Create new file name.

	if (isset($model->{'name_' . lang()}))
	{
	    $modelName = $model->{'name_' . lang()};
	}
	else if (isset($model->name))
	{
	    $modelName = $model->name;
	}
	else
	{
	    $modelName = "";
	}
	if (strlen($modelName) > 8)
	{
	    return self::createSeoFileName($modelName, true) . "_galeriecharlot_" . date("isy") . "." . $ext;
	}
	else
	{
	    return get_class($model) . "_galeriecharlot_" . date("isy") . "." . $ext;
	}
    }

}
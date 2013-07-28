<?php

/**
 * This is the model class for table "{{tab}}".
 *
 * The followings are the available columns in table '{{tab}}':
 * @property integer $id
 * @property string $name
 * @property string $description
 * @property string $filename
 * @property string $filetype
 * @property integer $filesize
 * @property integer $trash
 * @property integer $create_time
 * @property integer $update_time
 *
 * The followings are the available model relations:
 * @property Project $project
 */
class File extends ActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return Code the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return '{{files}}';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('filename, filetype, filesize', 'required'),
			array('filesize, trash', 'numerical', 'integerOnly'=>true),
			array('name, description, trash', 'safe'),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, filename, filetype, filesize, trash, name, description', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
			'project' => array(self::BELONGS_TO, 'Project', 'preview_id'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'name' => 'Name',
			'description' => 'Description',
			'filename' => 'File Name',
			'filetype' => 'File Type',
			'filesize' => 'File Size',
			'trash' => 'In the Trash',
			'create_time' => 'Create Time',
			'update_time' => 'Update Time',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
	 */
	public function search()
	{
		// Warning: Please modify the following code to remove attributes that
		// should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);
		$criteria->compare('name',$this->name,true);
		$criteria->compare('description',$this->description,true);
		$criteria->compare('filename',$this->filename,true);
		$criteria->compare('filetype',$this->filetype,true);
		$criteria->compare('filesize',$this->filesize,true);
		$criteria->compare('trash',$this->trash,true);
		$criteria->compare('create_time',$this->create_time);
		$criteria->compare('update_time',$this->update_time);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
}
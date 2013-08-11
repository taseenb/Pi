<?php


/**
 * This is the model class for table "{{project}}".
 *
 * The followings are the available columns in table '{{project}}':
 * @property integer $id
 * @property integer $collection_id
 * @property string $name
 * @property string $description
 * @property integer $public
 * @property integer $minimized
 * @property integer $create_time
 * @property integer $update_time
 *
 * The followings are the available model relations:
 * @property Tab[] $tabs
 * @property Collection $collection
 */
class Project extends ActiveRecord
{

    /**
     * Returns the static model of the specified AR class.
     * @param string $className active record class name.
     * @return Project the static model class
     */
    public static function model($className = __CLASS__)
    {
	return parent::model($className);
    }

    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
	return '{{projects}}';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
	// NOTE: you should only define rules for those attributes that
	// will receive user inputs.
	return array(
	    array('name, user_id, open', 'required'),
	    array('user_id, public, maximized, minimized, open', 'numerical', 'integerOnly' => true),
	    array('name', 'length', 'max' => 255),
	    array('description', 'safe'),
	    // The following rule is used by search().
	    // Please remove those attributes that should not be searched.
	    array('id, user_id, name, description, public, open, minimized, maximized, create_time, update_time', 'safe', 'on' => 'search'),
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
	    'user' => array(self::BELONGS_TO, 'User', 'user_id', 'with' => 'profile'),
	    //'preview' => array(self::HAS_ONE, 'File', 'preview_id'),
	    'tabs' => array(self::HAS_MANY, 'Tab', 'project_id'),
	);
    }

    /**
     * Named scopes.
     */
    public function scopes()
    {
	return array(
	    'public' => array(
		'condition' => 'public=1',
	    ),
	    'featured' => array(
		'condition' => 'featured=1',
		'order' => 'update_time DESC, create_time DESC'
	    ),
	    'mostAppreciated' => array(
		'order' => 'likes DESC'
	    ),
	    'mostViewed' => array(
		'order' => 'views DESC'
	    ),
	    
//	    'mostRecent' => array(
//		'order' => 'create_time DESC',
//		'limit' => 5,
//	    ),
	);
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
	return array(
	    'id' => 'ID',
	    'collection_id' => 'Collection ID',
	    'name' => 'Name',
	    'description' => 'Description',
	    'public' => 'Public',
	    'minimized' => 'Minimized',
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

	$criteria = new CDbCriteria;

	$criteria->compare('id', $this->id);
	$criteria->compare('collection_id', $this->collection_id);
	$criteria->compare('name', $this->name, true);
	$criteria->compare('description', $this->description, true);
	$criteria->compare('minimized', $this->minimized);
	$criteria->compare('create_time', $this->create_time);
	$criteria->compare('update_time', $this->update_time);

	return new CActiveDataProvider($this, array(
	    'criteria' => $criteria,
	));
    }

}
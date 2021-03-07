<?php

  class Column{
    public $type ='',
            $label ='',
           $suffix = '';
    public $col ='';
    public $required = false, $unique = false;

    public function __construct($column_label, $column_data){
      $this->col = $column_data['col'];
      $this->type = $column_data['type'];
      $this->label = $column_data['label'];
      $this->suffix = $column_data['suffix'];
      $this->icon = $column_data['icon'];
      $this->required = $column_data['required'];
      $this->unique = $column_data['unique'];

      if(isset($column_data['path'])){
        $this->path = $column_data['path'];
      }
      if(isset($column_data['foreign'])){
        $this->foreign = $column_data['foreign'];
      }
    }

    function get_label(){
      return $this->label;
    }

    function get_name(){
      return $this->col;
    }
  }
 ?>

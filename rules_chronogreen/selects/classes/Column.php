<?php

  class Column{
    public $type ='', $label ='', $suffix = '';
    public $filterable = false;


    public function __construct($column_label, $column_data){
      $this->col = $column_data['col'];
      // $this->name = $column_name;
      $this->type = $column_data['type'];
      $this->label = $column_data['label'];
      $this->suffix = $column_data['suffix'];
      $this->filterable = $column_data['filterable'] || false;
      $this->icon = $column_data['icon'];
    }

    function get_label(){
      return $this->label;
    }

    function get_name(){
      return $this->name;
    }
  }
 ?>

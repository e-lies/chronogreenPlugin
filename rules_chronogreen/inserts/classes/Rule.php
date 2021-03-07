<?php

  require_once 'Column.php';
  class Rule{
    // public $name ='';
    public $table ='';
    public  $auth = [],  $columns = [];

    public function __construct($rule_name, $rule_data){
      $this->name = $rule_name;
      $this->table = $rule_data['table'];
      $this->auth = $rule_data['auth'];

      $this->constants = $rule_data['constants'];

      //
      if(isset($rule_data['path'])){
        $this->path = $rule_data['path'];
      }
      //
      //
      if(isset($rule_data['duplicate'])){
        $this->duplicate = $rule_data['duplicate'];
      }
      //
      //
      if(isset($rule_data['ignore'])){
        $this->ignore = $rule_data['ignore'];
      }
      if(isset($rule_data['populate'])){
        $this->populate = $rule_data['populate'];
      }

      // $this->where = $rule_data['where'];
      // $this->limit = $rule_data['limit'];
      foreach ($rule_data['columns'] as $column_label => $column_data) {
        $this->columns[$column_data['label']] = new Column($column_label, $column_data);
      }

      // foreach ($rule_data['columns'] as $column_name => $column_data) {
      //   $this->columns[$column_name] = new Column($column_name, $column_data);
      // }
    }

    public function get_name(){
      return $this->name;
    }
    public function get_table_name(){
      return $this->table;
    }
    public function get_columns(){
      return $this->columns;
    }
    public function get_column($col_name){
      $columns = $this->get_columns();
      foreach ($columns as $col) {
        if($col->col == $col_name){
          return $col;
        }
      }
      return false;
      // return ((isset($this->columns[$col_name])) ? $this->columns[$col_name] : false);
    }

  }

 ?>

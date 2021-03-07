<?php
  // this file is no longer needed
  require_once 'Rule.php';

  class Table{
    private $name;

    public $rules = [];

    public function __construct($table_name, $table_data){
      $this->name = $table_name;

      if(sizeof($table_data['rules']) > 0){
        foreach ($table_data['rules'] as $rule_name => $rule_data) {
          $this->append_rule(new Rule($rule_name, $rule_data));
        }
      }

    }

    public function get_name(){
      return $this->name;
    }
    public function append_rule(Rule $rule){
      if(!isset($this->rules[$rule->get_name()])){
        return $this->rules[$rule->get_name()] = $rule;
      }
      throw new Exception("Rule name already exists");
    }

    public function remove_rule(){

    }

    public function update_rule(Rule $rule){
      return $this->rules[$rule->get_name()] = $rule;
    }

    // Returns an array of rule objects
    public function get_rules(){
      return $this->rules;
    }

    // This is a json formatted string of rules
    public function get_rules_json(){
      return json_encode($this->get_rules());
    }
    public function rules_count(){
      return sizeof($this->get_rules());
    }
    public function save(){
      file_put_contents($this->file_url, $this->get_rules_json());
    }

  }
 ?>

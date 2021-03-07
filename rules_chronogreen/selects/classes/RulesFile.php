<?php

  require_once 'Rule.php';

  class RulesFile{
    private static $base_url = __DIR__.'/../rules/';
    // private static $base_url = __DIR__.'/../rules/';
    private $file_content ='', $file_url = '', $file_data ='', $hash ='';

    public $rules = [];

    public function __construct($db_name){
      $this->file_url = RulesFile::$base_url.$db_name.'.json';

      if(file_exists($this->file_url)){

        $this->file_content = file_get_contents($this->file_url);

      }else{
        $this->file_content = '{}';
        file_put_contents($this->file_url, $this->file_content);
      }

      $this->hash = md5($this->file_content);

      $this->file_data = json_decode($this->file_content, true);

      if(is_null($this->file_data)){
        throw new Exception('File is mal-formatted');
      }

      if(isset($this->file_data) && sizeof($this->file_data) > 0){
        foreach ($this->file_data as $rule_name => $rule_data) {
          $this->rules[$rule_name] = new Rule($rule_name, $rule_data);
        }
      }

    }


    public function get_rules(){
      return $this->rules;
    }
    public function get_rule($rule_name){
      return ((isset($this->rules[$rule_name])) ? $this->rules[$rule_name] : false);
    }
    public function get_rules_json(){
      return json_encode($this->get_rules());
    }

    public function append_rule(Rule $rule){
      if(!isset($this->rules[$rule->get_name()])){
        return $this->rules[$rule->get_name()] = $rule;
      }
      throw new Exception("Rule name already exists");
    }

    public function update_rule(Rule $rule){
      if(isset($this->rules[$rule->get_name()])){
        return $this->rules[$rule->get_name()] = $rule;
      }else{
        return $this->rules[$rule->get_name()] = $rule;
      }
      // throw new Exception("Rule doesnt exist");
    }

    public function delete_rule($rule_name){
      if(isset($this->rules[$rule_name])){
        unset($this->rules[$rule_name]);
        return true;
      }else{
        throw new Exception('Rule doesnt exist');
      }
    }

    public function rules_count(){
      return sizeof($this->get_rules());
    }


    public function save(){
      file_put_contents($this->file_url, $this->to_json());

    }
    // in case we wanted to save more details
    // public function to_json(){
    //   return json_encode($this);
    // }

    public function to_json(){
      return json_encode($this->get_rules());
    }
  }
 ?>

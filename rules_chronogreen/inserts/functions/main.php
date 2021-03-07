<?php

  // echo print_r(json_decode($_POST["data"], 1));
  // die();
  header('Content-Type: application/json');
  require_once '../classes/Rule.php';
  require_once '../classes/RulesFile.php';

  if(isset($_POST['action']) && !empty($_POST['action'])){
    $action = $_POST['action'];

    switch ($action) {
      case 'rule_add':
          $data = json_decode($_POST['data'], true);
          $database = $_POST['database'];
          $table = $_POST['table'];
          $rules_file = new RulesFile($database);
          try{
            $rules_file->append_rule(new Rule($data['rule_name'], $data));
            $rules_file->save();
            echo json_encode(array('success'=>true, 'message'=>'Rule was added', 'code'=>'200'));
          }catch(Exception $e){
            echo json_encode(array('success'=>false, 'message'=>$e->getMessage(), 'code'=>'500'));
          }
        break;

        case 'rule_edit':
            $data = json_decode($_POST['data'], true);
            $database = $_POST['database'];
            $table = $_POST['table'];
            $rules_file = new RulesFile($database);
            try{
              $rules_file->update_rule(new Rule($data['rule_name'], $data));
              $rules_file->save();
              echo json_encode(array('success'=>true, 'message'=>'Rule was updated', 'code'=>'200'));
            }catch(Exception $e){
              echo json_encode(array('success'=>false, 'message'=>$e->getMessage(), 'code'=>'500'));
            }
          break;
        case 'rule_clone':
            $data = json_decode($_POST['data'], true);
            $database = $_POST['database'];
            $table = $_POST['table'];
            $rules_file = new RulesFile($database);
            try{
              $rules_file->append_rule(new Rule($data['rule_name'], $data));
              $rules_file->save();
              echo json_encode(array('success'=>true, 'message'=>'Rule was cloned', 'code'=>'200'));
            }catch(Exception $e){
              echo json_encode(array('success'=>false, 'message'=>$e->getMessage(), 'code'=>'500'));
            }
          break;

        case 'rule_delete':
            $database = $_POST['database'];
            $rules_file = new RulesFile($database);
            try {
              $rules_file->delete_rule($_POST['rule_name']);
              $rules_file->save();
              echo json_encode(array('success'=>true, 'message'=>'Rule was deleted', 'code'=>'200'));
            } catch (Exception $e) {
              echo json_encode(array('success'=>false, 'message'=>$e->getMessage(), 'code'=>'500'));
            }

          break;
      default:
        // code...
        break;
    }
  }
 ?>

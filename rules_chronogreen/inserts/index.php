<?php

  require_once './functions/database.php';
  require_once './classes/RulesFile.php';

  $query = $pdo->prepare('show databases;');
  $query->execute(array());
  $databases_list = $query->fetchAll(PDO::FETCH_ASSOC);

  if(isset($_GET['database']) && !empty($_GET['database'])){
    $query = $pdo->prepare("SELECT TABLE_NAME
              FROM information_schema.tables
              WHERE information_schema.tables.TABLE_SCHEMA = ?;");
    $query->execute( array($_GET['database']) );

    $tables = $query->fetchAll(PDO::FETCH_NUM);

    $rules_file = new RulesFile($_GET['database']);
  }

?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css" rel="stylesheet">
    <style>
      .container {
          padding-top:10px;
      }
      .container .row .col.s2{
        padding-top: 15px;
      }
      table thead th:last-child{
        width: 20%;
      }
      .material-icons.small{
        font-size: 14pt;
      }
      table td:nth-child(3), table th:nth-child(3){
        text-align: center;
      }
    </style>
    <title>Inserts generation</title>
  </head>

  <body>
    <div class="container">
      <!-- show list of databases -->
      <form class="" action="index.php" method="get">
        <div class="row">
          <div class="col-lg-8">
              <select class="form-control" name="database">
                <option value="" disabled selected>Choose database</option>
                <?php foreach ($databases_list as $database): ?>
                  <?php if ($database['Database'] == $_GET['database']): ?>
                    <option selected value="<?php echo $database['Database']; ?>"><?php echo $database['Database']; ?></option>
                  <?php else: ?>
                    <option  value="<?php echo $database['Database']; ?>"><?php echo $database['Database']; ?></option>
                  <?php endif; ?>
                <?php endforeach; ?>
              </select>
          </div>
          <div class="col-lg-2">
            <button type="submit" class="btn btn-block btn-primary">Select database</button>
          </div>
          <div class="col-lg-2">
            <a
            <?php if (isset($_GET["database"])): ?>
              href="<?php echo 'export.php?database='.$_GET["database"] ?>"
              <?php else: ?>
                disabled
                href="#"
            <?php endif; ?>
             class="btn btn-block btn-success">Export rules file</a>
          </div>
        </div>
        <br />
      </form>
      <hr />
      <?php if (isset($_GET['database']) && !empty($_GET['database'])): ?>
        <div class="card">
          <div class="card-body">
            <h5>Add a new rule</h5>
            <form class="form" name="add_new_rule_form" id="add_new_rule_form" method="get" action="rule_add.php">
              <div class="row">
                <div class="col-lg-5">
                  <input required placeholder="Rule name" name="rule_name" type="text" class="form-control">
                </div>
                <div class="col-lg-5">
                  <input type="hidden" id="database" name="database" value="<?php echo $_GET['database']; ?>">
                  <select required name="table" id="" class="form-control">
                    <option value="">Select table</option>
                    <?php foreach ($tables as $table): ?>
                      <option value="<?php echo $table[0]; ?>"><?php echo $table[0]; ?></option>
                    <?php endforeach; ?>
                  </select>
                </div>
                <div class="col-lg-2">
                  <button class="btn btn-success btn-block">
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      <?php endif; ?>
      <br />

      <hr />

        <h4>List of existing rules</h4>
        <br />

        <table class="table table-striped" id="rules_table">
          <thead>
            <th>Rule</th>
            <th>Table</th>
            <th>Edit / Delete / Clone</th>
          </thead>
          <tbody>

          <?php if (isset($_GET['database']) && !empty($_GET['database'])): ?>
            <?php foreach ($rules_file->get_rules() as $rule): ?>
              <tr>
                <td><?php echo $rule->get_name(); ?></td>
                <td><?php  echo $rule->get_table_name();?></td>
                <td>
                  <a href="./rule_edit.php?database=<?php echo $_GET['database'] ?>&table=<?php echo $rule->get_table_name(); ?>&rule_name=<?php echo $rule->get_name(); ?>"><i class="small material-icons">create</i></a> |
                  <a href="#"  class="delete_rule" data-table-name="<?php  echo $rule->get_table_name();?>" data-rule-name="<?php echo $rule->get_name(); ?>"><i class="small material-icons">delete</i></a> |
                  <a href="./rule_clone.php?database=<?php echo $_GET['database'] ?>&table=<?php echo $rule->get_table_name(); ?>&rule_name=<?php echo $rule->get_name(); ?>"><i class="small material-icons">content_copy</i></a>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>


          </tbody>
        </table>
        <br />
        <br />
        <br />



    </div>

    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript">
      $("body").ready(function(e){

        $(document).ready( function () {
            $('#rules_table').DataTable();
        });

        $("a.delete_rule").click(function(e){
          if(!confirm('Are you sure ?')){
            return;
          }
          var row = $(this).parents().eq(1);

          var rule_name = $(this).data('rule-name');

          e.preventDefault();
          $.ajax({
            url:'./functions/main.php',
            method:'post',
            data:{'action':'rule_delete', rule_name, database:$("#database").val()},
            dataType:'json',
            success:function(response){
              alert(response.message);
              if(response.success){
                $(row).fadeOut(400, function(e){
                  $(row).remove();
                });
              }
            }
          });
        });
      });
    </script>
  </body>
</html>

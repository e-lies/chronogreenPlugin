<?php
  if(!isset($_GET['database']) || !isset($_GET['table']) || empty($_GET['database']) || empty($_GET['table'])){
    header('location: index.php');
  }

  require_once './functions/database.php';
  $query = $pdo->prepare('SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE FROM `COLUMNS` WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?;');
  $query->execute(array($_GET['database'], $_GET['table']));
  $columns_list = $query->fetchAll(PDO::FETCH_ASSOC);
  if (isset($_GET['rule_name'])) {
    // Cloning  an existing rule
  }
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" />
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">


    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
    .material-icons{
      font-size:14pt;
    }
      .container {
          padding-top:10px;
      }
      .table td{
        padding:15px;
      }
      .table td:nth-child(3){
        max-width: 100px;;
        word-wrap: break-word;


      }
      .table thead th:first-child{
        width: 10%;
      }
      .table thead th#suffix{
        width: 10%;
      }
      .auth{
        margin-bottom: 15px;
      }
      .auth_var{
        margin-bottom: 10px;
      }
    </style>
    <title>Table generation</title>
  </head>

  <body>
    <div class="container">
      <a href="index.php?database=<?php echo $_GET['database']; ?>">Go back</a>
      <br />
      <br />
      <h1>Adding a new rule</h1>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="./index.php?database=<?php echo $_GET['database']; ?>"><?php echo $_GET['database']; ?></a></li>
          <li class="breadcrumb-item active" aria-current="page"><a href="./index.php?database=<?php echo $_GET['database']; ?>&table=<?php echo $_GET['table']; ?>"><?php echo $_GET['table']; ?></a></li>
          <input type="hidden" id='table_name' value='<?php echo $_GET['table']; ?>'>
          <input type="hidden" id='database_name' value='<?php echo $_GET['database']; ?>'>

        </ol>
      </nav>
      <br />
      <div class="row">
        <div class="col-lg-6">
          <label for="rule_name">Rule name:</label>
          <input type="text" id='rule_name' placeholder="Rule name" class="form-control" value='<?php echo $_GET['rule_name']; ?>'>
        </div>

        <div class="col-lg-6">
          <label for="rule_name">Cache delay:</label>
          <input type="number" class="form-control" id="cache_delay" name="" value="">
        </div>

      </div>
      <br />
      <!-- <label for="rule_ext">Rule ext:</label> -->


      <!-- <input type="text" id='rule_ext' placeholder="rule ext" class="form-control" value=''> -->
      <hr />

      <table class="table" id="columns_table">
        <thead>
          <th>Column</th>
          <th>
            <input class="selected selected_all" type="checkbox">
            Selected
           </th>
          <th>Type</th>
          <th>Label</th>
          <th id="suffix">Suffix</th>
          <th><input class="filterable filterable_all" type="checkbox">Filterable</th>
          <th>Icon</th>
        </thead>
        <tbody>
          <?php foreach ($columns_list as $col): ?>
            <tr>
              <td><?php echo $col['COLUMN_NAME']; ?></td>
              <td>
                <input class="selected" type="checkbox" name="" value="">
              </td>
              <td>
                <input type="text" value="<?php echo $col['COLUMN_TYPE']; ?>" class="form-control col_type">
                <input type="hidden" class="data_type" value="<?php echo $col['DATA_TYPE']; ?>">

              </td>
              <td>
                <input type="text" placeholder="Label" data-col-name="<?php echo $col['COLUMN_NAME']; ?>" value="<?php echo $col['COLUMN_NAME']; ?>" class="form-control col_label" />
              </td>
              <td>
                <input type="text" placeholder="Suffix" class="form-control" />
              </td>
              <td>
                <input type="checkbox" class="filterable" name="" value="">
              </td>
              <!-- <td>
                <a data-toggle="modal" data-target="#icons_modal" data-col="" href="#">Icon</a>
                <input type="hidden" class="col_icon">
              </td> -->
              <td>

                  <input style="width:100px;" type="text" class="form-control col_icon">
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>

      <hr />
      <h1>Authorizations:</h1>
      <button id="add_auth" class="btn btn-primary">Add Auth</button>
      <br />
      <br />
      <div id="auth_wrapper">
        <!-- <div class="card auth">
          <div class="card-body">

            <div class="row auth_var">
              <div class="col-lg-4">
                <select class="form-control auth_var_name">
                  <option value="">$_SESSION var</option>

                </select>
              </div>
              <div class="col-lg-4">
                <select class="form-control auth_var_val">
                  <option value="">$_SESSION value</option>
                </select>
              </div>
              <div class="col-lg-4">
                <button class="btn btn-danger remove_auth_var">Remove var</button>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary add_auth_var">Add new var</button>
            <button class="btn btn-danger remove_auth">Remove auth</button>
          </div>
        </div> -->
      </div>
      <!-- End of auth wrapper  -->
      <hr />
      <h1>Extentions:</h1>
      <button id="add_ext" class="btn btn-primary">Add Ext</button>
      <button id="add_limit" class="btn btn-success">Add limit</button>
      <br>
      <br>

      <div id="ext_wrapper" class="card">
        <div class="card-body">
          <!-- <div class="row">
            <div class="col-lg-3">
              <select class="form-control" name="" placeholder="Column">
                <option value=""></option>
              </select>
            </div>
            <div class="col-lg-3">
              <select class="form-control" name="">
                <option value=""></option>
              </select>
            </div>
            <div class="col-lg-3">
              <select class="form-control" name="">
                <option value=""></option>
              </select>
            </div>
            <div class="col-lg-3">
              <button class="btn btn-danger">Remove</button>
            </div>
          </div> -->
        </div>
      </div>

      <br />
      <br />
      <button id="save_rule" class="btn float-right btn-success">Save</button>
      <br />
      <br />

    </div>

    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script type="text/javascript">
      $("body").ready(function(e){
        $('button#save_rule').click(function(e){

          e.preventDefault();
          var rule = {columns : {}, auth:[], where:[], limit: []}
          rule.rule_name = $('input#rule_name').val();
          rule.table = $('input#table_name').val();
          rule.cache_delay = $('input#cache_delay').val();
          // rule.ext = $('input#rule_ext').val();
          $('.table tbody tr').each(function(index, obj){
            if($(this).find('td:nth-child(2) input').is(':checked')){
              rule.columns[$(this).find('.col_label').val()] = {
                // "type":$(this).find('td:nth-child(3)').text(),
                "col":$(this).find('td:first-child').text(),
                "type":$(this).find('td:nth-child(3) input.col_type').val(),
                "label":$(this).find('td:nth-child(4) input').val(),
                "suffix":$(this).find('td:nth-child(5) input').val(),
                "filterable":$(this).find('td:nth-child(6) input').is(':checked'),
                "icon":$(this).find('td:nth-child(7) input').val()
              }
            }
          });

          $(".card.auth").each(function(index, auth_card){
            var auth_card_anded = [];

            $(auth_card).find('.auth_var').each(function(index, auth_var){
              var auth_type = $(auth_var).find('.auth_var_val').data('type');
              var auth_val = null;
              switch (auth_type) {
                case 'set':
                  auth_val = [];
                  $(auth_var).find('.form-check-input:checked').each(function(checkbox, index){
                    auth_val.push($(this).val());
                  });
                  break;
                default:
                  auth_val = $(auth_var).find('.auth_var_val').val();
                  break;
              }
              auth_oper = $(auth_var).find('.auth_var_oper').val();
              auth_card_anded.push({variable: $(auth_var).find('.auth_var_name').val(),operator: auth_oper, value:  auth_val}) ;
            });
            rule.auth.push(auth_card_anded);
          });

          $(".row.ext_row").each(function(index, row){
            var where = {};
            where.col = $(row).find('select.ext_label').val();
            where.operator = $(row).find('.form-control.ext_oper').val();
            if ($(row).find('.ext_value').data('type') == 'set') {
              where.value = [];
              $(row).find('.form-check-input:checked').each(function(checkbox, index){
                where.value.push($(this).val());
              });
            }else{
              where.value = $(row).find('.form-control.ext_value').val();
            }
            rule.where.push(where);
          });
          // return console.log(rule.where);
          rule.limit = {
            from: $(".row.limit_row input#limit_start").val(),
            step: $(".row.limit_row input#limit_step").val()
          }

          // if($(".row.limit_row input#limit_start").length != 0 && $(".row.limit_row input#limit_start").val() != ""){
          //   rule.limit.push($(".row.limit_row input#limit_start").val());
          // }
          //
          // if($(".row.limit_row input#limit_step").length != 0 && $(".row.limit_row input#limit_step").val() != ""){
          //   rule.limit.push($(".row.limit_row input#limit_step").val());
          // }

          // return console.log(rule);
          $.ajax({
            url:'./functions/main.php',
            method:'post',
            data:{'action':'rule_add','database':$("#database_name").val(), 'table':$("#table_name").val(), 'data':JSON.stringify(rule)},
            // dataType:'json',
            success:function(response){
                // return console.log(response);
              if(response.success){
                $("input, select").val('');
                $("input[type=checkbox]").prop('checked', false);
                $(".auth").remove();
              }
              alert(response.message)
            }
          });
        }); //end of save



      });

    </script>

    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script type="text/javascript" src="./main.js"></script>
    <script type="text/javascript" src="./autocomplete.js"></script>


  </body>
</html>

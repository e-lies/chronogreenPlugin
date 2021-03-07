<?php
  require_once './classes/RulesFile.php';
  if(!isset($_GET['database']) || !isset($_GET['table']) || empty($_GET['database']) || empty($_GET['table'])){
    header('location: index.php');
  }

  require_once './functions/database.php';
  $query = $pdo->prepare('SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE FROM `COLUMNS` WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?;');
  $query->execute(array($_GET['database'], $_GET['table']));
  $columns_list = $query->fetchAll(PDO::FETCH_ASSOC);

  $rule = (new RulesFile($_GET['database']))->get_rule($_GET['rule_name']);
  if(!$rule){
    header('Location: index.php');
    die();
  }
  $session_vars = json_decode(file_get_contents('./sessions/'.$_GET['database'].'_session_vars.json'), true)['vars'];

?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
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
      <h1>Editing a rule</h1>
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
          <input type="text" id='rule_name' placeholder="rule name" class="form-control" value='' autofocus>
        </div>

        <div class="col-lg-6">
          <label for="rule_name">Cache delay:</label>
          <input type="number" class="form-control" id="cache_delay" name="" value="<?php echo $rule->cache_delay ?>">
        </div>
      </div>

      <br />
      <!-- <label for="rule_ext">Rule ext:</label> -->
      <!-- <input type="text" id='rule_ext' placeholder="rule ext" class="form-control" value='<?php echo $rule->ext; ?>'> -->
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
            <?php $rule_col = $rule->get_column($col['COLUMN_NAME']); ?>
            <tr>
              <td><?php echo  $col['COLUMN_NAME']; ?></td>
              <td>
                  <input <?php echo (($rule_col) ? 'checked' : ''); ?> class="selected" type="checkbox" name="" value="">
              </td>
              <!-- <td><input type="text" value="<?php echo $col['COLUMN_TYPE']; ?>" class="form-control"></td> -->
              <td>
                <input type="text" value="<?php echo $rule_col ? $rule_col->type : $col['COLUMN_TYPE']; ?>" class="form-control col_type" />
                <input type="hidden" class="data_type" name="" value="<?php echo $col["DATA_TYPE"]; ?>">
              </td>

              <td>
                <input type="text" data-col-name="<?php echo $col['COLUMN_NAME']; ?>" placeholder="Label" class="form-control" value="<?php echo (($rule_col) ? $rule_col->label : $col['COLUMN_NAME']); ?>" />
              </td>
              <td>
                <input type="text" placeholder="Suffix" value="<?php echo (($rule_col) ? $rule_col->suffix : ''); ?>" class="form-control" />
              </td>
              <td>
                <input <?php echo (($rule_col && $rule_col->filterable) ? 'checked' : ''); ?> type="checkbox" class="filterable" name="" value="">
              </td>
              <td>
                <input type="text" placeholder="Icon" class="form-control" value="<?php echo (($rule_col) ? $rule_col->icon : ''); ?>" />
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
        <?php foreach ($rule->auth as $auth_array): ?>
          <div class="card auth">
            <div class="card-body">
            <?php foreach ($auth_array as $auth): ?>

              <?php  $auth_var = $auth['variable']; ?>
              <?php  $auth_val = $auth['value']; ?>
              <?php  $auth_var_type = $session_vars[$auth_var]['type']; ?>
              <div class="row auth_var">
                    <div class="col-lg-3">
                      <select required="" class="form-control auth_var_name">
                          <option value="">$_SESSION var</option>
                              <?php foreach ($session_vars as $var_name => $values): ?>
                                <?php if ($auth_var == $var_name): ?>
                                  <option selected value="<?php echo $auth_var ; ?>"><?php echo $auth_var ; ?></option>
                                <?php else: ?>
                                  <option value="<?php echo $var_name; ?>"><?php echo $var_name; ?></option>
                                <?php endif; ?>
                              <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="col-lg-3">
                      <?php
                        $number_operands = [
                          '=',
                          '<>',
                          '<',
                          '>',
                          'in'
                        ]
                       ?>
                      <select name="" id="" class="form-control auth_var_oper">
                        <?php if ($auth_var_type == 'enum'): ?>
                          <option value="">Choose operator</option>
                          <option value="=" selected>=</option>
                        <?php elseif($auth_var_type == 'set'): ?>
                          <option value="">Choose operator</option>
                          <option value="contains" selected>CONTAINS</option>
                        <?php elseif($auth_var_type == 'varchar'):  ?>
                          <option value="">Choose operator</option>
                          <option value="like" selected>LIKE</option>
                        <?php elseif($auth_var_type == 'int' || $auth_var_type == 'float'):  ?>
                          <option value="">Choose operator</option>
                          <?php foreach ($number_operands as $opr): ?>
                            <?php if ($opr == $auth['operator']): ?>
                              <option selected value="<?php echo $opr ?>"><?php echo $opr ?></option>
                            <?php else: ?>
                              <option value="<?php echo $opr ?>"><?php echo $opr ?></option>
                            <?php endif; ?>
                          <?php endforeach; ?>
                        <?php endif; ?>
                      </select>
                    </div>

                    <div class="col-lg-3">
                      <?php if ($auth_var_type == 'enum'): ?>
                        <select required="" class="form-control auth_var_val">
                          <option value="">$_SESSION value</option>
                          <?php foreach ($session_vars[$auth_var]['values'] as $value): ?>

                              <?php if ($value == $auth_val): ?>
                                <option selected value="<?php echo $auth_val; ?>"><?php echo $auth_val; ?></option>
                              <?php else: ?>
                                <option value="<?php echo $value; ?>"><?php echo $value; ?></option>
                              <?php endif; ?>

                          <?php endforeach; ?>
                          </select>
                      <?php elseif($auth_var_type == 'set'): ?>
                        <div data-type="set" class="auth_var_val">
                          <?php foreach ($session_vars[$auth_var]['values'] as $value): ?>
                            <?php if (in_array($value,$auth_val)): ?>
                              <div class="form-check">
                                <input class="form-check-input" checked type="checkbox" name="" id="<?php echo $value; ?>" value="<?php echo $value; ?>">
                                <label class="form-check-label" for="<?php echo $value; ?>">
                                  <?php echo $value ?>
                                </label>
                              </div>
                            <?php else: ?>
                                <div class="form-check">
                                  <input class="form-check-input" type="checkbox" name="" id="<?php echo $value; ?>" value="<?php echo $value; ?>">
                                  <label class="form-check-label" for="<?php echo $value; ?>">
                                    <?php echo $value ?>
                                  </label>
                                </div>
                            <?php endif; ?>
                          <?php endforeach; ?>
                        </div>
                      <?php else:  ?>
                        <input data-type="varchar" type="text" class="form-control auth_var_val" placeholder="<?php echo $auth_var; ?>" value="<?php echo $auth_val; ?>">
                      <?php endif; ?>

                    </div>
                    <div class="col-lg-3">
                      <button class="btn btn-danger remove_auth_var">Remove var</button>
                    </div>
                </div>
            <?php endforeach; ?>
          </div>
          <!-- <br /> -->
          <div class="card-footer">
            <button class="btn btn-primary add_auth_var">Add new var</button>
            <button class="btn btn-danger remove_auth">Remove auth</button>
          </div>
              </div>
          <?php endforeach; ?>
        </div>
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


      <!-- </div> -->
      <!-- End of auth wrapper  -->
      <hr />
      <h1>Extentions:</h1>
      <button id="add_ext" class="btn btn-primary">Add Ext</button>
      <button id="add_limit" class="btn btn-success">Add limit</button>
      <br>
      <br>

      <div id="ext_wrapper" class="card">
        <div class="card-body">
          <?php if (isset($rule->where) && sizeof($rule->where) >0): ?>
            <?php foreach ($rule->where as $where): ?>
              <div class="row ext_row">
                <div class="col-lg-3">
                  <select class="form-control ext_label" name="" placeholder="Column">
                    <?php $data_type = false; ?>
                    <?php $col_type = false; ?>
                    <?php foreach ($columns_list as $col): ?>



                        <?php if ($where['col'] == $col['COLUMN_NAME']) {$col_type = $col['COLUMN_TYPE']; $data_type = $col['DATA_TYPE']; } ?>
                        <option <?php echo $where['col'] == $col['COLUMN_NAME'] ? 'selected' : '' ?>   value="<?php echo $col['COLUMN_NAME']; ?>" data-col-name="<?php echo $col['COLUMN_NAME']; ?>"><?php echo $col['COLUMN_NAME']; ?></option>

                    <?php endforeach; ?>
                    <!-- <option value="<?php echo $where['label']; ?>"><?php echo $where['label']; ?></option> -->
                  </select>
                </div>
                <div class="col-lg-3">
                  <!-- <?php echo $col_type.' > '.$data_type; ?> -->
                  <?php if (in_array($data_type , ['int', 'float', 'datetime', 'decimal', 'varchar'])): ?>
                    <select class="form-control ext_oper" name="">
                      <option <?php echo $where["operator"] == ">" ? 'selected':'' ?> value=">">></option>
                      <option <?php echo $where["operator"] == "<" ? 'selected':'' ?> value="<"><</option>
                      <option <?php echo $where["operator"] == "=" ? 'selected':'' ?> value="=">=</option>
                      <option <?php echo $where["operator"] == "<>" ? 'selected':'' ?> value="<>"><></option>
                      <option <?php echo $where["operator"] == "in" ? 'selected':'' ?> value="in">in</option>
                      <!-- <option value="<?php echo $where['operand']; ?>"><?php echo $where['operand']; ?></option> -->
                    </select>
                  <?php elseif ($data_type == "varchar"): ?>
                    <select class="form-control ext_oper" name="">
                      <option value="">Choose operator</option>
                      <option value="like" selected>Like</option>
                    </select>
                  <?php elseif ($data_type == "set"): ?>
                    <select class="form-control ext_oper" name="">
                      <option value="">Choose operator</option>
                      <option value="contains" selected>contains</option>
                    </select>
                  <?php elseif ($data_type == "enum"): ?>
                    <select class="form-control ext_oper" name="">
                      <option value="">Choose operator</option>
                      <option value="=" selected>=</option>
                    </select>
                  <?php endif; ?>
                </div>
                <div class="col-lg-3">
                  <?php if (in_array($data_type , ['int', 'float', 'datetime', 'varchar', 'decimal'])): ?>
                    <input type="text" class="form-control ext_value" name="" value="<?php echo $where["value"] ?>">
                  <?php elseif($data_type == "set"): ?>
                    <?php foreach ($columns_list as $col): ?>
                      <?php if ($col["COLUMN_NAME"] == $where["col"]): ?>
                        <?php $values = explode(",", str_replace("'", "", substr(substr($col["COLUMN_TYPE"], 4), 0, -1))); ?>
                        <div class="ext_value" data-type="set">
                          <?php foreach ($values as $value): ?>
                            <div class="form-check" >
                              <input class="form-check-input" <?php echo in_array($value, $where["value"]) ? 'checked' : '' ?> type="checkbox" name="" id="" value="<?php echo $value ?>">
                              <label class="form-check-label" for="">
                                <?php echo $value ?>
                              </label>
                            </div>
                          <?php endforeach; ?>
                        </div>
                        <?php break; ?>
                      <?php endif; ?>
                    <?php endforeach; ?>
                    <!-- Get possible values -->
                    <!-- display them as checkboxes -->
                  <?php elseif($data_type == "enum"): ?>
                    <?php foreach ($columns_list as $col): ?>
                      <?php if ($col["COLUMN_NAME"] == $where["col"]): ?>
                        <?php $values = explode(",", str_replace("'", "", substr(substr($col["COLUMN_TYPE"], 5), 0, -1))); ?>
                        <select name="" id="" class="form-control ext_value" data-type="enum">
                          <?php foreach ($values as $value): ?>
                            <option value="<?php echo $value ?>" <?php echo $value == $where["value"] ? 'selected' : '' ?> ><?php echo $value ?></option>
                          <?php endforeach; ?>
                        </select>
                        <?php break; ?>
                      <?php endif; ?>
                    <?php endforeach; ?>
                  <?php endif; ?>
                </div>
                <div class="col-lg-3">
                  <button class="btn btn-danger remove_ext">Remove</button>
                </div>
              </div>
              <br>
            <?php endforeach; ?>

          <?php endif; ?>
        </div>
      </div>


      <br />
      <br />
      <button id="update_rule" class="btn float-right btn-success">Save</button>
      <br />
      <br />

    </div>

    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script type="text/javascript">
      $('button#update_rule').click(function(e){

        e.preventDefault();
        var rule = {columns : {}, auth:[], where: []}
        rule.rule_name = $('input#rule_name').val();
        rule.table = $('input#table_name').val();
        rule.ext = $('input#rule_ext').val();
        rule.cache_delay = $('input#cache_delay').val();

        $('.table tbody tr').each(function(index, obj){
          if($(this).find('td:nth-child(2) input').is(':checked')){
            rule.columns[$(this).find('td:first-child').text()] = {
              // "type":$(this).find('td:nth-child(3) ').text(),
              "col":$(this).find('td:first-child').text(),
              "type":$(this).find('td:nth-child(3) input').val(),
              "label":$(this).find('td:nth-child(4) input').val(),
              "suffix":$(this).find('td:nth-child(5) input').val(),
              "filterable":$(this).find('td:nth-child(6) input').is(':checked'),
              "icon":$(this).find('td:nth-child(7) input').val(),
            }
          }
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
        // return console.log(rule);
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
        $.ajax({
          url:'./functions/main.php',
          method:'post',
          data:{'action':'rule_clone','database':$("#database_name").val(), 'table':$("#table_name").val(), 'data':JSON.stringify(rule)},
          dataType:'json',
          success:function(response){
            alert(response.message);
          }
        });
      }); //end of save



    </script>
    <script type="text/javascript" src="./main.js"></script>
  </body>
</html>

<?php
  if(!isset($_GET['database']) || !isset($_GET['table']) || empty($_GET['database']) || empty($_GET['table']) || !isset($_GET['rule_name']) || empty($_GET['rule_name'])){
    header('location: index.php');
  }

  require_once './functions/database.php';
  require_once './classes/RulesFile.php';
  $query = $pdo->prepare('SELECT DISTINCT(COLUMNS.COLUMN_NAME),
  COLUMNS.TABLE_NAME,
  COLUMNS.DATA_TYPE,
  COLUMNS.COLUMN_TYPE,
  KEY_COLUMN_USAGE.CONSTRAINT_NAME,
  KEY_COLUMN_USAGE.REFERENCED_TABLE_NAME,
  KEY_COLUMN_USAGE.REFERENCED_COLUMN_NAME
  FROM `COLUMNS`
    LEFT JOIN KEY_COLUMN_USAGE on KEY_COLUMN_USAGE.COLUMN_NAME = COLUMNS.COLUMN_NAME AND KEY_COLUMN_USAGE.REFERENCED_COLUMN_NAME IS NOT null
  WHERE
  COLUMNS.TABLE_SCHEMA = ? AND
  COLUMNS.TABLE_NAME = ?;');
  $query->execute(array($_GET['database'], $_GET['table']));
  $columns_list = $query->fetchAll(PDO::FETCH_ASSOC);
  $foreigns = [];
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
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
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
    <title>Deletes generation | EDIT</title>
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
        <div class="col-lg-10">
          <label for="rule_name">Rule name:</label>
          <input type="text" id='rule_name' placeholder="rule name" class="form-control" value=''>
        </div>
        <div class="col-lg-2">
          <label for="">Populate:</label>
          <br>
          <input type="checkbox" <?php echo isset($rule->populate) && $rule->populate ? 'checked' : '' ?> id="populate" name="" value="">
        </div>
        <!-- <div class="col-lg-3"> -->
          <!-- <label for="rule_name">Upload path:</label> -->
          <!-- <input type="text" id='upload_path' placeholder="/racine_de_lapp/..." class="form-control" value=''> -->
        <!-- </div> -->
        <!-- <div class="col-lg-1"> -->
          <!-- <label for="">Ignore</label> <br> -->
          <!-- <input type="checkbox" id="ignore" name="" value=""> -->
        <!-- </div> -->
        <!-- <div class="col-lg-5"> -->
          <!-- <label for="">Duplicate:</label> -->
          <!-- <input type="checkbox" id="duplicate_set" name="" value=""> -->
          <!-- <input type="text" name="" disabled value="ON DUPLICATE KEY UPDATE" class="form-control" id="duplicate" value=""> -->
          <!-- <label for="conflict">Conflict policy:</label>
          <select class="form-control" id="conflict" name="">
            <option value="cancel">Cancel</option>
            <option value="ignore">Ignore</option>
            <option value="update">Update</option>
          </select> -->
        <!-- </div> -->
        <div class="col-lg-12">
          <!-- <br /> -->
          <!-- <br /> -->
          <br />
          <label for="">Where:</label>
          <textarea name="" id="rule_where" cols="30" rows="3" class="form-control">WHERE </textarea>
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
          <!-- <th id="suffix">Suffix</th> -->
          <th>
            Operator
            <!-- <input class="unique unique_all" type="checkbox"> -->
            <!-- Unique
          </th>
          <th> -->
            <!-- <input class="required required_all" type="checkbox"> -->
            <!-- Required
        -->
        </th>
          <th>
          Required
          </th>
        </thead>
        <tbody>
          <?php foreach ($columns_list as $col): ?>
            <?php $rule_col = $rule->get_column($col["COLUMN_NAME"]); ?>
            <?php //print_r($rule_col); ?>
            <tr data-col-name="<?php echo $col['COLUMN_NAME']; ?>">
              <td class="col_name"><?php echo $col['COLUMN_NAME']; ?></td>
              <td>
                <input <?php echo isset($rule_col) ? 'checked' : '' ?> class="selected" type="checkbox" name="" value="">
              </td>
              <td>
                  <input type="text" value="<?php echo isset($rule_col) ? $rule_col->type : $col['COLUMN_TYPE']; ?>" class="form-control col_type">
                  <input type="hidden" class="data_type" value="<?php echo $col['DATA_TYPE']; ?>">

              </td>
              <td>
                <input type="text" placeholder="Label" data-col-type="<?php echo $col['COLUMN_TYPE']; ?>" data-type="<?php echo $col['DATA_TYPE']; ?>"
                data-col-name="<?php echo $col['COLUMN_NAME']; ?>" value="<?php echo isset($rule_col) ? $rule_col->label : $col['COLUMN_NAME']; ?>" class="form-control col_label" />
              </td>
              <!-- <td>
                <input type="text" placeholder="Suffix" class="form-control col_suffix" />
              </td> -->
              <td>
                <!-- <input type="checkbox" class="col_unique" name="" value=""> -->
              <!-- </td>
              <td> -->
                <!-- <input type="checkbox" class="col_required" name="" value=""> -->
                <input type="text" class="form-control col_operator" name="" value="<?php echo isset($rule_col) ? $rule_col->operator : ''; ?>">
              </td>
              <td>
                <input type="checkbox" class="col_required" <?php echo isset($rule_col) && $rule_col->required ? 'checked' : ''; ?>>
              </td>
              <!-- <td>
                <a data-toggle="modal" data-target="#icons_modal" data-col="" href="#">Icon</a>
                <input type="hidden" class="col_icon">
              </td> -->
              <!-- <td>

                  <input style="width:100px;" type="text" class="form-control col_icon">
              </td> -->
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
              <?php $auth_var = $auth['variable']; ?>
              <?php $auth_val = $auth['value']; ?>
              <?php  $auth_var_type = $session_vars[$auth_var]['type']; ?>
              <div class="row auth_var">
                    <div class="col-lg-3">
                      <select required="" class="form-control auth_var_name">
                          <option value="">$_SESSION var</option>
                              <?php foreach ($session_vars as $var_name => $values): ?>
                                <?php if ($auth_var == $var_name): ?>
                                  <option selected value="<?php echo $auth['variable'] ; ?>"><?php echo $auth_var ; ?></option>
                                <?php else: ?>
                                  <option value="<?php echo $var_name; ?>"><?php echo $var_name; ?></option>
                                <?php endif; ?>
                              <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="col-lg-3">
                      <?php
                        $number_operators = [
                          '=',
                          '<>',
                          '<',
                          '>'
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
                          <?php foreach ($number_operators as $opr): ?>
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
                      <?php elseif($auth_var_type == 'float'):  ?>
                        <input data-type="float" type="number" step="0.00001" class="form-control auth_var_val" placeholder="<?php echo $auth_var; ?>" value="<?php echo $auth_val; ?>">
                      <?php elseif($auth_var_type == 'varchar'):  ?>
                        <input data-type="varchar" type="text" class="form-control auth_var_val" placeholder="<?php echo $auth_var; ?>" value="<?php echo $auth_val; ?>">
                      <?php elseif($auth_var_type == 'int'):  ?>
                        <input data-type="int" type="number" class="form-control auth_var_val" placeholder="<?php echo $auth_var; ?>" value="<?php echo $auth_val; ?>">
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
      <button id="update_rule" class="btn float-right btn-success">Save</button>
      <br />
      <br />

    </div>

    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script type="text/javascript">
    var cols = [];
    $("body").ready(function(e){
      $(".columns .col_name").each(function(index, input){
        cols.push({label: $(this).val(), value:$(this).val()});
      });


      $("#duplicate_set").change(function(e){
        $("#duplicate").prop('disabled', !$(this).is(':checked'))
      });

      $('button#update_rule').click(function(e){

        e.preventDefault();
        var rule = {cond : {}, auth:[], constants: []}
        rule.rule_name = $('input#rule_name').val();
        // rule.path = $('input#upload_path').val() !== "" ? $('input#upload_path').val() : '';

        rule.table = $('input#table_name').val();

        if ($("#populate").is(':checked')) {
          rule.populate = true;
        }

        if ($('input#upload_path').val() !== "") {
          rule.path = $('input#upload_path').val()
        }

        if($("#duplicate_set").is(':checked')){
          rule.duplicate = $("input#duplicate").val()
        }

        if($('input#ignore').is(':checked')){
            rule.ignore = true;
        }
        // rule.ext = $('input#rule_ext').val();

        // $("#const_wrapper .const").each(function(index, constant){
        //   rule.constants.push({
        //     col:$(constant).find('.const_col').val(),
        //     value:$(constant).find('.const_value').val()
        //   });
        // });
        $('.table tbody tr').each(function(index, obj){
          if($(this).find('td:nth-child(2) input.selected').is(':checked')){
            column = {
              // "type":$(this).find('td:nth-child(3)').text(),
              "col":$(this).find('.col_name').text(),

              "type":$(this).find('input.col_type').val(),
              "label":$(this).find('.col_label').val(),
              // "suffix":$(this).find('.col_suffix').val(),
              "required":$(this).find('.col_required').is(':checked'),
              // "unique":$(this).find('.col_unique').is(':checked'),
              // "icon":$(this).find('.col_icon').val()
              "operator":$(this).find('.col_operator').val()
            };
            // if(column.type == "foreign"){
            //   $(".f_wrapper").each(function(e){
            //     if($(this).find('.f_col').val() == column.name){
            //       column.foreign = {
            //         table: $(this).find('.f_table').val(),
            //         primary: $(this).find('.f_primary').val(),
            //         where: $(this).find('.f_ext').val(),
            //         label: $(this).find('.f_label').val()
            //       }
            //     }
            //   });
            // }
            rule.cond[column.label] = column;
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
        $.ajax({
          url:'./functions/main.php',
          method:'post',
          data:{'action':'rule_clone','database':$("#database_name").val(), 'table':$("#table_name").val(), 'data':JSON.stringify(rule)},
          dataType:'json',
          success:function(response){
              // return console.log(response);
            alert(response.message)
            if(response.success){
              window.location.href = './index.php?database=<?php echo $_GET["database"] ?>';
              // $("input, select").val('');
              // $("input[type=checkbox]").prop('checked', false);
              // $(".auth").remove();
            }
          }
        });
      }); //end of save
    });




    </script>
    <script type="text/javascript" src="./main.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script type="text/javascript" src="./icons/autocomplete.js"></script>
  </body>
</html>

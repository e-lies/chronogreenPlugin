<?php
  if(!isset($_GET['database']) || !isset($_GET['table']) || empty($_GET['database']) || empty($_GET['table'])){
    header('location: index.php');
  }

  require_once './functions/database.php';
  $query = $pdo->prepare('SELECT DISTINCT(COLUMNS.COLUMN_NAME),
  COLUMNS.TABLE_NAME,
  COLUMNS.DATA_TYPE,
  COLUMNS.COLUMN_TYPE,
  COLUMNS.IS_NULLABLE,
  KEY_COLUMN_USAGE.CONSTRAINT_NAME,
  KEY_COLUMN_USAGE.REFERENCED_TABLE_NAME,
  KEY_COLUMN_USAGE.REFERENCED_COLUMN_NAME
  FROM `COLUMNS`
  	LEFT JOIN KEY_COLUMN_USAGE on KEY_COLUMN_USAGE.COLUMN_NAME = COLUMNS.COLUMN_NAME AND KEY_COLUMN_USAGE.REFERENCED_COLUMN_NAME IS NOT null
  WHERE
  COLUMNS.TABLE_SCHEMA = ? AND
  COLUMNS.TABLE_NAME = ?
  GROUP BY COLUMNS.COLUMN_NAME;');
  $query->execute(array($_GET['database'], $_GET['table']));
  $columns_list = $query->fetchAll(PDO::FETCH_ASSOC);
  $foreigns = [];
  if (isset($_GET['rule_name'])) {
    // Cloning  an existing rule
  }
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" />
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
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
    <title>Updates generation | CREATE</title>
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
          <input type="text" id='rule_name' placeholder="rule name" class="form-control" autofocus value='<?php echo $_GET["rule_name"] ?>'>
        <!-- </div> -->
        <!-- <div class="col-lg-3">
          <label for="rule_name">Upload path:</label>
          <input type="text" id='upload_path' placeholder="/racine_de_lapp/..." class="form-control" value=''> -->
        </div>
        <div class="col-lg-1">
          <label for="">Ignore</label> <br>
          <input type="checkbox" id="ignore" name="" value="">
        </div>
        <div class="col-lg-1">
          <label for="">Populate</label> <br>
          <input type="checkbox" id="populate" name="" value="">
        </div>
        <div class="col-lg-5">
          <!-- <label for="">Duplicate:</label> -->
          <!-- <input type="checkbox" id="duplicate_set" name="" value=""> -->
          <!-- <input type="text" name="" disabled value="ON DUPLICATE KEY UPDATE" class="form-control" id="duplicate" value=""> -->
          <!-- <label for="conflict">Conflict policy:</label>
          <select class="form-control" id="conflict" name="">
            <option value="cancel">Cancel</option>
            <option value="ignore">Ignore</option>
            <option value="update">Update</option>
          </select> -->
        </div>
        <div class="col-lg-12">
          <!-- <br /> -->
          <!-- <br /> -->
          <br />
          <label for="">Where:</label>
          <textarea name="" id="rule_where" cols="30" rows="3" class="form-control"></textarea>
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
          <th>
            Path
          </th>
          <th>Unique</th>
          <th>Required</th>
          <th>Icon</th>
        </thead>
        <tbody>
          <?php foreach ($columns_list as $col): ?>
            <tr data-col-name="<?php echo $col['COLUMN_NAME']; ?>">
              <td class="col_name"><?php echo $col['COLUMN_NAME']; ?></td>
              <td>
                <input class="selected" type="checkbox" name="" value="">
              </td>
              <td style="width:200px;">
                <?php if ($col['REFERENCED_COLUMN_NAME']): ?>
                  <?php
                    $foreigns[$col['COLUMN_NAME']] = $col;
                   ?>
                  <input type="text" class="form-control col_type" name="" value="foreign">
                  <input type="checkbox" class="col_foreign" data-col-name="<?php echo $col["COLUMN_NAME"]; ?>" name="" value="">
                  <input type="hidden" class="old_type" name="" value="<?php echo $col['COLUMN_TYPE']; ?>">
                <?php else: ?>
                  <input type="text" value="<?php echo $col['COLUMN_TYPE']; ?>" class="form-control col_type">
                  <input type="hidden" class="data_type" value="<?php echo $col['DATA_TYPE']; ?>">
                  <input type="checkbox" class="col_foreign" data-col-name="<?php echo $col["COLUMN_NAME"]; ?>" name="" value="">
                <?php endif; ?>
              </td>

              <td>
                <input type="text" placeholder="Label" data-col-type="<?php echo $col['COLUMN_TYPE']; ?>" data-type="<?php echo $col['DATA_TYPE']; ?>" data-col-name="<?php echo $col['COLUMN_NAME']; ?>" value="<?php echo $col['COLUMN_NAME']; ?>" class="form-control col_label" />
              </td>
              <td>
                <input type="text" placeholder="Suffix" class="form-control col_suffix" />
              </td>
              <td>
                <input type="checkbox" class="path_selected" name="" value="">
                <input type="text" class="form-control path">
              </td>
              <td>
                <input type="checkbox" class="col_unique" name="" value="">
              </td>
              <td>
                <input type="checkbox" <?php echo $col['IS_NULLABLE'] == 'NO' ? 'checked': '' ?> class="col_required" name="" value="">
              </td>

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
      <hr />
      <h1>Foreign keys:</h1>
      <div id="foreign_wrapper">
        <div class="row foreign_wrapper" >

        </div>
      </div> <!-- end of foreign wrapper -->
      <hr>
      <br>
      <h2>Constants:</h2>
      <button id="add_const" class="btn btn-primary">Add Constant</button>
      <br>
      <br>
      <div id="const_wrapper">
        <div class="columns">
          <?php foreach ($columns_list as $col): ?>
            <input type="hidden" class="col_name" value="<?php echo $col['COLUMN_NAME']; ?>">
          <?php endforeach; ?>
        </div>
        <div class="card">
          <div class="card-body">

          </div>
        </div>
      </div>

      <!-- Cond -->
      <hr />
      <h1>Conditions:</h1>
      <button id="add_cond" class="btn btn-primary">Add Ext</button>
      <!-- <button id="add_limit" class="btn btn-success">Add limit</button> -->
      <br>
      <br>

      <div class="card">
        <div id="cond_wrapper" class="card-body">
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


      <!-- End of auth wrapper  -->
      <!-- <hr />
      <h1>Extentions:</h1>
      <button id="add_ext" class="btn btn-primary">Add Ext</button>
      <button id="add_limit" class="btn btn-success">Add limit</button>
      <br>
      <br> -->

      <!-- <div class="ext_wrapper" class="card"> -->
        <!-- <div class="card-body"> -->
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
        <!-- </div> -->
      <!-- </div> -->

      <br />
      <br />
      <button id="save_rule" class="btn float-right btn-success">Save</button>
      <br />
      <br />

    </div>

    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script type="text/javascript">
    function split( val ) {
      return val.split( /,\s*/ );
    }
    function extractLast( term ) {
      return split( term ).pop();
    }
    </script>
    <script type="text/javascript">
      var cols = [];
      $("body").ready(function(e){

        $(".col_foreign").change(function(e){

          var foreign_wrappers = [];
          var col_name = $(this).data("col-name");
          $(".f_wrapper").each(function(e){
            foreign_wrappers.push($(this).data("col-name"));
          });


          if ($(this).is(":checked") && foreign_wrappers.indexOf(col_name) == -1) {
            // Add foreign wrapper
            f_wrapper(col_name);
          }else if( (!$(this).is(":checked")) && foreign_wrappers.indexOf(col_name) != -1){
            // Remove foreign wrapper
            $(`.f_wrapper[data-col-name="${col_name}"]`).remove();

          }

        });

        $(".path_selected").change(function(e){
          $(this).parent().find(".path").prop("disabled", !$(this).is(':checked'))
        });

        $(".columns .col_name").each(function(index, input){
          cols.push({label: $(this).val(), value:$(this).val()});
        });

        // $("#duplicate_set").change(function(e){
        //   $("#duplicate").prop('disabled', !$(this).is(':checked'))
        // });

        $('button#save_rule').click(function(e){

          e.preventDefault();
          var rule = {columns : {}, auth:[], constants: []}
          rule.rule_name = $('input#rule_name').val();
          rule.where = $("#rule_where").val();
          // rule.path = $('input#upload_path').val() !== "" ? $('input#upload_path').val() : '';

          rule.table = $('input#table_name').val();
          //
          // if ($('input#upload_path').val() !== "") {
          //   rule.path = $('input#upload_path').val()
          // }

          if($("#duplicate_set").is(':checked')){
            rule.duplicate = $("input#duplicate").val()
          }


          if($('input#ignore').is(':checked')){
              rule.ignore = true;
          }
          if($('input#populate').is(':checked')){
              rule.populate = true;
          }

          // rule.ext = $('input#rule_ext').val();
          $("#const_wrapper .const").each(function(index, constant){
            rule.constants.push({
              col:$(constant).find('.const_col').val(),
              value:$(constant).find('.const_value').val()
            });
          });
          $('.table tbody tr').each(function(index, obj){
            if($(this).find('td:nth-child(2) input.selected').is(':checked')){
              column = {
                // "type":$(this).find('td:nth-child(3)').text(),
                "col":$(this).find('.col_name').text(),

                "type":$(this).find('input.col_type').val(),
                "label":$(this).find('.col_label').val(),
                "suffix":$(this).find('.col_suffix').val(),
                "required":$(this).find('.col_required').is(':checked'),
                "unique":$(this).find('.col_unique').is(':checked'),

                "icon":$(this).find('.col_icon').val()
              };

              if($(this).find(".path_selected").is(':checked')){
                column.path = $(this).find(".path").val();
              }
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
              rule.columns[column.label] = column;
            }
          });
          // return console.log(rule);
          // Adding conditions


          $(".f_wrapper").each(function(index, f_wrapper){
            var col_name = $(f_wrapper).data("col-name");
            // console.log(col_name);
            for(var column in rule.columns){
              if(rule.columns[ column ].col == col_name){
                rule.columns[ column ].foreign = {
                  table: $(this).find('.f_table').val(),
                  primary: $(this).find('.f_primary').val(),
                  where: $(this).find('.f_ext').val(),
                  label: $(this).find('.f_label').val()
                }
              }
            }
          });

          var conds = {};
          $("#cond_wrapper .cond_row").each(function(e){

            conds[$(this).find('.cond_label').val()] = {
               col:$(this).find('.cond_col').val(),
               type:$(this).find('.cond_type').val(),
               required:$(this).find('.cond_required').is(':checked'),
               operator:$(this).find('.cond_oper').val()
            };

          });
          rule.cond = conds;
          // Adding auth
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
            data:{'action':'rule_add','database':$("#database_name").val(), 'table':$("#table_name").val(), 'data':JSON.stringify(rule)},
            dataType:'json',
            success:function(response){

              alert(response.message)
              if(response.success){
                window.location.href = './index.php?database=<?php echo $_GET['database'] ?>';
                // $("input, select").val('');
                // $("input[type=checkbox]").prop('checked', false);
                // $(".auth").remove();
              }
            }
          });
        }); //end of save


        $("body").delegate(".f_table", "change", function(e){
          $.ajax({
            url:"./api/get_columns.php",
            data:{"database": "<?php echo $_GET['database']; ?>", "table": $(e.target).val()},
            success:function(response){
              var options = [];
              var tags = [];
              response.forEach(function(table){
                options.push({label: table, value: table});
                tags.push(table);
              });
              var parent = $(e.target).parents().eq(1);
              $(parent).find('select.f_primary').replaceWith(select_from_obj(options, 'form-control f_primary', 'choose primary'));
              // return console.log($(parent).find('.f_label'));
                $(parent).find('.f_label').on( "keydown", function( event ) {
                  if ( event.keyCode === $.ui.keyCode.TAB &&
                      $( this ).autocomplete( "instance" ).menu.active ) {
                    event.preventDefault();
                  }
                })
                .autocomplete({
                  minLength: 0,
                  source: function( request, response ) {
                    // delegate back to autocomplete, but extract the last term
                    response( $.ui.autocomplete.filter(
                      tags, extractLast( request.term ) ) );
                  },
                  focus: function() {
                    // prevent value inserted on focus
                    return false;
                  },
                  select: function( event, ui ) {
                    var terms = split( this.value );
                    // remove the current input
                    terms.pop();
                    // add the selected item
                    terms.push( ui.item.value );
                    // add placeholder to get the comma-and-space at the end
                    terms.push( "" );
                    this.value = terms.join( ", " );
                    return false;
                  }
                });
            }
          });
          // $.getJSON("./api/get_columns.php", {
          //   dataType:"string",
          //   data:JSON.stringify({"database": "<?php echo $_GET['database']; ?>", "table": $(select).val()})
          // }, function(response){
          //   console.log(response);
          // });
        });
        // $("body").delegate(".f_table", "change", function(e){
        //   $.ajax({
        //     url:"./api/get_columns.php",
        //     data:{"database": "<?php echo $_GET['database']; ?>", "table": $(e.target).val()},
        //     success:function(response){
        //       var options = [];
        //       response.forEach(function(table){
        //         options.push({label: table, value: table});
        //       });
        //       $(e.target).parents().eq(1).find('select.f_primary').replaceWith(select_from_obj(options, 'form-control f_primary', 'choose primary'));
        //     }
        //   });
        //   // $.getJSON("./api/get_columns.php", {
        //   //   dataType:"string",
        //   //   data:JSON.stringify({"database": "<?php echo $_GET['database']; ?>", "table": $(select).val()})
        //   // }, function(response){
        //   //   console.log(response);
        //   // });
        // });
      });

      function f_wrapper(col_name){
        var tables = [];
        var f_wrapper = ``;
        $.ajax({
          url:"./api/get_tables.php",
          data:{database:"<?php echo $_GET["database"]; ?>"},
          success:function(response){
            response.forEach(function(table){
              tables.push({label: table, value: table});
            });
            tables = select_from_obj(tables, "form-control mb-2 mr-sm-2 f_table", 'choose table');

            f_wrapper = $(`<div class="col-lg-12 f_wrapper" data-col-name="${col_name}"><br />
                 <div class="card">
                   <div class="card-body">
                       <div class="row">
                         <div class="col-lg-3">
                           <label for="">Column name:</label>
                           <input type="text" disabled="" value="${col_name}" class="form-control f_col mb-2 mr-sm-2">
                         </div>
                         <div class="col-lg-3">
                           <label for="">Referenced table:</label>
                           ${tables}
                         </div>
                         <div class="col-lg-3">
                           <label for="">Primary key:</label>
                           <select class="form-control f_primary mb-2 mr-sm-2" placeholder="" name="">

                           </select>
                         </div>
                         <div class="col-lg-3">
                           <label for="">Label:</label>
                           <input type="text" class="form-control f_label mb-2 mr-sm-2" >
                         </div>
                       </div>
                       <div class="ext_wrapper">
                         <div class="ref_col_names">
                             <input type="hidden" data-col-type="int(11)" data-type="int" value="invoice_id" class="ref_col_name">
                             <input type="hidden" data-col-type="varchar(255)" data-type="varchar" value="customer_name" class="ref_col_name">
                             <input type="hidden" data-col-type="timestamp" data-type="timestamp" value="issue_date" class="ref_col_name">
                             <input type="hidden" data-col-type="timestamp" data-type="timestamp" value="due_date" class="ref_col_name">
                               <input type="hidden" data-col-type="text" data-type="text" value="comment" class="ref_col_name">
                         </div>
                         <h3>Extentions:</h3>
                         <textarea name="name" class="form-control f_ext" rows="3" cols="10"></textarea>
                         <!-- <button class="btn btn-primary add_ext">Add</button> -->
                         <!-- <br /><br /> -->
                         <!-- <div class="row ext_row">
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
                 </div>
               </div>`);

               $("#foreign_wrapper .row.foreign_wrapper").append(f_wrapper);
          }
        });

      }

    </script>

    <!-- <script src="https://code.jquery.com/jquery-1.12.4.js"></script> -->
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script type="text/javascript" src="./main.js"></script>
    <script type="text/javascript" src="./icons/autocomplete.js"></script>

    <!-- <script src="./deps/bootstrap-typeahead.js"></script>
    <script src="./deps/rangy-core.js"></script>
    <script src="./deps/caret-position.js"></script>
    <script src="./deps/bootstrap-tagautocomplete.js"></script> -->


  </body>
</html>

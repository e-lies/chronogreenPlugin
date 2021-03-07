var database_name =  (new URL(document.location.href)).searchParams.get('database');

$('body').ready(function(e){
  $("#columns_table tr").each(function(e){
    $(this).find('.form-control').prop('disabled', !$(this).find('.selected').is(':checked'))
  });

  $(".selected").change(function(e){
    $(this).parents().eq(1).find(".col_foreign").prop('checked',false).change();
    $(this).parents().eq(1).find('.form-control:not(.path)').prop('disabled', !$(this).is(':checked'));
  });

  // Checking all selectables
  $("#columns_table .selected_all").change(function(e){
    $(".selected").prop('checked', $(this).is(':checked'));
    $("#columns_table .form-control:not(.path), input[type='checkbox']").prop('disabled', !$(this).is(':checked'));
  });


  // Checking all filterables
  // $("#columns_table .filterable_all").change(function(e){
  //   $(".filterable").prop('checked', $(this).is(':checked'));
  // });

  $("#columns_table .unique_all").change(function(e){
    $(".col_unique").prop('checked', $(this).is(':checked'));
  });

  $("#columns_table .required_all").change(function(e){
    $(".col_required").prop('checked', $(this).is(':checked'));
  });


  // Add new auth
  $("button#add_auth").click(function(e){
    $("#auth_wrapper").append(auth_card());
  });


  // Adding a new auth condition
  $("body").delegate('button.add_auth_var', 'click', function(e){
    var elem = $(this).parents().eq(1).find('.card-body');
    $(elem).append(auth_var(elem));
  });

  // Removing rows
  $("body").delegate('button.remove_auth_var, button.remove_ext, button.remove_limit, button.remove_auth', 'click', function(e){
    if(!confirm('Are you sure ?')){
      return;
    }
    $(this).parents().eq(1).fadeOut(400, function(e){
      $(this).remove();
    });
  });

  // Adding a new extention
  $("button.add_ext").click(function(e){
    var labels = [];
    $(this).parent().find('.ref_col_names .ref_col_name').each(function(index, input){
      labels.push({
        label:$(input).val(),
        value:$(input).val(),
        col_name:$(input).val(),
        col_type:$(this).data('col-type'),
        data_type:$(this).data('type')
      });
    });
    $(this).parent().append(ext_row(labels));
  });


  // Adding limit condition
  $("button#add_limit").click(function(e){
    return $("#ext_wrapper .card-body .limit_row").length == 0 ? $("#ext_wrapper .card-body").append(limit_row()) : null;
  });


// Sometimes the user changes the label, so u have the replacate the change on the extentions conditions
// $("input.col_label").change(function(e){
//   // return console.log(  $(`select.ext_label option[data-col-name="${$(e.target).data('col-name')}"]`));
//   $(`select.ext_label option[data-col-name="${$(e.target).data('col-name')}"]`).replaceWith(
//     $(`<option value="${$(e.target).data('col-name')}" data-col-name="${$(e.target).data('col-name')}">${$(e.target).val()}</option>`)
//   );
// });

// Changing the operators and extention value in case the label type on the extention was changes
  $("body").delegate('select.ext_label', 'change', function(e){
    var label = $(e.target).val();
    var row = $(e.target).parents().eq(1);
    var option = $(this).find('option:selected');
    var type = {col_type: $(option).data('col-type'), data_type:$(option).data('type')};
    var ext_values = null;
    // $('.table#columns_table tr').each( function(index, row){
    //   if($(row).find('td:nth-child(4) input').val() == label){
    //     type = { col_type: $(row).find('td:nth-child(3) input.col_type').val() , data_type: $(row).find('td:nth-child(3) input.data_type').val()}
    //   }
    // });

    switch (type.data_type) {
      case 'set':
          var possibilities = [];
          type.col_type.slice(4, -1).replace(/["']/g,"").split(',').forEach( function(pos){
             possibilities.push({label: pos, value: pos});
          });

        ext_values = checkboxes_from_obj(possibilities, "form-control ext_value", label);
        break;

      case 'enum':
        var possibilities = [];
        type.col_type.slice(5, -1).replace(/["']/g,"").split(',').forEach( function(pos){
           possibilities.push({label: pos, value: pos});
        });
        // return console.log(possibilities);
        ext_values = select_from_obj(possibilities, "form-control ext_value", label);
        break;
      case 'varchar':
        ext_values = input_from_obj("form-control ext_value", label);
        break;
      case 'int':
        ext_values = int_from_obj("form-control ext_value", label);
        break;
      case 'float':
        ext_values = float_from_obj("form-control ext_value", label);
        break;
      default:
        ext_values = input_from_obj("form-control ext_value", label);
    }

    var ext_opers = select_from_obj(oper_options(type.data_type), 'form-control ext_oper', 'Choose operator');
    $(row).find('.ext_value').replaceWith(ext_values);
    $(row).find('.ext_oper').replaceWith(ext_opers);
  });


  // changing the operators and values in case the var name changes
  $("body").delegate('select.auth_var_name', 'change', function(e){
    var auth_var_name = $(this).val()
    var auth_var_val = $(this).parents().eq(1).find('.auth_var_val');
    var auth_var_oper = $(this).parents().eq(1).find('.auth_var_oper');
    // console.log(auth_var_val);
    $.getJSON(`./sessions/${database_name}_session_vars.json`, {},
      function(data){
        var auth_var_values = ``;
        var auth_var_opers = ``;
        var auth_type = data.vars[auth_var_name].type;
        // console.log(data.vars[auth_var_name]);
        switch (auth_type) {
          case 'set':
              auth_var_values = checkboxes_from_obj(data.vars[auth_var_name].values.map(function(value){
                 return {"label":value, "value":value} }
               ),
                "auth_var_val", "$_SESSION value");
            break;

          case 'enum':
            auth_var_values = select_from_obj(
                                data.vars[auth_var_name].values.map(function(value){
                                   return {"label":value, "value":value} }
                                 ),
                              "form-control auth_var_val", "$_SESSION value");

            break;
          case 'varchar':
          case 'int':
          case 'float':
            auth_var_values = input_from_obj("form-control auth_var_val", auth_var_name);
            break;
          default:
            auth_var_values = input_from_obj("form-control auth_var_val", auth_var_name);
          break;

        }
        auth_var_opers = select_from_obj(oper_options(auth_type), 'form-control auth_var_oper', 'Choose operator');

        $(auth_var_val).replaceWith(auth_var_values);
        $(auth_var_oper).replaceWith(auth_var_opers);
      });
  });
});//end of body ready



function auth_var(parent){
  $.getJSON(`./sessions/${database_name}_session_vars.json`, {}, function(data){
    var var_names_select = select_from_obj( Object.keys(data.vars).map(function(key){ return {"label":key, "value":key} }  ), "form-control auth_var_name", "$_SESSION var");
    var auth_var = `<div class="row auth_var">
      <div class="col-lg-3">
        ${var_names_select}
      </div>
      <div class="col-lg-3">
        ${select_from_obj([],'form-control auth_var_oper', 'Choose operator')}
      </div>
      <div class="col-lg-3">
        ${select_from_obj([], 'form-control auth_var_val','$_SESSION value' )}
      </div>
      <div class="col-lg-3">
        <button class="btn btn-danger remove_auth_var">Remove var</button>
      </div>
    </div>`;
    $(parent).append(auth_var);
  });
}
function oper_options(type){
  var opers = ``;
  switch (type) {
    case 'enum':
      opers = [
        {label:'=', value:'='}
      ]
      break;
    case 'set':
      opers = [
        {label:'CONTAINS', value:'contains'}
      ]
      break;
    case 'varchar':
      opers = [
        {label:'LIKE', value:'like'}
      ]
      break;
    case 'int':
    case 'float':
    default:
      opers = [
        {label: '>', value:'>'},
        {label: '<', value:'>'},
        {label: '=', value:'='},
        {label: '<>', value:'<>'},
      ];
      break;
  }
  return opers;
}
function select_from_obj(object, class_name, placeholder){
  options = ``;
  object.forEach(function(element){
    options += `<option value="${element.value}">${element.label}</option>`;
  });

  var select = `<select data-type="enum" required class="${class_name}">
                <option value="">${placeholder}</option>
                ${options}
                </select>`;

  return select;
}

function labels_select_from_obj(object, class_name, placeholder){
  options = ``;
  object.forEach(function(element){
    options += `<option data-col-name="${element.col_name}" data-col-type="${element.col_type}" data-type="${element.data_type}" value="${element.value}">${element.label}</option>`;
  });

  var select = `<select data-type="enum" required class="${class_name}">
                <option value="">${placeholder}</option>
                ${options}
                </select>`;

  return select;
}
function input_from_obj(class_name, placeholder){
  return `<input data-type="varchar" type="text" class="${class_name}" placeholder="${placeholder}" />`;
}
// function radios_from_obj(object, class_name, placeholder){
//   var radios = ``;
//   object.forEach( function(element){
//       radios += `
//       div class="form-check">
//         <input class="form-check-input" type="" name="radio" id="" value="${element}">
//         <label class="form-check-label" for="">
//           ${element}
//         </label>
//       </div>
//       `;
//   });
//
//   return radios;
//
// }

function int_from_obj(class_name, placeholder){
  return `<input data-type="int" type="number" class="${class_name}" placeholder="${placeholder}" />`;
}

function float_from_obj(class_name, placeholder){
  return `<input data-type="float" type="number" step="0.00001" class="${class_name}" placeholder="${placeholder}" />`;
}

function checkboxes_from_obj(object, class_name, placeholder){
  var checkboxes = `<div data-type="set" class="${class_name}">`;
  object.forEach( function(element){
      checkboxes += `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" name="" id="${element.value}" value="${element.value}">
          <label class="form-check-label" for="${element.value}">
            ${element.label}
          </label>
        </div>
      `;
  });
  checkboxes +=  `</div>`;
  return checkboxes;

}

function ext_row(labels){
  // return `<div class="row ext_row">hello</div>`;
  //
  // // var labels = [];
  // // $('.table#columns_table tr td:nth-child(4) input').each( function(index, input){
  // //   labels.push({label: $(input).val(), value: $(input).val(), col_name:$(input).data("col-name")});
  // // });

  labels = labels_select_from_obj(labels, 'form-control ext_label', 'Select column');
  var ext_row = $(`
    <div class="row ext_row">
      <div class="col-lg-3">
        ${labels}
      </div>
      <div class="col-lg-3">
        ${select_from_obj([], 'form-control ext_oper', 'Choose operator')}
      </div>
      <div class="col-lg-3">
        ${select_from_obj([], 'form-control ext_value', 'Choose value')}
      </div>
      <div class="col-lg-3">
        <button class="btn btn-danger remove_ext">Remove</button>
      </div>
    </div>
    <br />
    `);
  return ext_row;
}
function auth_card(){
  var auth_card = $(`<div class="card auth">
    <div class="card-body">
    </div>
    <div class="card-footer">
      <button class="btn btn-primary add_auth_var">Add new var</button>
      <button class="btn btn-danger remove_auth">Remove auth</button>
    </div>
  </div>`);
  auth_var(auth_card.find('.card-body'));
  return auth_card;
}
function limit_row(){
  var limit_row = $(`<div class="row limit_row">
    <div class="col-lg-3">
      <input type="text" value="limit" disabled class="form-control"/>
    </div>
    <div class="col-lg-3">
      <input type="number" id="limit_start" placeholder="from" class="form-control"/>
    </div>
    <div class="col-lg-3">
      <input type="number" id="limit_step" placeholder="step" class="form-control"/>
    </div>
    <div class="col-lg-3">
      <button class="btn btn-danger remove_limit">Remove</button>
    </div>
  </div><br />`);
  return limit_row;
}


$("body").ready(function(e){
  $("button#add_const").click(function(e){
    $("#const_wrapper .card-body").append(const_row(cols));
  });

  $("body").delegate("button.remove_const", "click",function(e){
    $(this).parents().eq(1).fadeOut(300, function(){
      $(e.target).parents().eq(1).remove();
    });
  });
});

function const_row(cols){

  var const_row = $(`
      <div class="row const">
        <div class="col-lg-4">
          <label for="">Column</label>
          ${select_from_obj(cols, 'form-control const_col', 'Choose a column')}
        </div>
        <div class="col-lg-4">
          <label for="">Value</label>
          <input type="text" placeholder="Ex: session(user_id)" class="form-control const_value" />
        </div>
        <div class="col-lg-4">
          <label for="">Remove:</label><br />
          <button class="btn btn-danger remove_const">Remove</button>
        </div>
      </div><br />
    `);
  return const_row;
}

$("body").ready(function(e){

  $(".col_icon").autocomplete({

    source:function(request, response){
      $.getJSON('./icons/icons.json', {}, function(data){
        response(data.filter( (icon) => icon.includes(request.term) ));
      })
    }

  }).each(function(i){
    $(this).autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append(`<div>${item.label} <i class="material-icons">${item.label}</i> </div>`)
        .appendTo( ul );
    };
  });

  function split( val ) {
    return val.split( /\s/ );
  }
  function extractLast( term ) {
    return split( term ).pop();
  }

  $(".f_wrapper").each(function(index, wrapper){
    // get the suggestion array
    var availableTags = [];
    $(this).find('.ref_col_names .ref_col_name').each(function(index, input){
      availableTags.push($(input).val());
    });

    // populate f_label and f_ext with em
    $(wrapper).find('.f_ext, .f_label')
      // don't navigate away from the field on tab when selecting an item
      .on( "keydown", function( event ) {
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
            availableTags, extractLast( request.term ) ) );
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
          this.value = terms.join(" ");
          return false;
        }
      });

  });
});

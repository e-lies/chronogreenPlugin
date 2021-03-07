$("body").ready(function(e){

  $(".col_icon").autocomplete({

    source:function(request, response){
      $.getJSON('./icons.json', {}, function(data){
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

});

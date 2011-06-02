$(function() {
  $(window).bind('hashchange', function(e) {
    $('#content').empty();
    var hash = e.fragment;
    if (hash == 'models') {
      $.each(ddoc.models, function(index, value) {
        $('#content').append('<p>'+index+'</p>');
      });
    }
  });

  $(window).trigger('hashchange');
});

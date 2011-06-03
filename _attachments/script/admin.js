var whiskers = require('lib/whiskers');

var getQuery = function(str) {
  var query;
  // get question mark index
  var qmi = str.indexOf('?');
  if (qmi != -1) {
    var query = str.substr(qmi+1);
  }
  return query;
};

$(function() {
  $(window).bind('hashchange', function(e) {
    $('#content').empty();
    var hash = e.fragment;
    var query = getQuery(hash);
    if (hash.indexOf('models') == 0) {
      var model;
      if (query) {
        model = ddoc.models[query];
      }
      if (model) {
        var modelStr = JSON.stringify(model, null, '  ');
        var view = {name: query, model:modelStr, lines:modelStr.split('\n').length};
        $('#content').append(whiskers.render(ddoc.templates.admin.model, view));
      } else {
        $.each(ddoc.models, function(index, value) {
          $('#content').append('<p><a href="#models?'+index+'">'+index+'</a></p>');
        });
      }
    }
  });

  $(window).trigger('hashchange');
});

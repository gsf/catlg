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

// from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
if(!Object.keys) Object.keys = function(o){
  if (o !== Object(o))
       throw new TypeError('Object.keys called on non-object');
  var ret=[],p;
  for(p in o) if(Object.prototype.hasOwnProperty.call(o,p)) ret.push(p);
  return ret;
}

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
        $('#modelForm').submit(function() {
          //$.couch.
          return false;
        });
      } else {
        var modelNames = Object.keys(ddoc.models).sort();
        for (var i=0, len=modelNames.length; i < len; i++) {
          $('#content').append('<p><a href="#models?'+modelNames[i]+'">'+modelNames[i]+'</a></p>');
        }
      }
    }
  });

  $(window).trigger('hashchange');
});

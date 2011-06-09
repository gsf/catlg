var catlg = require('lib/catlg');
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
      var names = Object.keys(ddoc.models).sort();
      var view = {names: names};
      var model;
      if (query) {
        model = ddoc.models[query];
      }
      if (model) {
        var modelStr = JSON.stringify(model, null, '  ');
        view.selected = query;
        view.model = modelStr;
        view.lines = modelStr.split('\n').length;
        $('#content').append(whiskers.render(ddoc.templates.admin.model, view));
      } else {
        view.selected = 'new';
        view.model = '{\n  "fields": [\n    {\n      "required": true,\n      "type": "string",\n      "name": "title"\n    },\n    {\n      "required": false,\n      "type": "string",\n      "name": "author"\n    }\n  ]\n}';
        $('#content').append(whiskers.render(ddoc.templates.admin.model, view));
      }
      $('#modelForm').submit(function() {
        var name = $('input[name="name"]').val();
        ddoc.models[name] = JSON.parse($('textarea').val());
        catlg.db.saveDoc(ddoc, {
          success: function(resp) {
            location.href = 'admin#models?'+name;
          }
        });
        return false;
      });
      $('input[name=delete]').click(function() {
        var name = $('input[name=name]').val();
        delete ddoc.models[name];
        catlg.db.saveDoc(ddoc, {
          success: function(resp) {
            location.href = 'admin#models';
          }
        });
      });
    }
  });

  $(window).trigger('hashchange');
});

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
      var models = [];
      for (var i=0, l=names.length; i<l; i++) {
        models.push({name: names[i], link: '#models?'+encodeURIComponent(names[i])});
      }
      var view = {models: models};
      var model;
      if (query) {
        var name = decodeURIComponent(query);
        model = ddoc.models[name];
      }
      if (model) {
        var modelStr = JSON.stringify(model, null, '  ');
        view.thisModel = {name: name, body: modelStr};
        $('#content').append(whiskers.render(ddoc.templates.admin.model, view));
      } else {
        view.thisModel = {name: 'new', body: '{\n  "fields": [\n    {\n      "required": true,\n      "type": "string",\n      "name": "some field"\n    },\n    {\n      "required": false,\n      "type": "string",\n      "name": "another field"\n    }\n  ]\n}'};
        $('#content').append(whiskers.render(ddoc.templates.admin.model, view));
      }
      $('#modelForm').submit(function() {
        var name = $('input[name="name"]').val();
        ddoc.models[name] = JSON.parse($('textarea').val());
        catlg.db.saveDoc(ddoc, {
          success: function(resp) {
            location.href = 'admin#models?'+encodeURIComponent(name);
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

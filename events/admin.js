var catlg = require('lib/catlg');
var mustache = require('lib/mustache');

exports.add = function() {
  var modelNames = (function() {
    var names = [];
    for (model in ddoc.models) {
      names.push(model);
    }
    return names.sort();
  })();
  var firstModel = ddoc.models[modelNames[0]];
  var view = {
    modelNames: modelNames,
    modelForm: catlg.buildForm(firstModel)
  };
  $('#lightbox').html(mustache.to_html(ddoc.templates.add, view))
    .fadeIn('slow', function() {});
  return false;
};

exports.modelSelect = function() {
  ddoc.models[$(this).text()];
  return false;
};

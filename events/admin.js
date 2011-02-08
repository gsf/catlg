var mustache = require('lib/mustache');

exports.add = function() {
  var view = {
    models: (function() {
      var names = [];
      for (model in ddoc.models) {
        names.push(model);
      }
      return names.sort();
    })()
  };
  $('#lightbox').html(mustache.to_html(ddoc.templates.add, view))
    .fadeIn('slow', function() {});
  return false;
};
exports.modelForm = function() {
  alert($('#model-type option:selected').text());
};

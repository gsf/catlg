var mustache = require('lib/mustache');

function(doc, req) {
  var ddoc = this;

  provides('html', function() {
    var view = {};
    if (doc) {
      for (var field in doc) {
        view[field] = doc[field];
      }
    }
    return mustache.to_html(ddoc.templates.doc, view, ddoc.templates.partials);
  });
}

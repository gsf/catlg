var mustache = require('lib/mustache');

function(doc, req) {
  var ddoc = this;

  provides('html', function() {
    var view = {
      doc: doc,
    };
    return mustache.to_html(ddoc.templates.doc, view, ddoc.templates.partials);
  });
}

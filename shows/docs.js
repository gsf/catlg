var catlg = require('lib/catlg');
var mustache = require('lib/mustache');

function(doc, req) {
  var ddoc = this;

  provides('html', function() {
    doc = catlg.dress(doc, ddoc.models);
    var view = {
      doc: doc,
    };
    return mustache.to_html(ddoc.templates.doc, view, ddoc.templates.partials);
  });
}

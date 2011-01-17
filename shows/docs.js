var catlg = require('lib/catlg');
var mustache = require('lib/mustache');

function(doc, req) {
  if (req.path[5] && (!doc)) {  // 5 is last segment of path
    throw (['error', 'not_found']);
  }
  var ddoc = this;

  provides('html', function() {
    doc = catlg.dress(doc, ddoc.models);
    var view = {
      db: ddoc.settings.db,
      doc: doc,
      req: JSON.stringify(req)
    };
    return mustache.to_html(ddoc.templates.doc, view, ddoc.templates.partials);
  });
}

var catlg = require('lib/catlg');
var mustache = require('lib/mustache');

function(doc, req) {
  var ddoc = this;

  provides('html', function() {
    var template;
    var view = {
      db: ddoc.settings.db,
      name: ddoc.settings.name,
      req: JSON.stringify(req)
    };
    if (req.id) { 
      view.doc = catlg.dress(doc, ddoc.models);
      template = ddoc.templates.doc;
    } else { // base template
      template = ddoc.templates.base;
    }
    return mustache.to_html(template, view, ddoc.templates.partials);
  });
}

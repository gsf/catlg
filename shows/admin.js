var catlg = require('lib/catlg');
var whiskers = require('lib/whiskers');

function(doc, req) {
  var ddoc = this;

  provides('html', function() {
    var template;
    var view = {
      name: ddoc.settings.name,
      req: JSON.stringify(req)
    };
    if (req.id) { // for html snapshots
      view.doc = catlg.dress(doc, ddoc.models);
      template = ddoc.templates.doc;
    } else { // base template
      template = ddoc.templates.base;
    }
    return whiskers.render(template, view, ddoc.templates.partials);
  });
}

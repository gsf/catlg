var mustache = require('lib/mustache');

function(doc, req) {
  var ddoc = this;

  provides('html', function() {
    doc.raw = JSON.stringify(doc);
    doc.model = ddoc.models[doc.type];
    doc.formatted = '';
    var first = true;
    for (var i in doc.model.fields) {
      var field = doc.model.fields[i];
      if (!doc[field.name]) {
        continue;
      }
      if (first) { // first field is header
        doc.formatted += '<h1>' + doc[field.name] + '</h1><dl>';
        first = false;
      } else {
        doc.formatted += '<dt>' + field.name + '</dt><dd>' + doc[field.name] + '</dd>';
      }
    }
    doc.formatted += '</dl>';
    var view = {
      doc: doc,
    };
    return mustache.to_html(ddoc.templates.doc, view, ddoc.templates.partials);
  });
}

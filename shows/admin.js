var whiskers = require('lib/whiskers');

function(doc, req) {
  var ddoc = this;

  provides('html', function() {
    var view = {
      settings: ddoc.settings
    };
    return whiskers.render(ddoc.templates.admin.base, view);
  });
}

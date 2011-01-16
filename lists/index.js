var mustache = require('lib/mustache');

function(head, req) {
  var ddoc = this;

  provides('html', function() {
    var view = {
      db: ddoc.settings.db
    };
    return mustache.to_html(ddoc.templates.index, view, 
      ddoc.templates.partials);
  });
}

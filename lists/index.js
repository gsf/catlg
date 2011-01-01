function(head, req) {
  var ddoc = this;
  var mustache = require('lib/mustache');

  provides('html', function() {
    var view;
    send(mustache.to_html(ddoc.templates.partials.head, view));
    while (row = getRow()) {
      send('\n' + JSON.stringify(row));
    }
    return mustache.to_html(ddoc.templates.partials.tail, view);
  });
};

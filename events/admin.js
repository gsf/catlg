var mustache = require('lib/mustache');

exports.add = function() {
  $('#lightbox').html(mustache.to_html(ddoc.templates.add))
    .fadeIn('slow', function() {});
  return false;
};

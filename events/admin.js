var mustache = require('lib/mustache');

exports.add = function() {
  $('body').append('<div id="box">'+mustache.to_html(ddoc.templates.add)+'</div>');
  $('#box').fadeIn('slow', function() {});
  return false;
};

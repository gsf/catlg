var db = require('lib/catlg').db();
var mustache = require('lib/mustache');

exports.titles = function() {
  db.view('catlg/title', {
    success: function(resp) {
      //$('#content').append('<p>' + JSON.stringify(resp) + '</p>');
      if (resp.length) {
        resp.rows.forEach(function(row) {
          $('#content').append('<article><h1><a href="'+escape(row.id)+'">'+row.key+'</a></h1></article>');
        });
      } else {
        $('#content').html(mustache.to_html(ddoc.templates.welcome)); 
      }
    },
    error: function(stat, error, reason) {
      $('#content').text('No docs found: ' + reason);
    }
  });
};

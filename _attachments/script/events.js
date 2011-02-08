var admin = require('events/admin');
var welcome = require('events/welcome');

$(function() {
  welcome.titles();
});
$('#admin-add').click(admin.add);

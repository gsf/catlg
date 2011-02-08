var admin = require('events/admin');
var welcome = require('events/welcome');

// show titles on doc load
welcome.titles();

// admin stuff
$('#admin-add').click(admin.add);

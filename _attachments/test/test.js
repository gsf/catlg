$(document).ready(function() {
  var db;
  var dbName = location.href.match(/\/([^/.]+)\//)[1];
  var testDbName = dbName + '/test';
  module('Prep');
  asyncTest('delete test db if it exists', function() {
    db = catlg.db(testDbName);
    db.info({
      success: function(resp) {
        db.drop({
          success: function(resp) {
            ok(true, 'test db deleted');
            start();
          },
          error: function(resp) {
            ok(false, 'could not delete test db');
            start();
          }
        });
      },
      error: function(resp) {
        equals(404, resp, 'test db does not exist');
        start();
      }
    });
  });
  asyncTest('replicate for test db', function() {
    // TODO: only works for local, non-secured DBs
    $.couch.replicate(dbName, testDbName, {
      success: function(resp) {
        ok(true, 'test db replicated');
        start();
      },
      error: function(resp) {
        ok(false, 'could not replicate');
        start();
      }
    }, 
    {create_target: true, doc_ids: ['_design/catlg']});
  });
  db = catlg.db(testDbName);
  module('Index');
  asyncTest('exists', function() {
    $.ajax({
      url: 'index.html',
      complete: function(xhr) {
        equals(xhr.status, 200, 'index.html status');
        start();
      }
    });
  });
  module('Models');
  asyncTest('create and delete good book', function() {
    var doc = fixture.goodbook;
    db.createDoc(doc, {
      success: function(resp) {
        ok(true, 'doc ' + resp.id + ' created');
        doc._id = resp.id;
        doc._rev = resp.rev;
        db.removeDoc(doc, {
          success: function(resp) {
            ok(true, 'doc ' + resp.id + ' deleted');
            start();
          },
          error: function(stat, error, reason) {
            ok(false, reason);
            start();
          }
        });
      },
      error: function(stat, error, reason) {
        ok(false, reason);
        start();
      }
    });
  });
  asyncTest('fail to create typeless doc', function() {
    var doc = fixture.typeless;
    db.createDoc(doc, {
      success: function(resp) {
        ok(false, 'Oh no, doc created');
        doc = {
          _id: resp.id,
          _rev: resp.rev
        };
        db.removeDoc(doc);
        start();
      },
      error: function(stat, error, reason) {
        equals(reason, 'The "type" field must match a model.');
        start();
      }
    });
  });
  asyncTest('fail to create doc with type that matches no models', function() {
    var doc = fixture.noModelMatch;
    db.createDoc(doc, {
      success: function(resp) {
        ok(false, 'Oh no, doc created');
        doc = {
          _id: resp.id,
          _rev: resp.rev
        };
        db.removeDoc(doc);
        start();
      },
      error: function(stat, error, reason) {
        equals(reason, 'The "type" field must match a model.');
        start();
      },
    });
  });
  module('Views');
  asyncTest('title, author', function() {
    db.bulkCreate(fixture.bulk, {
      success: function(resp) {
        db.view('catlg/title', {
          success: function(resp) {
            equals(resp.rows[1].key, "L'Étranger");
            start();
          },
          error: function(stat, error, reason) {
            ok(false, reason);
            start();
          }
        });
        db.view('catlg/author', {
          success: function(resp) {
            equals(resp.rows[1].key, "Camus, Albert");
            start();
          },
          error: function(stat, error, reason) {
            ok(false, reason);
            start();
          }
        });
      }
    });
  });
});

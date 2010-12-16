var db;
var dbName = location.href.match(/\/([^/.]+)\//)[1];
var testDbName = dbName + '/test';
var dbRepl = function(dbName, testDbName, cb) {
  $.couch.replicate(dbName, testDbName, {
    success: function() {
      db = catlg.db(testDbName);
      cb();
    },
    error: function(resp) {
      ok(false, 'Failed to create test db: ' + resp);
    }
  }, {create_target: true, doc_ids: ['_design/catlg']});
};
var dbCheck = function(cb) {
  db = catlg.db(testDbName);
  db.info({
    success: function() {
      cb();
    },
    error: function() {
      dbRepl(dbName, testDbName, cb);
    }
  });
};
var dbReset = function(cb) {
  db = catlg.db(testDbName);
  db.info({
    success: function() {
      db.drop({
        success: function(resp) {
          dbRepl(dbName, testDbName, cb);
        },
        error: function(stat, error, reason) {
          ok(false, 'Failed to drop test db: ' + reason);
        }
      });
    },
    error: function() {
      dbRepl(dbName, testDbName, cb);
    }
  });
};
$(document).ready(function() {
  module('Index');
  test('exists', function() {
    stop(5000);
    $.ajax({
      url: 'index.html',
      complete: function(xhr) {
        equals(xhr.status, 200, 'index.html status');
        start();
      }
    });
  });
  module('Models');
  test('create and delete book', function() {
    stop(5000);
    var doc = fixture.goodbook;
    dbCheck(function() {
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
  });
  test('fail to create typeless doc', function() {
    stop(5000);
    var doc = fixture.typeless;
    dbReset(function() {
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
  });
  test('fail to create doc with type that matches no models', function() {
    stop(5000);
    var doc = fixture.noModelMatch;
    dbCheck(function() {
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
  });
  module('Views');
  test('title', function() {
    stop(5000);
    dbReset(function() {
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
        },
        error: function(stat, error, reason) {
          ok(false, reason);
          start();
        }
      });
    });
  });
  test('author', function() {
    stop(5000);
    // TODO: use a key with view to avoid dbReset
    dbReset(function() {
      db.bulkCreate(fixture.bulk, {
        success: function(resp) {
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
        },
        error: function(stat, error, reason) {
          ok(false, reason);
          start();
        }
      });
    });
  });
  module('IDs');
  test('check ID functions', 2, function() {
    var id = catlg.genId();
    var decId = catlg.h2d(id);
    ok(decId < catlg.ID_UPPER_BOUND && decId > 0, decId + ' is a positive number less than the upper bound');
    var num = 823434235;
    equal(catlg.d2h(num), '31149bfb', 'decimal to hex converter works');
  });
  test('bulk create generates incremented IDs', 3, function() {
    stop(5000);
    dbCheck(function() {
      db.bulkCreate(fixture.bulk, {
        success: function(resp) {
          var idArray = [];
          for (var i in resp) {
            var doc = resp[i];
            idArray.push(doc.id);
          }
          equal(catlg.h2d(idArray[0]) + 1, catlg.h2d(idArray[1]));
          equal(catlg.h2d(idArray[1]) + 1, catlg.h2d(idArray[2]));
          equal(catlg.h2d(idArray[2]) + 1, catlg.h2d(idArray[3]));
          start();
        },
        error: function(stat, error, reason) {
          ok(false, reason);
          start();
        }
      });
    });
  });
});

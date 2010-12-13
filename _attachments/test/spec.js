describe('catlg', function() {
  describe('when go to index page', function() {
    it('should exist', function() {
      $.ajax({
        url: 'index.html',
        complete: function(xhr) {
          equals(xhr.status, 200, 'index.html status');
          start();
        }
      });
    });
  });
  describe('when access db', function() {
    var db;
    var dbName = location.href.match(/\/([^/.]+)\//)[1];
    var testDbName = dbName + '/test';
    beforeEach(function() {
      db = catlg.db(testDbName);
      db.info({
        success: function(resp) { // db exists -- drop it
          db.drop({
            success: function(resp) {
              $.couch.replicate(dbName, testDbName, {}, 
                {create_target: true, doc_ids: ['_design/catlg']});
            }
          });
        },
        error: function(resp) { // db doesn't exist
          $.couch.replicate(dbName, testDbName, {}, 
            {create_target: true, doc_ids: ['_design/catlg']});
        }
      });
    });
    it('should be able create and delete a book', function() {
      var doc = fixture.goodbook;
      runs(function() {
        db.createDoc(doc, {
          success: function(resp) {
            expect(resp.id).toMatch(/\w{4}/);
            doc._id = resp.id;
            doc._rev = resp.rev;
            db.removeDoc(doc, {
              success: function(resp) {
                expect(doc._id).toEqual(resp.id);
                start();
              }
            });
          }
        });
      });
    });
  });
});
//  asyncTest('fail to create typeless doc', function() {
//    var doc = fixture.typeless;
//    db.createDoc(doc, {
//      success: function(resp) {
//        ok(false, 'Oh no, doc created');
//        doc = {
//          _id: resp.id,
//          _rev: resp.rev
//        };
//        db.removeDoc(doc);
//        start();
//      },
//      error: function(stat, error, reason) {
//        equals(reason, 'The "type" field must match a model.');
//        start();
//      }
//    });
//  });
//  asyncTest('fail to create doc with type that matches no models', function() {
//    var doc = fixture.noModelMatch;
//    db.createDoc(doc, {
//      success: function(resp) {
//        ok(false, 'Oh no, doc created');
//        doc = {
//          _id: resp.id,
//          _rev: resp.rev
//        };
//        db.removeDoc(doc);
//        start();
//      },
//      error: function(stat, error, reason) {
//        equals(reason, 'The "type" field must match a model.');
//        start();
//      },
//    });
//  });
//  module('Views');
//  asyncTest('title, author', function() {
//    db.bulkCreate(fixture.bulk, {
//      success: function(resp) {
//        db.view('catlg/title', {
//          success: function(resp) {
//            equals(resp.rows[1].key, "L'Étranger");
//            start();
//          },
//          error: function(stat, error, reason) {
//            ok(false, reason);
//            start();
//          }
//        });
//        db.view('catlg/author', {
//          success: function(resp) {
//            equals(resp.rows[1].key, "Camus, Albert");
//            start();
//          },
//          error: function(stat, error, reason) {
//            ok(false, reason);
//            start();
//          }
//        });
//      }
//    });

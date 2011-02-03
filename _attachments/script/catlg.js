var catlg = {
  ID_UPPER_BOUND: 4294967295,
  ID_LENGTH: 8,

  // decimal to hex converter
  d2h: function(dec) {
    return dec.toString(16);
  },

  // hex to decimal converter
  h2d: function(hex) {
    return parseInt(hex, 16);
  },

  // pad ID with zeroes
  pad: function(id) {
    while (id.length < catlg.ID_LENGTH) {
      id = '0' + id;
    }
    return id;
  },

  // generate 8-digit hex ID
  genId: function() {
    var id = catlg.d2h(Math.floor(Math.random()*catlg.ID_UPPER_BOUND));
    return catlg.pad(id);
  },

  // increment ID
  incId: function(id) {
    var dec = catlg.h2d(id);
    dec++;
    if (dec > catlg.ID_UPPER_BOUND) {
      dec = 0;
    }
    return catlg.pad(catlg.d2h(dec));
  },

  // set versioning on db and set some new methods
  db: function(dbName) {
    var db = $.couch.db(dbName, {attachPrevRev: true});
    db.createDoc = function(doc, options) {
      doc._id = catlg.genId();
      db.saveDoc(doc, options);
    };
    db.bulkCreate = function(docs, options) {
      var id = catlg.genId();
      for (var i in docs.docs) {
        docs.docs[i]._id = id;
        id = catlg.incId(id);
      }
      db.bulkSave(docs, options);
    };
    return db;
  }
};

$.getJSON('_ddoc', function(data) {
  catlg.ddoc = data;
});

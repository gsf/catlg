var catlg = {};

// base62 ordered according to Unicode Collation Algorithm
catlg._base62 = '0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ';

catlg._base62Choice = function() {
  return catlg._base62[Math.floor(Math.random()*62)]
};

//catlg._idInc = function(id) {
//  // TODO: allow for varying ID lengths
//  var base62Inc 
//  var i3inc = catlg._base62.indexOf(id[3]) + 1;
//  if (i3inc < 62) {
//    return id.substr(0, 3) + i3inc;
//  } else {
//    var i3inc = 0;
//    var i2inc = catlg._base62.indexOf(id[2]) + 1;
//    if (i2inc
//};

catlg._generateId = function() {
  var id = '';
  for (var i=0; i<4; i++) {
    id += catlg._base62Choice();
  }
  return id;
}


catlg.db = function(dbName) {
  var db = $.couch.db(dbName, {attachPrevRev: true});
  db.createDoc = function(doc, options) {
    doc._id = catlg._generateId();
    db.saveDoc(doc, options);
  };
  db.bulkCreate = function(docs, options) {
    // TODO: sequential IDs
    //var id = catlg._generateId();
    for (var i in docs.docs) {
      //docs.docs[i]._id = id;
      //catlg._base62increment(id);
      docs.docs[i]._id = catlg._generateId();
    }
    db.bulkSave(docs, options);
  };
  return db;
};

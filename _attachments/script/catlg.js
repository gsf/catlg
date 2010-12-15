var catlg = {};

catlg.ID_LENGTH = 4;

catlg._base62 = {};

// base62 ordered according to Unicode Collation Algorithm
catlg._base62.str = '0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ';

// choose a random base62 digit
catlg._base62.choice = function() {
  return catlg._base62.str[Math.floor(Math.random()*62)]
};

// increment base62 ID
// TODO: compare speed with full conversion to base10 for incrementing
// (e.g., 'Ab3a' => '11120310') 
catlg._base62.inc = function(id) {
  var digit = id.length - 1;
  var padding = '';
  var increment = function(digit, padding) {
    var base10 = catlg._base62.str.indexOf(id[digit]);
    if (base10 < 61) {
      var incremented = catlg._base62.str[base10 + 1];
      return id.substr(0, digit) + incremented + padding;
    } 
    // TODO: case when all digits flip ('ZZZZ' => '0000')
    digit = digit - 1;
    padding = padding + '0';
    increment(digit, padding);
  };
  return increment(digit, padding);
};

// generate base62 ID
catlg._base62.id = function(length) {
  length = length || catlg.ID_LENGTH;
  var id = '';
  for (var i=0; i<length; i++) {
    id += catlg._base62.choice();
  }
  return id;
}

catlg.db = function(dbName) {
  var db = $.couch.db(dbName, {attachPrevRev: true});
  db.createDoc = function(doc, options) {
    doc._id = catlg._base62.id();
    db.saveDoc(doc, options);
  };
  db.bulkCreate = function(docs, options) {
    var id = catlg._base62.id();
    for (var i in docs.docs) {
      docs.docs[i]._id = id;
      id = catlg._base62.inc(id);
    }
    db.bulkSave(docs, options);
  };
  return db;
};

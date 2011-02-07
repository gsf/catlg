exports.fieldDisplay = function(field, value) {
  var display = '';
  if (value) {
    var displayValue;
    if (field.repeatable) {
      if (field.separator) {
        displayValue = value.join(field.separator + ' ');
      } else {
        displayValue = value.join(', ');
      }
    } else {
      displayValue = value;
    }
    if (field.header) {
      display += '<h1 class="display" id="' + field.name + '-display">' + displayValue + '</h1>\n';
    } else {
      display += '<div class="display" id="' + field.name + '-display">\n  <span class="fieldname">' + field.name + ':</span> <span class="fieldvalue">' + displayValue + '</span>\n</div>\n';
    }
  }
  display += '<div id="' + field.name + '-div" class="input">\n  <label for="' + field.name + '">' + field.name + ':</label> ' + exports.fieldInput(field, value) + '\n</div>\n';
  return display;
};

exports.fieldInput = function(field, value) {
  value = value || '';
  var classArray = [];
  if (field.required) {
    classArray.push('required');
  }
  if (field.repeatable) {
    classArray.push('repeatable');
    if (value) {
      if (field.separator) {
        value = value.join(field.separator + ' ');
      } else {
        value = value.join(', ');
      }
    }
  }
  if (field.type === 'email') {
    classArray.push('email');
  }
  if (field.type === 'url') {
    classArray.push('url');
  }
  var classes = classArray.join(' ');
  var type = 'text';
  if (field.type === 'date') {
    type = 'date';
  }
  var separator = field.separator ? ' separator="' + field.separator + '"' : '';
  return '<input id="' + field.name + '" name="' + field.name + '" type="' + type + '" class="' + classes + '" value="' + value + '"' + separator + '>';
};

// Dress up a doc real pretty
exports.dress = function(doc, models) {
  if (!doc) throw(['error', 'not_found']);
  doc.raw = JSON.stringify(doc);
  doc.model = models[doc.type];
  if (!doc.model) throw(['error', 'not_found', 'no model for document']);
  doc.formatted = '';
  for (var i = 0; i < doc.model.fields.length; i++) {
    var field = doc.model.fields[i];
    var value = doc[field.name];
    var displayName = field.name + 'Display';
    doc[displayName] = exports.fieldDisplay(field, value);
    var inputName = field.name + 'Input';
    doc[inputName] = exports.fieldInput(field, value);
    doc.formatted += doc[displayName];
  }
  return doc;
};

exports.id = {
  UPPER_BOUND: 4294967295,
  LENGTH: 8,

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
    while (id.length < exports.id.LENGTH) {
      id = '0' + id;
    }
    return id;
  },

  // generate 8-digit hex ID
  gen: function() {
    var id = exports.id.d2h(Math.floor(Math.random()*exports.id.UPPER_BOUND));
    return exports.id.pad(id);
  },

  // increment ID
  inc: function(id) {
    var dec = exports.id.h2d(id);
    dec++;
    if (dec > exports.id.UPPER_BOUND) {
      dec = 0;
    }
    return exports.id.pad(exports.id.d2h(dec));
  }
};

// set versioning on db and create some new methods
exports.db = function(dbName) {
  var db = $.couch.db(dbName, {attachPrevRev: true});
  db.createDoc = function(doc, options) {
    doc._id = exports.id.gen();
    db.saveDoc(doc, options);
  };
  db.bulkCreate = function(docs, options) {
    var id = exports.id.gen();
    for (var i in docs.docs) {
      docs.docs[i]._id = id;
      id = exports.id.inc(id);
    }
    db.bulkSave(docs, options);
  };
  return db;
};

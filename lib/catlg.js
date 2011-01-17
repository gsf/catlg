exports.dress = function(doc, models) {
  doc.raw = JSON.stringify(doc);
  doc.model = models[doc.type];
  doc.formatted = '';
  var first = true;
  for (var i = 0; i < doc.model.fields.length; i++) {
    var field = doc.model.fields[i];
    if (doc[field.name]) {
      if (first) { // first field is header
        doc.formatted += '<h1>' + doc[field.name] + '</h1><dl>';
        first = false;
      } else {
        doc.formatted += '<dt>' + field.name + '</dt><dd>' + doc[field.name] + '</dd>';
      }
    }
  }
  doc.formatted += '</dl>';
  return doc;
};


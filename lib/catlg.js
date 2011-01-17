exports.fieldDisplay = function(field, value) {
  if (!value) {
    return '';
  }
  var display;
  if (field.repeatable) {
    display = value.join(', ');
  } else {
    display = value;
  }
  return display;
};

exports.fieldInput = function(field, value) {
  value = value || '';
  var input = '';
  if (field.type === 'date') {
    input += '<input id="' + field.name + '-input" name="' + field.name + '" type="text" value="' + value + '">';
  } else {
    input += '<input id="' + field.name + '-input" name="' + field.name + '" type="text" value="' + value + '">';
  }
  return input;
};

// Dress up a doc real pretty
exports.dress = function(doc, models) {
  if (!doc) {
    return;
  }
  doc.raw = JSON.stringify(doc);
  doc.model = models[doc.type];
  doc.formatted = '';
  for (var i = 0; i < doc.model.fields.length; i++) {
    var field = doc.model.fields[i];
    var value = doc[field.name];
    var displayName = field.name + '-display';
    doc[displayName] = exports.fieldDisplay(field, value);
    var inputName = field.name + '-input';
    doc[inputName] = exports.fieldInput(field, value);
    if (value) {
      if (field.header) {
        doc.formatted += '<h1 id="' + field.name + '">' + doc[displayName] + '</h1>\n';
      } else {
        doc.formatted += '<div id="' + field.name + '"><span class="fieldname">' + field.name + ':</span> <span class="fieldvalue">' + doc[displayName] + '</span></div>\n';
      }
    } 
    doc.formatted += '<div id="' + inputName + '-div">\n  <label for="' + inputName + '">' + field.name + ':</label> ' + doc[inputName] + '\n</div>\n';
  }
  return doc;
};


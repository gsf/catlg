exports.fieldDisplay = function(field, value) {
  var display = '';
  if (value) {
    var displayValue;
    if (field.repeatable) {
      displayValue = value.join(', ');
    } else {
      displayValue = value;
    }
    if (field.header) {
      display += '<h1 id="' + field.name + '">' + displayValue + '</h1>\n';
    } else {
      display += '<div id="' + field.name + '">\n  <span class="fieldname">' + field.name + ':</span> <span class="fieldvalue">' + displayValue + '</span>\n</div>\n';
    }
  }
  display += '<div id="' + field.name + '-input-div" class="input">\n  <label for="' + field.name + '-input">' + field.name + ':</label> ' + exports.fieldInput(field, value) + '\n</div>\n';
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
  if (!doc) return;
  doc.raw = JSON.stringify(doc);
  doc.model = models[doc.type];
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


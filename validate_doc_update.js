function (newDoc, oldDoc, userCtx, secObj) {
  var model = this.models[newDoc.type];
  var key, field;
  for (key in model.fields) {
    field = model.fields[key];
    if (field.required && newDoc[key] === undefined) {
      throw({forbidden: 'The "' + key + '" field is required.'});
    }
  }
}

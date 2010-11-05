function (newDoc, oldDoc, userCtx, secObj) {
  // Applies to all docs
  // XXX: take care of in updates?
  //if (!newDoc.timestamp) {
  //  throw({forbidden: 'A timestamp is required.'});
  //}

  // Validate against model based on type
  var model = this.models[newDoc.type];
  if (!model) {
    throw({forbidden: 'The "type" field must match a model.'});
  }
  var key, field;
  for (i in model.fields) {
    field = model.fields[i];
    if (field.required && !newDoc[field.name]) {
      throw({forbidden: 'The "' + field.name + '" field is required.'});
    }
    // Already tested for required, so if field isn't defined skip the rest
    if (newDoc[field.name] === undefined) {
      continue;
    }

    // XXX: constructor results in "Error: case_clause {[]}"
    //throw({forbidden: newDoc.author.constructor});

    // Got the idea for eval(uneval(x)) from 
    // http://wiki.apache.org/couchdb/Introduction_to_CouchDB_views
    if (field.repeatable && !(eval(uneval(newDoc[field.name])) instanceof Array)) {
      throw({forbidden: 'The "' + field.name + '" field must be an array.'});
    }
  }
}

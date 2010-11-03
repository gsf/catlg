function (newDoc, oldDoc, userCtx, secObj) {
  var m = require("lib/model");
  for (var model in m.models) {
    if (newDoc.type == model.type) {
      for (var field in model.fields) {
        if (field.required) {
          throw({forbidden: 'The "' + field.name + '" field is required.'});
        }
      }
    }
  }
}

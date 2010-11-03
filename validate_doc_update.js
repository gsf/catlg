function (newDoc, oldDoc, userCtx, secObj) {
  var m = require("models");
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

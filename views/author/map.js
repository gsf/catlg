function(doc) {
  if (doc.author) {
    // author field should be an array
    for (var i in doc.author) {
      emit(doc.author[i], doc);
    }
  }
}

// Set up commonJS require() for ddoc libs in the browser
// Cribbed from https://github.com/caolan/kanso mostly

(function(global) {
  // Use lower-level ajax function to set async to false 
  // so ddoc is available on page load
  $.ajax({
    url: '_ddoc', 
    async: false,
    dataType: 'json',
    success: function(data) {
      global.ddoc = data;
    }
  });

  var module = {
    moduleCache: {}
  };

  module.normalizePath = function(p) {
    var path = [];
    var parts = p.split('/');
    for (var i = 0; i < parts.length; i += 1) {
      if (parts[i] === '..') {
        path.pop();
      }
      else if (parts[i] !== '.') {
        path.push(parts[i]);
      }
    }
    return path.join('/');
  };

  module.getPropertyPath = function(obj, p) {
    // normalize to remove unnecessary . and .. from paths
    var parts = module.normalizePath(p).split('/');

    // if path is empty, return the root object
    if (!p) {
      return obj;
    }

    // loop through all parts of the path, throwing an exception
    // if a property doesn't exist
    var a = obj;
    for (var i = 0; i < parts.length; i += 1) {
      var x = parts[i];
      if (a[x] === undefined) {
        throw new Error('Invalid path: ' + p);
      }
      a = a[x];
    }
    return a;
  };

  module.createRequire = function(current) {
    return function(target) {
      if (!global.ddoc) {
        throw new Error('no design doc loaded');
      }
      var path;
      if (target.charAt(0) === '.') {
        var dir = function(current) {
          if (p === '/') {
            return p;
          }
          var parts = p.split('/');
          parts.pop();
          if (parts.length === 1 && parts[0] === '') {
            return '/';
          }
          return parts.join('/');
        };
        path = module.normalizePath(dir + '/' + target);
      }
      else {
        path = module.normalizePath(target);
      }
      if (!module.moduleCache[path]) {
        var aModule = {exports: {}};
        var fn;
        eval('fn = (function(module, exports, require) {' +
          module.getPropertyPath(global.ddoc, path) +
        '});');
        fn(aModule, aModule.exports, module.createRequire(path));
        module.moduleCache[path] = aModule.exports;
      }
      return module.moduleCache[path];
    };
  };

  global.require = module.createRequire('');
  global.module = module;
})(this);

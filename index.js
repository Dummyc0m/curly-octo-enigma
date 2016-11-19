/*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra
    Edited Guilherme Bernal @lbguilherme
*/
var loaderUtils = require("loader-utils");
var fs = require('fs');

module.exports = function(content) {
    this.cacheable && this.cacheable();
    if (!this.emitFile) throw new Error("emitFile is required from module system");
    var query = loaderUtils.parseQuery(this.query);
    var url = loaderUtils.interpolateName(this, query.name || "[hash].[ext]", {
        context: query.context || this.options.context,
        content: content,
        regExp: query.regExp
    });
    copyFile(this.resourcePath, url, function () {
        console.log('File copied from ' + this.resourcePath + ' to ' + url)
    })
    return "try { global.process.dlopen(module, __webpack_public_path__ + " + JSON.stringify(url) + "); } catch(e) { " +
        "throw new Error('Cannot load native module ' + " + JSON.stringify(url) + " + ': ' + e); }";
}

var copyFile = function (source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

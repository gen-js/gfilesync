var
  fs = require('fs'),
  path = require('path'),
  mkdirp = require('mkdirp'),
  ejs = require('ejs'),
  isBinaryFile = require("isbinaryfile");

var GFileSync = (function() {
  function GFileSync() {

  }
  GFileSync.prototype.mkdir = function(dir) {
    mkdirp.sync(dir);
  };
  GFileSync.prototype.isAbsolute = function(filepath) {
    return filepath.charAt(0) == '/' || (filepath.charAt(1) == ':' && filepath.charAt(2) == path.sep);
  };
  GFileSync.prototype.copy = function(infile, outfile) {
    try {
      if(!this.isAbsolute(infile)) {
        infile = path.join(process.cwd(), infile);
      }
      if(!this.isAbsolute(outfile)) {
        outfile = path.join(process.cwd(), outfile);
      }

      if(!fs.existsSync(infile)) {
        console.log('Error: input file does not exist:',infile);
        return;
      }
      var data = fs.readFileSync(infile);
      data = '' + data;
      this.mkdir(path.dirname(infile));
      fs.writeFileSync(outfile, data);

      console.log('=> ', outfile);

    } catch(e) {
      throw e;
    }
  };
  GFileSync.prototype.template = function(inFile, outFile, params) {
    try {
      if(!this.isAbsolute(infile)) {
        infile = path.join(process.cwd(), infile);
      }
      if(!this.isAbsolute(outfile)) {
        outfile = path.join(process.cwd(), outfile);
      }

      if(!fs.existsSync(infile)) {
        console.log('Error: input file does not exist:',infile);
        return;
      }
      var data = fs.readFileSync(infile);

      data = ejs.render(''+data, params);

      this.mkdir(path.dirname(infile));
      fs.writeFileSync(outfile, data);

      console.log('=> ', outfile);

    } catch(e) {
      throw e;
    }
  };
  return GFileSync;
})();

module.exports = GFileSync;
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
  GFileSync.prototype.copy = function(infile, outfile) {
    try {
      if(!path.isAbsolute(infile)) {
        infile = path.join(process.cwd(), infile);
      }
      if(!path.isAbsolute(outfile)) {
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
      if(!path.isAbsolute(infile)) {
        infile = path.join(process.cwd(), infile);
      }
      if(!path.isAbsolute(outfile)) {
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
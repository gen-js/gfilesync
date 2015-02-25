var
  fs = require('fs'),
  path = require('path'),
  mkdirp = require('mkdirp'),
  ejs = require('ejs'),
  isBinaryFile = require("isbinaryfile"),
  yaml = require("js-yaml");

var GFileSync = (function() {
  function GFileSync() {

  }
  GFileSync.prototype.mkdir = function(dir) {
    mkdirp.sync(dir);
  };
  GFileSync.prototype.isAbsolute = function(filepath) {
    return filepath.charAt(0) == '/' || (filepath.charAt(1) == ':' && filepath.charAt(2) == path.sep);
  };
  GFileSync.prototype.loadYaml = function(file) {
    if(!this.isAbsolute(file)) {
      file = path.join(process.cwd(), file);
    }
    try {
      var content = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
    }
    catch(e) {
      console.log('Error : bad YAML file : ', file);
      throw e;
    }
    return content;
  };
  GFileSync.prototype.writeYaml = function(file, content) {
    if(!this.isAbsolute(file)) {
      file = path.join(process.cwd(), file);
    }
    try {
      var yamlContent = yaml.safeDump(content);
      fs.writeFileSync(file, yamlContent, 'utf8');
    }
    catch(e) {
      console.log('Error : write YAML file : ', file);
      throw e;
    }
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

module.exports = new GFileSync();
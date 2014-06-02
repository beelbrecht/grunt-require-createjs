/*
 * grunt-require-createjs
 * http://chrislearn.im/
 *
 * Licensed under the MIT license.
 */

'use strict';
var chalk = require('chalk');
var prettyBytes = require('pretty-bytes');

module.exports = function (grunt) {
  grunt.registerMultiTask('require-createjs', 'require-createjs', function () {
    var options = this.options();

    this.files.forEach(function (file) {
      var rjs;
      var src = file.src[0];

      if (!grunt.file.exists(src || ' ')) {
        return grunt.log.warn('Source file "' + chalk.cyan(src) + '" not found.');
      }

      var ojs = grunt.file.read(src);

      try {
        rjs = ojs.replace(/\(function.*?\{([\w\W]*)\}\)\([\w\W]*/g, 'define([], function(){\nvar lib, img = images||{}, cjs = createjs;$1return lib;\n});');
      } catch (err) {
        return grunt.warn(file.src + '\n' + err);
      }

      if (rjs.length < 1) {
        grunt.log.warn('Destination not written because minified HTML was empty.');
      } else {
        grunt.file.write(file.dest, rjs);
        grunt.log.writeln('Converted ' + chalk.cyan(file.dest) + ' ' + prettyBytes(ojs.length) + ' → ' + prettyBytes(rjs.length));
      }
    });
  });
};

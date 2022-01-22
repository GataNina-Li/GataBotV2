module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.initConfig({
    jshint: {
      all: [
        'lib/**/*.js',
        './*.js',
        '!./test.js'
      ]
    }
  });
};
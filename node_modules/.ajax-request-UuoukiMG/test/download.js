var assert = require('assert');
var app = require('./service/app');
var util = require('utils-extend');
var request = require('../index');
var fs = require('file-system');
var path = require('path');
var srcPath = path.join(__dirname, 'service/assets');
var rootPath = path.join(__dirname, 'download');
var server;

describe('Download request', function() {
  // Start service
  beforeEach(function(done){
    server = app.listen(3100, function() {
      done();
    });
  });

  it('html', function(done) {
    request.download({
      url: 'http://127.0.0.1:3100/index.html',
      rootPath: rootPath
    }, function(err, res, body, dest) {
      var c1 = fs.readFileSync(path.join(srcPath, 'index.html'));
      var c2 = fs.readFileSync(path.join(rootPath, 'index.html'));

      assert.equal(c1.length, c2.length);
      assert.equal(c1.toString(), c2.toString());
      done();
    });
  });

  it('png', function(done) {
    request.download({
      url: 'http://127.0.0.1:3100/index.png',
      rootPath: rootPath
    }, function(err, res, body, dest) {
      var c1 = fs.readFileSync(path.join(srcPath, 'index.png'));
      var c2 = fs.readFileSync(path.join(rootPath, 'index.png'));

      assert.equal(c1.length, c2.length);
      assert.equal(c1.toString(), c2.toString());
      done();
    });
  });

  it('gif', function(done) {
    request.download({
      url: 'http://127.0.0.1:3100/index.gif',
      rootPath: rootPath
    }, function(err, res, body, dest) {
      var c1 = fs.readFileSync(path.join(srcPath, 'index.gif'));
      var c2 = fs.readFileSync(path.join(rootPath, 'index.gif'));

      assert.equal(c1.length, c2.length);
      assert.equal(c1.toString(), c2.toString());
      done();
    });
  });

  it('zip', function(done) {
    request.download({
      url: 'http://127.0.0.1:3100/index.zip',
      rootPath: rootPath
    }, function(err, res, body, dest) {
      var c1 = fs.readFileSync(path.join(srcPath, 'index.zip'));
      var c2 = fs.readFileSync(path.join(rootPath, 'index.zip'));

      assert.equal(c1.length, c2.length);
      assert.equal(c1.toString(), c2.toString());
      done();
    });
  });

  it('deep path', function(done) {
    request.download({
      url: 'http://127.0.0.1:3100/index.html',
      rootPath: path.join(rootPath, '1/2')
    }, function(err, res, body, dest) {
      var c1 = fs.readFileSync(path.join(srcPath, 'index.html'));
      var c2 = fs.readFileSync(path.join(path.join(rootPath, '1/2'), 'index.html'));

      assert.equal(c1.length, c2.length);
      assert.equal(c1.toString(), c2.toString());
      done();
    });
  });

  it('ignore', function(done) {
    request.download({
      url: 'http://127.0.0.1:3100/Capital/index.html',
      ignore: true,
      rootPath: rootPath
    }, function(err, res, body, dest) {
      var c1 = fs.readFileSync(path.join(srcPath, 'Capital/index.html'));
      var c2 = fs.readFileSync(path.join(rootPath, 'capital/index.html'));

      assert.equal(c1.length, c2.length);
      assert.equal(c1.toString(), c2.toString());
      done();
    });
  });

  it('destPath string', function(done) {
    var dest = path.join(rootPath, 'dest/index.html');
    request.download({
      url: 'http://127.0.0.1:3100/index.html',
      destPath: dest
    }, function(err, res, body, dest) {
      var c1 = fs.readFileSync(path.join(srcPath, 'index.html'));
      var c2 = fs.readFileSync(dest);

      assert.equal(c1.length, c2.length);
      assert.equal(c1.toString(), c2.toString());
      done();
    });
  });

  it('destPath function', function(done) {
    var dest = path.join(rootPath, 'dest/index.html');
    request.download({
      url: 'http://127.0.0.1:3100/index.html',
      destPath: function(filename) {
        assert.equal(filename, 'index.html');
        return dest;
      }
    }, function(err, res, body, dest) {
      var c1 = fs.readFileSync(path.join(srcPath, 'index.html'));
      var c2 = fs.readFileSync(dest);

      assert.equal(c1.length, c2.length);
      assert.equal(c1.toString(), c2.toString());
      done();
    });
  });



  afterEach(function(){
    server.close();
    fs.rmdirSync(rootPath);
  });
});
var assert = require('assert');
var app = require('./service/app');
var util = require('utils-extend');
var request = require('../index');
var server;

describe('Request error', function() {
  // Start service
  beforeEach(function(done){
    server = app.listen(3100, function() {
      done();
    });
  });

  it('404', function(done) {
    request('http://127.0.0.1:3100/404', function(err, res, body) {
      assert.equal(res.statusCode, 404);
      done();
    });
  });

  it('500', function(done) {
    request('http://127.0.0.1:3100/500', function(err, res, body) {
      assert.equal(res.statusCode, 500);
      done();
    });
  });

  afterEach(function(){
    server.close();
  });
});
var assert = require('assert');
var app = require('./service/app');
var util = require('utils-extend');
var request = require('../index');
var server;

describe('Http post', function() {
  // Start service
  beforeEach(function(done){
    server = app.listen(3100, function() {
      done();
    });
  });

  it('Request post', function(done) {
    request({
      url: 'http://127.0.0.1:3100/save',
      method: 'POST',
      data: {
        id: 1
      },
      json: true
    }, function(err, res, body) {
      assert.deepEqual(body, { id: 1});
      done();
    });
  });

  it('Post method', function(done) {
    request.post({
      url: 'http://127.0.0.1:3100/save',
      data: {
        id: 1
      },
      json: true
    }, function(err, res, body) {
      assert.deepEqual(body, { id: 1});
      done();
    });
  });

  afterEach(function(){
    server.close();
  });
});
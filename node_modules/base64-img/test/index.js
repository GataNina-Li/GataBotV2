var assert = require('assert');
var fs = require('fs');
var path = require('path');
var base64Img = require('../base64-img');

function getpath(filepath) {
  return path.join(__dirname, filepath);
}

function readFileSync(filepath, encoding) {
  return fs.readFileSync(path.join(__dirname, filepath), { encoding: encoding || 'base64' });
}

describe('Test', function() {
  it('All test', function(done) {
    var demo = readFileSync('img/demo.png');

    base64Img.base64(getpath('img/demo.png'), function(err, data) {
      base64Img.img(data, getpath('dest'), '1', function(err, filepath) {
        assert.equal(filepath, getpath('dest/1.png'));
        assert.equal(demo, readFileSync('dest/1.png'));
        done();
      });      
    });
  });

  it('All test sync', function() {
    var demo = readFileSync('img/demo.png');
    var data = base64Img.base64Sync(getpath('img/demo.png'));
    var filepath = base64Img.imgSync(data, getpath('dest'), '2'); 
    
    assert.equal(filepath, getpath('dest/2.png'));  
    assert.equal(demo, readFileSync('dest/2.png')); 
  });

  describe('img', function() {
    it('Image base64 data error', function() {
      assert.throws(
        function() {
          base64Img.imgSync('data:');
        },
        function(err) {
          if (/base64/.test(err)) {
            return true;
          }
        }
      );
    });

    it('jpeg', function() {
      var data = base64Img.base64Sync(getpath('img/demo.png')).replace('image/png', 'image/jpeg');
      var filepath = base64Img.imgSync(data, getpath('dest'), '3');
       assert.equal('.jpg', path.extname(filepath));
    });

    it('request', function(done) {
      var url = 'http://webresource.c-ctrip.com/ResCRMOnline/R5/html5/images/57.png';
      var demo = readFileSync('img/demo.png');
      var data = base64Img.base64Sync(getpath('img/demo.png'));
      
      base64Img.requestBase64(url, function(err, res, body) {
        if (err) {
          done();
          return console.log(err);
        }

        assert.equal(body.substr(0, 10), data.substr(0, 10));
        done();
      });
    });
  });

  it('Svg', function() {
    var data = base64Img.base64Sync(getpath('img/car.svg'))

    fs.writeFileSync(getpath('dest/svg.html'), `<img src="${data}">`, { encoding: 'utf8'})

    base64Img.imgSync(data, getpath('dest'), '4')
  })
});
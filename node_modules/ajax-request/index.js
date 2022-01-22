/**
 * @fileoverview Http request in node.js
 * @author douzi <liaowei08@gmail.com> 
 */
var http = require('http');
var util = require('utils-extend');
var url = require('url');
var path = require('path');
var querystring = require('querystring');
var file = require('file-system');

/**
 * @description
 * http request
 * @param {object|string} [options]
 * @param {function} [callback]
 * @example
 * request('url', function(err, res, body) { });
 * request({url: '', headers: {}, method: 'POST'}, function(err, res, body) { });
 */
function request(options, callback) {
  var opts = {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET',
    encoding: 'utf8',
    // If the callback body is buffer, it can hanlder document pipe simply
    isBuffer: false,
    json: false
  };

  if (util.isString(options)) {
    opts.url = options;
  } else {
    util.extend(opts, options);
  }

  // Append request data
  if (opts.data) {
    if (opts.method === 'GET') {
      opts.url += '?' + querystring.stringify(opts.data);
    } else {
      opts.data = JSON.stringify(opts.data);
      opts.headers['Content-Length'] = new Buffer(opts.data).length;
    }
  }

  // Extend request url object
  util.extend(opts, util.pick(url.parse(opts.url), 'hostname', 'port', 'path', 'auth'));
  delete opts.url;

  var req = http.request(opts, function(res) {
    var body = [];
    var size = 0;

    res.on('data', function(chunk) {
      body.push(chunk);
      size += chunk.length;
    });

    res.on('end', function() {
      var result = '';

      // Buffer
      if (opts.isBuffer) {
        result =  Buffer.concat(body, size);
      } else {
        var buffer = new Buffer(size);
        for (var i = 0, pos = 0, l = body.length; i < l; i++) {
          var chunk = body[i];
          chunk.copy(buffer, pos);
          pos += chunk.length;
        }
        result = buffer.toString(opts.encoding);

        if (opts.json) {
          result = JSON.parse(result);
        }
      }

      callback(null, res, result);
    });
  });

  req.on('error', callback);

  if (opts.method !== 'GET' && opts.data) {
    req.write(opts.data);
  }

  req.end();
}

/**
 * @description
 * @example
 * request.post('url', function() {});
 * request.post({ url: 'url', data: { q1: 'v1' }}, function() {});
 */
request.post = function(options, callback) {
  if (util.isString(options)) {
    options = {
      url: options
    };
  }

  options.method = 'POST';
  request(options, callback);
};

/**
 * @description
 * Download remote resurce to local file
 * @example
 * request.download({ url: 'path.png' }, function(err, res, body, filepath) {})
 * request.download({ 
    url: 'path.png',
    rootPath: 'dest/path' 
   }, function(err, res, body, filepath) {
    
   });
 */
request.download = function(options, callback) {
  var opts = util.extend({
    rootPath: '',
    ignore: false
  }, options);

  request({
    url: opts.url,
    isBuffer: true
  }, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode !== 200) return callback(err, res, body);
    var destPath;
    var pathname = url.parse(options.url).pathname.replace(/^\//, '');

    if (opts.destPath) {
      if (util.isFunction(opts.destPath)) {
        destPath = opts.destPath(path.basename(pathname));
      } else {
        destPath = opts.destPath;
      }
    } else {
      destPath = path.join(
        options.rootPath,
        pathname
      );
    }

    if (opts.ignore) {
      destPath = destPath.toLowerCase();
    }

    file.writeFile(destPath, body, function(err) {
      if (err) return callback(err);

      callback(null, res, body, destPath);
    });
  });
};

module.exports = request;

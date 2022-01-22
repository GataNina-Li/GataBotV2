# ajax-request — Simplified http request
[![NPM](https://nodei.co/npm/ajax-request.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ajax-request/)
```js
var request = require('ajax-request');
```

## install
```
npm install ajax-request --save
```

### test
```
mocha
```

## API
### request(options, callback)
* {obejct|string} ``options`` required  
  If the options is string, it will send get request.
  * {string} ``options.url`` required
  * {string} ``options.method`` [options.method=GET]  
  The http request type
  * {obejct} ``options.data``  
  if the request type is `GET`, it's appended to query string of the URL, or it's sended to remote of body.
  * {object} ``options.headers``  
  An object containing request headers.
  * {string} ``options.encoding``  
  Set response data encoding
  * {boolean} ``options.isBuffer``  [options.isBuffer=false]  
  Parse response data to buffer
  * {boolean} ``options.json`` [options.json=false]  
  Parse response data to json
* {function} ``callback`` required

```js
request('url', function(err, res, body) {});

request({
  url: '',
  method: 'GET',
  data: {
    query1: 'value1'
  }
}, function(err, res, body) {
  
});
```

### .post(options, callback)
The API same as request
```js
request.post({
  url: 'url',
  data: {},
  headers: {}
});
```

### .download(options, callback)
* {obejct} ``options`` required
  * ``options.url`` {string} required
  * ``options.ignore`` {boolean} [options.ignore=false]  
  Is the filepath ignore case. 
  * ``options.rootPath`` {string} [options.rootPath='']  
  The root of dest path
  * ``options.destPath`` {string|function}  
  Custom the download path.
* {function} ``callback`` required

```js
request.download({
  url: 'path/index.png',
  rootPath: ''
}, function(err, res, body, destpath) {});

request.download({
  url: 'path/index.png',
  destPath: function(filename) {
    return filename;
  }
}, function(err, res, body, destpath) { });

```

### .base64(url, callback)
Deprecated, move to [base64](https://github.com/douzi8/base64-img#requestbase64url-callback)
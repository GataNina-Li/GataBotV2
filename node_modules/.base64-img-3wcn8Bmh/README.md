# base64-img
Convert img to base64, or convert base64 to img
```js
var base64Img = require('base64-img');
```
## install
```
npm install base64-img --save
```
## test
```
mocha
```
## API
### .base64(filename, callback)
Convert image file to image base64 data
* {string} ``filename`` required  
The image path
* {function} ``callback(err, data)`` required  
Callback with image base64 data
```js
base64Img.base64('path/demo.png', function(err, data) {})
```

### .base64Sync(filename)
The api same as base64, but it's synchronous 
```js
var data = base64Img.base64Sync('path/demo.png');
var data2 = base64Img.base64Sync('path/demo.svg');
```

### .requestBase64(url, callback)
* {string} ``url`` required
* {function} ``callback(err, res, body)`` required  
Callback with http request
```js
var url = 'http://../demo.png';
base64Img.requestBase64(url, function(err, res, body) {
  
});
```

### .img(data, destpath, name, callback)
Convert image base64 data to image
* {string} ``data`` required  
Image base64 data
* {string} ``destpath`` required  
Dest path, if the destpath is root, pass empty string
* {string} ``name`` required  
The image's filename
* {function} ``callback(err, filepath)`` required
```js
base64Img.img('data:image/png;base64,...', 'dest', '1', function(err, filepath) {});
```

### .imgSync(data, destpath, name)
The api same as img, but it's synchronous
```js
var filepath = base64Img.imgSync('data:image/png;base64,...', '', '2');
```
<div align="center">
  <p>
    <a href="https://nodei.co/npm/nhentaidownloader/"><img src="https://nodei.co/npm/nhentaidownloader.png"></a>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/nhentaidownloader"><img src="https://img.shields.io/npm/dt/nhentaidownloader"></a>
    <a href="https://www.npmjs.com/package/nhentaidownloader"><img src="https://img.shields.io/npm/v/nhentaidownloader"></a>
    <a href="https://www.npmjs.com/package/nhentaidownloader"><img src="https://img.shields.io/npm/l/nhentaidownloader"></a>
  </p>
</div>

# nhentaidownloader

nhentaidownloader is a downloader for your favorite nHentai!
Only one parameter is required which is the ID

## Example
```js
const fs = require('fs');
const nhdl = require('nhentaidownloader');

var ID = "177013";

nhdl(ID).then(buffer => {
  fs.writeFileSync(`./${ID}.zip`, buffer);
});
```

## nhdl(ID)

This function take an nHentai ID and return with zip buffer promise

'use strict';

/**
 * Module dependencies.
 * @private
 */
var fs = require('fs');

/**
 * Module exports.
 * @public
 */
module.exports = base64ToImage;

/**
 * Change base64Str to image and write image file with 
   the specified file name to the specified file path.
 * @param {String} base64 string (mandatory)
 * @param {String} file path e.g. /opt/temp/uploads/ (mandatory)
 * @return {Object} optionsObj holds image type, image filename, debug e.g.{'fileName':fileName, 'type':type,'debug':true} (optional)
 * @public
 */
function base64ToImage(base64Str, path, optionalObj) {

    if (!base64Str || !path) {
        throw new Error('Missing mandatory arguments base64 string and/or path string');
    }

    var optionalObj = optionalObj || {};
    var imageBuffer = decodeBase64Image(base64Str);
    var imageType = optionalObj.type || imageBuffer.type || 'png';
    var fileName = optionalObj.fileName || 'img-' + Date.now();
    var abs;
    var fileName = '' + fileName;

    if (fileName.indexOf('.') === -1) {
        imageType = imageType.replace('image/', '');
        fileName = fileName + '.' + imageType;
    }

    abs = path + fileName;
    fs.writeFile(abs, imageBuffer.data, 'base64', function(err) {
        if (err && optionalObj.debug) {
            console.log("File image write error", err);
        }

    });
    return {
        'imageType': imageType,
        'fileName': fileName
    };
};

/**
 * Decode base64 string to buffer.
 *
 * @param {String} base64Str string
 * @return {Object} Image object with image type and data buffer.
 * @public
 */
function decodeBase64Image(base64Str) {
    var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var image = {};
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
    }

    image.type = matches[1];
    image.data = new Buffer(matches[2], 'base64');

    return image;
}
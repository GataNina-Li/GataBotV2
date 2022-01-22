// For more information on the WebP format, see https://developers.google.com/speed/webp/docs/riff_container
const _fs = require('fs');
const { promisify } = require('util');
const { basename } = require('path');
const fs = {
  read: promisify(_fs.read),
  write: promisify(_fs.write),
  open: promisify(_fs.open),
  close: promisify(_fs.close)
};
const nullByte = Buffer.alloc(1);
nullByte[0] = 0;
const emptyImageBuffer = Buffer.from([
  0x52, 0x49, 0x46, 0x46,   0x24, 0x00, 0x00, 0x00,   0x57, 0x45, 0x42, 0x50,   0x56, 0x50, 0x38, 0x20,
  0x18, 0x00, 0x00, 0x00,   0x30, 0x01, 0x00, 0x9d,   0x01, 0x2a, 0x01, 0x00,   0x01, 0x00, 0x02, 0x00,
  0x34, 0x25, 0xa4, 0x00,   0x03, 0x70, 0x00, 0xfe,   0xfb, 0xfd, 0x50, 0x00
]);
const constants = {
  TYPE_LOSSY: 0,
  TYPE_LOSSLESS: 1,
  TYPE_EXTENDED: 2
};
const encodeResults = {
  // These are errors from binding.cpp
  LIB_NOT_READY: -1,                         // <interface>.initEnc() was not called. This happens internally during <interface>.encodeImage() and thus should never happen.
  LIB_INVALID_CONFIG: -2,                    // invalid options passed in via set[Image/Frame]Data. This should never happen.
  SUCCESS: 0,
  // These errors are from native code and can be found in upstream libwebp/src/encode.h, WebPEncodingError enum
  VP8_ENC_ERROR_OUT_OF_MEMORY: 1,            // memory error allocating objects
  VP8_ENC_ERROR_BITSTREAM_OUT_OF_MEMORY: 2,  // memory error while flushing bits
  VP8_ENC_ERROR_NULL_PARAMETER: 3,           // a pointer parameter is NULL
  VP8_ENC_ERROR_INVALID_CONFIGURATION: 4,    // configuration is invalid
  VP8_ENC_ERROR_BAD_DIMENSION: 5,            // picture has invalid width/height
  VP8_ENC_ERROR_PARTITION0_OVERFLOW: 6,      // partition is bigger than 512k
  VP8_ENC_ERROR_PARTITION_OVERFLOW: 7,       // partition is bigger than 16M
  VP8_ENC_ERROR_BAD_WRITE: 8,                // error while flushing bytes
  VP8_ENC_ERROR_FILE_TOO_BIG: 9,             // file is bigger than 4G
  VP8_ENC_ERROR_USER_ABORT: 10,              // abort request by user
  VP8_ENC_ERROR_LAST: 11                     // list terminator. always last.
};
const imageHints = {
  DEFAULT: 0,
  PICTURE: 1, // digital picture, such as a portrait. Indoors shot
  PHOTO: 2, // outdoor photograph with natural lighting
  GRAPH: 3 // discrete tone image (graph, map-tile, etc)
};
const imagePresets = {
  DEFAULT: 0,
  PICTURE: 1, // digital picture, such as a portrait. Indoors shot
  PHOTO: 2, // outdoor photograph with natural lighting
  DRAWING: 3, // hand or line drawing, with high-contrast details
  ICON: 4, // small-sized, colorful images
  TEXT: 5 // text-like
};
const intfTypes = {
  NONE: 0,
  FILE: 1,
  BUFFER: 2
};
function VP8Width(data) { return ((data[7] << 8) | data[6]) & 0b0011111111111111; }
function VP8Height(data) { return ((data[9] << 8) | data[8]) & 0b0011111111111111; }
function VP8LWidth(data) { return (((data[2] << 8) | data[1]) & 0b0011111111111111) + 1; }
function VP8LHeight(data) { return ((((data[4] << 16) | (data[3] << 8) | data[2]) >> 6) & 0b0011111111111111) + 1; }
function doesVP8LHaveAlpha(data) { return !!(data[4] & 0b00010000); }
function createBasicChunk(name, data) {
  let header = Buffer.alloc(8), size = data.length;
  header.write(name, 0);
  header.writeUInt32LE(size, 4);
  if (size&1) { return { size: size + 9, chunks: [ header, data, nullByte ] }; }
  else { return { size: size + 8, chunks: [ header, data ] }; }
}
class WebPReader {
  constructor() { this.type = intfTypes.NONE; }
  readFile(path) { this.type = intfTypes.FILE; this.path = path; }
  readBuffer(buf) { this.type = intfTypes.BUFFER; this.buf = buf; this.cursor = 0; }
  async readBytes(n, mod) {
    let { type } = this;
    if (type == intfTypes.FILE) {
      let b = Buffer.alloc(n), br;
      br = (await fs.read(this.fp, b, 0, n, undefined)).bytesRead;
      return mod ? b : br == n ? b : undefined;
    } else if (type == intfTypes.BUFFER) { let b = this.buf.slice(this.cursor, this.cursor + n); this.cursor += n; return b; }
    else { throw new Error('Reader not initialized'); }
  }
  async readFileHeader() {
    let buf = await this.readBytes(12);
    if (buf === undefined) { throw new Error('Reached end while reading header'); }
    if (buf.toString('utf8', 0, 4) != 'RIFF') { throw new Error('Bad header (not RIFF)'); }
    if (buf.toString('utf8', 8, 12) != 'WEBP') { throw new Error('Bad header (not WEBP)'); }
    return { fileSize: buf.readUInt32LE(4) };
  }
  async readChunkHeader() {
    let buf = await this.readBytes(8, true);
    if (buf.length == 0) { return { fourCC: '\x00\x00\x00\x00', size: 0 }; }
    else if (buf.length < 8) { throw new Error('Reached end while reading chunk header'); }
    return { fourCC: buf.toString('utf8', 0, 4), size: buf.readUInt32LE(4) };
  }
  async readChunkContents(size) {
    let buf = await this.readBytes(size);
    if (size & 1) { await this.readBytes(1); }
    return buf;
  }
  async readChunk_raw(n, size) {
    let buf = await this.readChunkContents(size);
    if (buf === undefined) { throw new Error(`Reached end while reading ${n} chunk`); }
    return { raw: buf };
  }
  async readChunk_VP8(size) {
    let buf = await this.readChunkContents(size);
    if (buf === undefined) { throw new Error('Reached end while reading VP8 chunk'); }
    return { raw: buf, width: VP8Width(buf), height: VP8Height(buf) };
  }
  async readChunk_VP8L(size) {
    let buf = await this.readChunkContents(size);
    if (buf === undefined) { throw new Error('Reached end while reading VP8L chunk'); }
    return { raw: buf, alpha: doesVP8LHaveAlpha(buf), width: VP8LWidth(buf), height: VP8LHeight(buf) };
  }
  async readChunk_VP8X(size) {
    let buf = await this.readChunkContents(size);
    if (buf === undefined) { throw new Error('Reached end while reading VP8X chunk'); }
    return {
      raw: buf,
      hasICCP:  !!(buf[0] & 0b00100000),
      hasAlpha: !!(buf[0] & 0b00010000),
      hasEXIF:  !!(buf[0] & 0b00001000),
      hasXMP:   !!(buf[0] & 0b00000100),
      hasAnim:  !!(buf[0] & 0b00000010),
      width: buf.readUIntLE(4, 3) + 1,
      height: buf.readUIntLE(7, 3) + 1
    };
  }
  async readChunk_ANIM(size) {
    let buf = await this.readChunkContents(size);
    if (buf === undefined) { throw new Error('Reached end while reading ANIM chunk'); }
    return { raw: buf, bgColor: buf.slice(0, 4), loops: buf.readUInt16LE(4) };
  }
  async readChunk_ANMF(size) {
    let buf = await this.readChunkContents(size);
    if (buf === undefined) { throw new Error('Reached end while reading ANMF chunk'); }
    let out = {
      raw: buf,
      x: buf.readUIntLE(0, 3),
      y: buf.readUIntLE(3, 3),
      width: buf.readUIntLE(6, 3) + 1,
      height: buf.readUIntLE(9, 3) + 1,
      delay: buf.readUIntLE(12, 3),
      blend: !(buf[15] & 0b00000010),
      dispose: !!(buf[15] & 0b00000001)
    }, keepLooping = true, anmfReader = new WebPReader();
    anmfReader.readBuffer(buf);
    anmfReader.cursor = 16;
    while (keepLooping) {
      let header = await anmfReader.readChunkHeader();
      switch (header.fourCC) {
        case 'VP8 ':
          if (!out.vp8) {
            out.type = constants.TYPE_LOSSY;
            out.vp8 = await anmfReader.readChunk_VP8(header.size);
            if (out.alph) { out.vp8.alpha = true; }
          }
          break;
        case 'VP8L':
          if (!out.vp8l) {
            out.type = constants.TYPE_LOSSLESS;
            out.vp8l = await anmfReader.readChunk_VP8L(header.size);
          }
          break;
        case 'ALPH':
          if (!out.alph) {
            out.alph = await anmfReader.readChunk_ALPH(header.size);
            if (out.vp8) { out.vp8.alpha = true; }
          }
          break;
        case '\x00\x00\x00\x00':
        default:
          keepLooping = false;
          break;
      }
      if (anmfReader.cursor >= buf.length) { break; }
    }
    return out;
  }
  async readChunk_ALPH(size) { return this.readChunk_raw('ALPH', size); }
  async readChunk_ICCP(size) { return this.readChunk_raw('ICCP', size); }
  async readChunk_EXIF(size) { return this.readChunk_raw('EXIF', size); }
  async readChunk_XMP(size) { return this.readChunk_raw('XMP ', size); }
  async readChunk_skip(size) {
    let buf = await this.readChunkContents(size);
    if (buf === undefined) { throw new Error('Reached end while skipping chunk'); }
  }
  async read() {
    if (this.type == intfTypes.FILE) { this.fp = await fs.open(this.path, 'r'); }
    let keepLooping = true, first = true, { fileSize } = await this.readFileHeader(), out = {};
    while (keepLooping) {
      let { fourCC, size } = await this.readChunkHeader();
      switch (fourCC) {
        case 'VP8 ':
          if (!out.vp8) {
            out.vp8 = await this.readChunk_VP8(size);
            if (out.alph) { out.vp8.alpha = true; }
            if (first) { out.type = constants.TYPE_LOSSY; keepLooping = false; }
          } else { await this.readChunk_skip(size); }
          break;
        case 'VP8L':
          if (!out.vp8l) {
            out.vp8l = await this.readChunk_VP8L(size);
            if (first) { out.type = constants.TYPE_LOSSLESS; keepLooping = false; }
          } else { await this.readChunk_skip(size); }
          break;
        case 'VP8X':
          if (!out.extended) {
            out.type = constants.TYPE_EXTENDED;
            out.extended = await this.readChunk_VP8X(size);
          } else { await this.readChunk_skip(size); }
          break;
        case 'ANIM':
          if (!out.anim) {
            let { raw, bgColor, loops } = await this.readChunk_ANIM(size);
            out.anim = {
              bgColor: [ bgColor[2], bgColor[1], bgColor[0], bgColor[3] ],
              loops,
              frames: [],
              raw
            };
          } else { await this.readChunk_skip(size); }
          break;
        case 'ANMF': out.anim.frames.push(await this.readChunk_ANMF(size)); break;
        case 'ALPH':
          if (!out.alph) {
            out.alph = await this.readChunk_ALPH(size);
            if (out.vp8) { out.vp8.alpha = true; }
          } else { await this.readChunk_skip(size); }
          break;
        case 'ICCP':
          if (!out.iccp) { out.iccp = await this.readChunk_ICCP(size); }
          else { await this.readChunk_skip(size); }
          break;
        case 'EXIF':
          if (!out.exif) { out.exif = await this.readChunk_EXIF(size); }
          else { await this.readChunk_skip(size); }
          break;
        case 'XMP ':
          if (!out.xmp) { out.xmp = await this.readChunk_XMP(size); }
          else { await this.readChunk_skip(size); }
          break;
        case '\x00\x00\x00\x00': keepLooping = false; break;
        default: await this.readChunk_skip(size); break;
      }
      first = false;
    }
    if (this.type == intfTypes.FILE) { await fs.close(this.fp); }
    return out;
  }
}
class WebPWriter {
  constructor() { this.type = intfTypes.NONE; this.chunks = []; this.width = this.height = 0; }
  reset() { this.chunks.length = 0; width = 0; height = 0; }
  writeFile(path) { this.type = intfTypes.FILE; this.path = path; }
  writeBuffer() { this.type = intfTypes.BUFFER; }
  async commit() {
    let { chunks } = this, size = 4, fp;
    if (this.type == intfTypes.NONE) { throw new Error('Writer not initialized'); }
    if (chunks.length == 0) { throw new Error('Nothing to write'); }
    for (let i = 1, l = chunks.length; i < l; i++) { size += chunks[i].length; }
    chunks[0].writeUInt32LE(size, 4);
    if (this.type == intfTypes.FILE) {
      fp = await fs.open(this.path, 'w');
      for (let i = 0, l = chunks.length; i < l; i++) { await fs.write(fp, chunks[i], 0, undefined, undefined); }
      await fs.close(fp);
    } else { return Buffer.concat(chunks); }
  }
  writeBytes(...chunks) {
    if (this.type == intfTypes.NONE) { throw new Error('Writer not initialized'); }
    this.chunks.push(...chunks);
  }
  writeFileHeader() {
    let buf = Buffer.alloc(12);
    buf.write('RIFF', 0);
    buf.write('WEBP', 8);
    this.writeBytes(buf);
  }
  writeChunk_VP8(vp8) { this.writeBytes(...((createBasicChunk('VP8 ', vp8.raw)).chunks)); }
  writeChunk_VP8L(vp8l) { this.writeBytes(...((createBasicChunk('VP8L', vp8l.raw)).chunks)); }
  writeChunk_VP8X(vp8x) {
    let buf = Buffer.alloc(18);
    buf.write('VP8X', 0);
    buf.writeUInt32LE(10, 4);
    buf.writeUIntLE(vp8x.width - 1, 12, 3);
    buf.writeUIntLE(vp8x.height - 1, 15, 3);
    if (vp8x.hasICCP)  { buf[8] |= 0b00100000; }
    if (vp8x.hasAlpha) { buf[8] |= 0b00010000; }
    if (vp8x.hasEXIF)  { buf[8] |= 0b00001000; }
    if (vp8x.hasXMP)   { buf[8] |= 0b00000100; }
    if (vp8x.hasAnim)  { buf[8] |= 0b00000010; }
    this.vp8x = buf;
    this.writeBytes(buf);
  }
  updateChunk_VP8X_size(width, height) {
    this.vp8x.writeUIntLE(width, 12, 3);
    this.vp8x.writeUIntLE(height, 15, 3);
  }
  writeChunk_ANIM(anim) {
    let buf = Buffer.alloc(14);
    buf.write('ANIM', 0);
    buf.writeUInt32LE(6, 4);
    buf.writeUInt8(anim.bgColor[2], 8);
    buf.writeUInt8(anim.bgColor[1], 9);
    buf.writeUInt8(anim.bgColor[0], 10);
    buf.writeUInt8(anim.bgColor[3], 11);
    buf.writeUInt16LE(anim.loops, 12);
    this.writeBytes(buf);
  }
  writeChunk_ANMF(anmf) {
    let buf = Buffer.alloc(24), { img } = anmf, size = 16, alpha = false;
    buf.write('ANMF', 0);
    buf.writeUIntLE(anmf.x, 8, 3);
    buf.writeUIntLE(anmf.y, 11, 3);
    buf.writeUIntLE(anmf.delay, 20, 3);
    if (!anmf.blend) { buf[23] |= 0b00000010; }
    if (anmf.dispose) { buf[23] |= 0b00000001; }
    switch (img.type) {
      case constants.TYPE_LOSSY:
        {
          let b;
          this.width = Math.max(this.width, img.vp8.width);
          this.height = Math.max(this.height, img.vp8.height);
          buf.writeUIntLE(img.vp8.width - 1, 14, 3);
          buf.writeUIntLE(img.vp8.height - 1, 17, 3);
          this.writeBytes(buf);
          if (img.vp8.alpha) {
            b = createBasicChunk('ALPH', img.alph.raw);
            this.writeBytes(...b.chunks);
            size += b.size;
          }
          b = createBasicChunk('VP8 ', img.vp8.raw);
          this.writeBytes(...b.chunks);
          size += b.size;
        }
        break;
      case constants.TYPE_LOSSLESS:
        {
          let b = createBasicChunk('VP8L', img.vp8l.raw);
          this.width = Math.max(this.width, img.vp8l.width);
          this.height = Math.max(this.height, img.vp8l.height);
          buf.writeUIntLE(img.vp8l.width - 1, 14, 3);
          buf.writeUIntLE(img.vp8l.height - 1, 17, 3);
          if (img.vp8l.alpha) { alpha = true; }
          this.writeBytes(buf, ...b.chunks);
          size += b.size;
        }
        break;
      case constants.TYPE_EXTENDED:
        if (img.extended.hasAnim) {
          let fr = img.anim.frames;
          if (img.extended.hasAlpha) { alpha = true; }
          for (let i = 0, l = fr.length; i < l; i++) {
            let b = Buffer.alloc(8), c = fr[i].raw;
            this.width = Math.max(this.width, fr[i].width + anmf.x);
            this.height = Math.max(this.height, fr[i].height + anmf.y);
            b.write('ANMF', 0);
            b.writeUInt32LE(c.length, 4);
            c.writeUIntLE(anmf.x, 0, 3);
            c.writeUIntLE(anmf.y, 3, 3);
            c.writeUIntLE(anmf.delay, 12, 3);
            if (!anmf.blend) { c[15] |= 0b00000010; } else { c[15] &= 0b11111101; }
            if (anmf.dispose) { c[15] |= 0b00000001; } else { c[15] &= 0b11111110; }
            this.writeBytes(b, c);
            if (c.length & 1) { this.writeBytes(nullByte); }
          }
        } else {
          let b;
          this.width = Math.max(this.width, img.extended.width);
          this.height = Math.max(this.height, img.extended.height);
          if (img.vp8) {
            buf.writeUIntLE(img.vp8.width - 1, 14, 3);
            buf.writeUIntLE(img.vp8.height - 1, 17, 3);
            this.writeBytes(buf);
            if (img.alph) {
              b = createBasicChunk('ALPH', img.alph.raw);
              alpha = true;
              this.writeBytes(...b.chunks);
              size += b.size;
            }
            b = createBasicChunk('VP8 ', img.vp8.raw);
            this.writeBytes(...b.chunks);
            size += b.size;
          } else if (img.vp8l) {
            buf.writeUIntLE(img.vp8l.width - 1, 14, 3);
            buf.writeUIntLE(img.vp8l.height - 1, 17, 3);
            if (img.vp8l.alpha) { alpha = true; }
            b = createBasicChunk('VP8L', img.vp8l.raw);
            this.writeBytes(buf, ...b.chunks);
            size += b.size;
          }
        }
        break;
      default: throw new Error('Unknown image type');
    }
    buf.writeUInt32LE(size, 4);
    if (alpha) { this.vp8x[8] |= 0b00010000; }
  }
  writeChunk_ALPH(alph) { this.writeBytes(...((createBasicChunk('ALPH', alph.raw)).chunks)); }
  writeChunk_ICCP(iccp) { this.writeBytes(...((createBasicChunk('ICCP', iccp.raw)).chunks)); }
  writeChunk_EXIF(exif) { this.writeBytes(...((createBasicChunk('EXIF', exif.raw)).chunks)); }
  writeChunk_XMP(xmp) { this.writeBytes(...((createBasicChunk('XMP ', xmp.raw)).chunks)); }
}
class Image {
  constructor() { this.data = null; this.loaded = false; this.path = ''; this.libwebp = undefined; }
  async initLib() {
    const libWebP = require('./libwebp.js');
    if (!this.libwebp) { this.libwebp = new libWebP(); await this.libwebp.init(); }
  }
  clear() { this.data = null; this.path = ''; this.loaded = false; }
  // Convenience getters/setters
  get width() { let d = this.data; return !this.loaded ? undefined : d.extended ? d.extended.width : d.vp8l ? d.vp8l.width : d.vp8 ? d.vp8.width : undefined; }
  get height() { let d = this.data; return !this.loaded ? undefined : d.extended ? d.extended.height : d.vp8l ? d.vp8l.height : d.vp8 ? d.vp8.height : undefined; }
  get type() { return this.loaded ? this.data.type : undefined; }
  get hasAnim() { return this.loaded ? this.data.extended ? this.data.extended.hasAnim : false : false; }
  get hasAlpha() { return this.loaded ? this.data.extended ? this.data.extended.hasAlpha : this.data.vp8 ? this.data.vp8.alpha : this.data.vp8l ? this.data.vp8l.alpha : false : false; }
  get anim() { return this.hasAnim ? this.data.anim : undefined; }
  get frames() { return this.anim ? this.anim.frames : undefined; }
  get iccp() { return this.data.extended ? this.data.extended.hasICCP ? this.data.iccp.raw : undefined : undefined; }
  set iccp(raw) {
    if (!this.data.extended) { this.#convertToExtended(); }
    if (raw === undefined) { this.data.extended.hasICCP = false; delete this.data.iccp; }
    else { this.data.iccp = { raw }; this.data.extended.hasICCP = true; }
  }
  get exif() { return this.data.extended ? this.data.extended.hasEXIF ? this.data.exif.raw : undefined : undefined; }
  set exif(raw) {
    if (!this.data.extended) { this.#convertToExtended(); }
    if (raw === undefined) { this.data.extended.hasEXIF = false; delete this.data.exif; }
    else { this.data.exif = { raw }; this.data.extended.hasEXIF = true; }
  }
  get xmp() { return this.data.extended ? this.data.extended.hasXMP ? this.data.xmp.raw : undefined : undefined; }
  set xmp(raw) {
    if (!this.data.extended) { this.#convertToExtended(); }
    if (raw === undefined) { this.data.extended.hasXMP = false; delete this.data.xmp; }
    else { this.data.xmp = { raw }; this.data.extended.hasXMP = true; }
  }
  // Private member functions
  #convertToExtended() {
    if (!this.loaded) { throw new Error('No image loaded'); }
    this.data.type = constants.TYPE_EXTENDED;
    this.data.extended = {
      hasICCP: false,
      hasAlpha: false,
      hasEXIF: false,
      hasXMP: false,
      width: this.data.vp8 ? this.data.vp8.width : this.data.vp8l ? this.data.vp8l.width : 1,
      height: this.data.vp8 ? this.data.vp8.height : this.data.vp8l ? this.data.vp8l.height : 1
    };
  }
  async #demuxFrameFile(path, frame) {
    let writer = new WebPWriter();
    writer.writeFile(path);
    return this.#demuxFrame(writer, frame);
  }
  async #demuxFrameBuffer(frame) {
    let writer = new WebPWriter();
    writer.writeBuffer();
    return this.#demuxFrame(writer, frame);
  }
  async #demuxFrame(writer, frame) {
    let { hasICCP, hasEXIF, hasXMP } = this.data.extended ? this.data.extended : { hasICCP: false, hasEXIF: false, hasXMP: false }, hasAlpha = ((frame.vp8) && (frame.vp8.alpha));
    writer.writeFileHeader();
    if ((hasICCP) || (hasEXIF) || (hasXMP) || (hasAlpha)) {
      writer.writeChunk_VP8X({
        hasICCP,
        hasEXIF,
        hasXMP,
        hasAlpha: ((frame.vp8l) && (frame.vp8l.alpha)) || hasAlpha,
        width: frame.width - 1,
        height: frame.height - 1
      });
    }
    if (frame.vp8l) { writer.writeChunk_VP8L(frame.vp8l); }
    else if (frame.vp8) {
      if (frame.vp8.alpha) { writer.writeChunk_ALPH(frame.alph); }
      writer.writeChunk_VP8(frame.vp8);
    } else { throw new Error('Frame has no VP8/VP8L?'); }
    if ((hasICCP) || (hasEXIF) || (hasXMP) || (hasAlpha)) {
      if (this.data.extended.hasICCP) { writer.writeChunk_ICCP(this.data.iccp); }
      if (this.data.extended.hasEXIF) { writer.writeChunk_EXIF(this.data.exif); }
      if (this.data.extended.hasXMP) { writer.writeChunk_XMP(this.data.xmp); }
    }
    return writer.commit();
  }
  async #demux({ path, buffers, frame, prefix, start, end } = {}) {
    if (!this.hasAnim) { throw new Error("This image isn't an animation"); }
    let _end = end == 0 ? this.frames.length : end, bufs = [];
    if (start < 0) { start = 0; }
    if (_end >= this.frames.length) { _end = this.frames.length - 1; }
    if (start > _end) { let n = start; start = _end; _end = n; }
    if (frame != -1) { start = _end = frame; }
    for (let i = start; i <= _end; i++) {
      if (path) { await this.#demuxFrameFile((`${path}/${prefix}_${i}.webp`).replace(/#FNAME#/g, basename(this.path, '.webp')), this.anim.frames[i]); }
      else { bufs.push(this.#demuxFrameBuffer(this.anim.frames[i])); }
    }
    if (buffers) { return bufs; }
  }
  async #replaceFrame(frame, path, buffer) {
    if (!this.hasAnim) { throw new Error("WebP isn't animated"); }
    if ((frame < 0) || (frame >= this.frames.length)) { throw new Error(`Frame index ${frame} out of bounds (0 <= index < ${this.frames.length})`); }
    let r = new Image(), fr = this.frames[frame];
    if (path) { await r.load(path); }
    else { await r.loadBuffer(buffer); }
    switch (r.type) {
      case constants.TYPE_LOSSY:
      case constants.TYPE_LOSSLESS:
        break;
      case constants.TYPE_EXTENDED:
        if (r.hasAnim) { throw new Error('Merging animations not currently supported'); }
        break;
      default: throw new Error('Unknown WebP type');
    }
    switch (fr.type) {
      case constants.TYPE_LOSSY:
        if (fr.vp8.alpha) { delete fr.alph; }
        delete fr.vp8;
        break;
      case constants.TYPE_LOSSLESS:
        delete fr.vp8l;
        break;
      default: throw new Error('Unknown frame type');
    }
    switch (r.type) {
      case constants.TYPE_LOSSY:
        fr.vp8 = r.data.vp8;
        fr.type = constants.TYPE_LOSSY;
        break;
      case constants.TYPE_LOSSLESS:
        fr.vp8l = r.data.vp8l;
        fr.type = constants.TYPE_LOSSLESS;
        break;
      case constants.TYPE_EXTENDED:
        if (r.data.vp8) {
          fr.vp8 = r.data.vp8;
          if (r.data.vp8.alpha) { fr.alph = r.data.alph; }
          fr.type = constants.TYPE_LOSSY;
        } else if (r.data.vp8l) { fr.vp8l = r.data.vp8l; fr.type = constants.TYPE_LOSSLESS; }
        break;
    }
    fr.width = r.width;
    fr.height = r.height;
  }
  async #save(writer, { width = undefined, height = undefined, frames = undefined, bgColor = [ 255, 255, 255, 255 ], loops = 0, delay = 100, x = 0, y = 0, blend = true, dispose = false, exif = false, iccp = false, xmp = false } = {}) {
    let _width = width !== undefined ? width : this.width - 1, _height = height !== undefined ? height : this.height - 1, isAnim = this.hasAnim || frames !== undefined;
    if ((_width < 0) || (_width > (1 << 24))) { throw new Error('Width out of range'); }
    else if ((_height < 0) || (_height > (1 << 24))) { throw new Error('Height out of range'); }
    else if ((_height * _width) > (Math.pow(2, 32) - 1)) { throw new Error(`Width * height too large (${_width}, ${_height})`); }
    if (isAnim) {
      if ((loops < 0) || (loops >= (1 << 24))) { throw new Error('Loops out of range'); }
      else if ((delay < 0) || (delay >= (1 << 24))) { throw new Error('Delay out of range'); }
      else if ((x < 0) || (x >= (1 << 24))) { throw new Error('X out of range'); }
      else if ((y < 0) || (y >= (1 << 24))) { throw new Error('Y out of range'); }
    } else { if ((_width == 0) || (_height == 0)) { throw new Error('Width/height cannot be 0'); } }
    writer.writeFileHeader();
    switch (this.type) {
      case constants.TYPE_LOSSY: writer.writeChunk_VP8(this.data.vp8); break;
      case constants.TYPE_LOSSLESS: writer.writeChunk_VP8L(this.data.vp8l); break;
      case constants.TYPE_EXTENDED:
        {
          let hasICCP = iccp === true ? !!this.iccp : iccp,
              hasEXIF = exif === true ? !!this.exif : exif,
              hasXMP = xmp === true ? !!this.xmp : xmp;
          writer.writeChunk_VP8X({
            hasICCP, hasEXIF, hasXMP,
            hasAlpha: ((this.data.alph) || ((this.data.vp8l) && (this.data.vp8l.alpha))),
            hasAnim: isAnim,
            width: _width,
            height: _height
          });
          if (isAnim) {
            let _frames = frames || this.frames;
            writer.writeChunk_ANIM({ bgColor, loops });
            for (let i = 0, l = _frames.length; i < l; i++) {
              let fr = _frames[i],
                  _delay = fr.delay == undefined ? delay : fr.delay,
                  _x = fr.x == undefined ? x :fr.x,
                  _y = fr.y == undefined ? y : fr.y,
                  _blend = fr.blend == undefined ? blend : fr.blend,
                  _dispose = fr.dispose == undefined ? dispose : fr.dispose, img;
              if ((_delay < 0) || (_delay >= (1 << 24))) { throw new Error(`Delay out of range on frame ${i}`); }
              else if ((_x < 0) || (_x >= (1 << 24))) { throw new Error(`X out of range on frame ${i}`); }
              else if ((_y < 0) || (_y >= (1 << 24))) { throw new Error(`Y out of range on frame ${i}`); }
              if (fr.path) { img = new Image(); await img.load(fr.path); img = img.data; }
              else if (fr.buffer) { img = new Image(); await img.loadBuffer(fr.buffer); img = img.data; }
              else if (fr.img) { img = fr.img.data; }
              else { img = fr; }
              writer.writeChunk_ANMF({
                x: _x,
                y: _y,
                delay: _delay,
                blend: _blend,
                dispose: _dispose,
                img
              });
            }
            if ((_width == 0) || (_height == 0)) { writer.updateChunk_VP8X_size(_width == 0 ? writer.width : _width, _height == 0 ? writer.height : _height); }
          } else {
            if (this.data.vp8) {
              if (this.data.alph) { writer.writeChunk_ALPH(this.data.alph); }
              writer.writeChunk_VP8(this.data.vp8);
            } else if (this.data.vp8l) { writer.writeChunk_VP8L(this.data.vp8l); }
          }
          if (hasICCP) { writer.writeChunk_ICCP(iccp !== true ? iccp : this.data.iccp); }
          if (hasEXIF) { writer.writeChunk_EXIF(exif !== true ? exif : this.data.exif); }
          if (hasXMP) { writer.writeChunk_XMP(xmp !== true ? xmp : this.data.xmp); }
        }
        break;
      default: throw new Error('Unknown image type');
    }
    return writer.commit();
  }
  // Public member functions
  async load(path) {
    let reader = new WebPReader();
    reader.readFile(path);
    this.path = path;
    this.data = await reader.read();
    this.loaded = true;
  }
  async loadBuffer(buf) {
    let reader = new WebPReader();
    reader.readBuffer(buf);
    this.data = await reader.read();
    this.loaded = true;
  }
  convertToAnim() {
    if (!this.data.extended) { this.#convertToExtended(); }
    if (this.hasAnim) { return; }
    if (this.data.vp8) { delete this.data.vp8; }
    if (this.data.vp8l) { delete this.data.vp8l; }
    if (this.data.alph) { delete this.data.alph; }
    this.data.extended.hasAnim = true;
    this.data.anim = {
      bgColor: [ 255, 255, 255, 255],
      loops: 0,
      frames: []
    };
  }
  async demux(path, { frame = -1, prefix = '#FNAME#', start = 0, end = 0 } = {}) { return this.#demux({ path, frame, prefix, start, end }); }
  async demuxToBuffers({ frame = -1, start = 0, end = 0 } = {}) { return this.#demux({ buffers: true, frame, start, end }); }
  async replaceFrame(frame, path) { return this.#replaceFrame(frame, path); }
  async replaceFrameBuffer(frame, buffer) { return this.#replaceFrame(frame, undefined, buffer); }
  async save(path = this.path, { width = this.width, height = this.height, frames = this.frames, bgColor = this.hasAnim ? this.anim.bgColor : [ 255, 255, 255, 255 ], loops = this.hasAnim ? this.anim.loops : 0, delay = 100, x = 0, y = 0, blend = true, dispose = false, exif = !!this.exif, iccp = !!this.iccp, xmp = !!this.xmp } = {}) {
    if (!path) { throw new Error('Cannot save to disk without a path'); }
    let writer = new WebPWriter();
    writer.writeFile(path);
    return this.#save(writer, { width, height, frames, bgColor, loops, delay, x, y, blend, dispose, exif, iccp, xmp });
  }
  async saveBuffer({ width = this.width, height = this.height, frames = this.frames, bgColor = this.hasAnim ? this.anim.bgColor : [ 255, 255, 255, 255 ], loops = this.hasAnim ? this.anim.loops : 0, delay = 100, x = 0, y = 0, blend = true, dispose = false, exif = !!this.exif, iccp = !!this.iccp, xmp = !!this.xmp } = {}) {
    let writer = new WebPWriter();
    writer.writeBuffer();
    return this.#save(writer, { width, height, frames, bgColor, loops, delay, x, y, blend, dispose, exif, iccp, xmp });
  }
  async getImageData() {
    if (!this.libwebp) { throw new Error('Must call .initLib() before using getImageData'); }
    if (this.hasAnim) { throw new Error('Calling getImageData on animations is not supported'); }
    let buf = await this.saveBuffer(), { libwebp } = this;
    return libwebp.decodeImage(buf, this.width, this.height);
  }
  async setImageData(buf, { width = 0, height = 0, preset = undefined, quality = undefined, exact = undefined, lossless = undefined, method = undefined, advanced = undefined } = {}) {
    if (!this.libwebp) { throw new Error('Must call .initLib() before using setImageData'); }
    if (this.hasAnim) { throw new Error('Calling setImageData on animations is not supported'); }
    if ((quality !== undefined) && ((quality < 0) || (quality > 100))) { throw new Error('Quality out of range'); }
    if ((lossless !== undefined) && ((lossless < 0) || (lossless > 9))) { throw new Error('Lossless preset out of range'); }
    if ((method !== undefined) && ((method < 0) || (method > 6))) { throw new Error('Method out of range'); }
    let { libwebp } = this, ret = libwebp.encodeImage(buf, width > 0 ? width : this.width, height > 0 ? height : this.height, { preset, quality, exact, lossless, method, advanced }), img = new Image(), keepEx = false, ex;
    if (ret.res !== encodeResults.SUCCESS) { return ret.res; }
    await img.loadBuffer(Buffer.from(ret.buf));
    switch (this.type) {
      case constants.TYPE_LOSSY: delete this.data.vp8; break;
      case constants.TYPE_LOSSLESS: delete this.data.vp8l; break;
      case constants.TYPE_EXTENDED:
        ex = this.data.extended;
        delete this.data.extended;
        if ((ex.hasICCP) || (ex.hasEXIF) || (ex.hasXMP)) { keepEx = true; }
        if (this.data.vp8) { delete this.data.vp8; }
        if (this.data.vp8l) { delete this.data.vp8l; }
        if (this.data.alph) { delete this.data.alph; }
        break;
    }
    switch (img.type) {
      case constants.TYPE_LOSSY:
        if (keepEx) { this.data.type = constants.TYPE_EXTENDED; ex.hasAlpha = false; ex.width = img.width; ex.height = img.height; this.data.extended = ex; }
        else { this.data.type = constants.TYPE_LOSSY; }
        this.data.vp8 = img.data.vp8;
        break;
      case constants.TYPE_LOSSLESS:
        if (keepEx) { this.data.type = constants.TYPE_EXTENDED; ex.hasAlpha = img.data.vp8l.alpha; ex.width = img.width; ex.height = img.height; this.data.extended = ex; }
        else { this.data.type = constants.TYPE_LOSSLESS; }
        this.data.vp8l = img.data.vp8l;
        break;
      case constants.TYPE_EXTENDED:
        this.data.type = constants.TYPE_EXTENDED;
        if (keepEx) { ex.hasAlpha = img.data.alph || ((img.data.vp8l) && (img.data.vp8l.alpha)); ex.width = img.width; ex.height = img.height; this.data.extended = ex; }
        else { this.data.extended = img.data.extended; }
        if (img.data.vp8) { this.data.vp8 = img.data.vp8; }
        if (img.data.vp8l) { this.data.vp8l = img.data.vp8l; }
        if (img.data.alph) { this.data.alph = img.data.alph; }
        break;
    }
    return encodeResults.SUCCESS;
  }
  async getFrameData(frame) {
    if (!this.libwebp) { throw new Error('Must call .initLib() before using getFrameData'); }
    if (!this.hasAnim) { throw new Error('Calling getFrameData on non-animations is not supported'); }
    if ((frame < 0) || (frame >= this.frames.length)) { throw new Error('Frame index out of range'); }
    let fr = this.frames[frame], buf = await this.#demuxFrameBuffer(fr), { libwebp } = this;
    return libwebp.decodeImage(buf, fr.width, fr.height);
  }
  async setFrameData(frame, buf, { width = 0, height = 0, preset = undefined, quality = undefined, exact = undefined, lossless = undefined, method = undefined, advanced = undefined } = {}) {
    if (!this.libwebp) { throw new Error('Must call .initLib() before using setFrameData'); }
    if (!this.hasAnim) { throw new Error('Calling setFrameData on non-animations is not supported'); }
    if ((frame < 0) || (frame >= this.frames.length)) { throw new Error('Frame index out of range'); }
    if ((quality !== undefined) && ((quality < 0) || (quality > 100))) { throw new Error('Quality out of range'); }
    if ((lossless !== undefined) && ((lossless < 0) || (lossless > 9))) { throw new Error('Lossless preset out of range'); }
    if ((method !== undefined) && ((method < 0) || (method > 6))) { throw new Error('Method out of range'); }
    let fr = this.frames[frame], { libwebp } = this, ret = libwebp.encodeImage(buf, width > 0 ? width : fr.width, height > 0 ? height : fr.height, { preset, quality, exact, lossless, method, advanced }), img = new Image();
    if (ret.res !== encodeResults.SUCCESS) { return ret.res; }
    await img.loadBuffer(Buffer.from(ret.buf));
    switch (fr.type) {
      case constants.TYPE_LOSSY: delete fr.vp8; if (fr.alph) { delete fr.alph; } break;
      case constants.TYPE_LOSSLESS: delete fr.vp8l; break;
    }
    fr.width = img.width;
    fr.height = img.height;
    switch (img.type) {
      case constants.TYPE_LOSSY: fr.type = img.type; fr.vp8 = img.data.vp8; break;
      case constants.TYPE_LOSSLESS: fr.type = img.type; fr.vp8l = img.data.vp8l; break;
      case constants.TYPE_EXTENDED:
        if (img.data.vp8) {
          fr.type = constants.TYPE_LOSSY;
          fr.vp8 = img.data.vp8;
          if (img.data.vp8.alpha) { fr.alph = img.data.alph; }
        } else if (img.data.vp8l) {
          fr.type = constants.TYPE_LOSSLESS;
          fr.vp8l = img.data.vp8l;
        }
        break;
    }
    return encodeResults.SUCCESS;
  }
  // Public static functions
  static async save(path, opts) {
    if ((opts.frames) && ((opts.width === undefined) || (opts.height === undefined))) { throw new Error('Must provide both width and height when passing frames'); }
    let writer = new WebPWriter();
    writer.writeFile(path);
    return (await Image.getEmptyImage(!!opts.frames)).save(path, opts);
  }
  static async saveBuffer(opts) {
    if ((opts.frames) && ((opts.width === undefined) || (opts.height === undefined))) { throw new Error('Must provide both width and height when passing frames'); }
    let writer = new WebPWriter();
    writer.writeBuffer();
    return (await Image.getEmptyImage(!!opts.frames)).saveBuffer(path, opts);
  }
  static async getEmptyImage(ext) {
    let img = new Image();
    await img.loadBuffer(emptyImageBuffer);
    if (ext) { img.exif = undefined; }
    return img;
  }
  static async generateFrame({ path = undefined, buffer = undefined, img = undefined, x = undefined, y = undefined, delay = undefined, blend = undefined, dispose = undefined } = {}) {
    let _img = img;
    if (((!path) && (!buffer) && (!img)) ||
        ((path) && (buffer) && (img))) { throw new Error('Must provide either `path`, `buffer`, or `img`'); }
    if (!img) {
      _img = new Image();
      if (path) { await _img.load(path); }
      else { await _img.loadBuffer(buffer); }
    }
    if (_img.hasAnim) { throw new Error('Merging animations is not currently supported'); }
    return {
      img: _img,
      x,
      y,
      delay,
      blend,
      dispose
    };
  }
}
module.exports = {
  TYPE_LOSSY: constants.TYPE_LOSSY,
  TYPE_LOSSLESS: constants.TYPE_LOSSLESS,
  TYPE_EXTENDED: constants.TYPE_EXTENDED,
  encodeResults,
  hints: imageHints,
  presets: imagePresets,
  Image
};


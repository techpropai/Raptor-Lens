import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height) {
  // Simple PNG encoder using raw RGBA and deflate
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with filter byte 0 at start of each scanline
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Dark background with subtle gradient
      let r = 16, g = 16, b = 18, a = 255;

      // Outer border circle
      if (Math.abs(dist - 0.85) < 0.02 || Math.abs(dist - 0.5) < 0.015 || Math.abs(dist - 0.2) < 0.02) {
        // Gold radar ring
        r = 245; g = 158; b = 11; a = 180;
      }

      // Falcon silhouette approximation (wings spread)
      const absDx = Math.abs(dx);
      const wingCurve = 0.35 * Math.sin(absDx * Math.PI) - 0.2 * (absDx * absDx);
      const isWing = absDx < 0.85 && dy > (wingCurve - 0.15) && dy < (wingCurve + 0.18 + (1 - absDx) * 0.2);
      const isBody = absDx < 0.15 && dy > -0.55 && dy < 0.65;
      const isTail = absDx < 0.22 && dy >= 0.4 && dy < 0.75 && (dy > 0.45 + absDx * 0.8);

      if (isWing || isBody || isTail) {
        // Radiant Amber/Gold (#F59E0B / #FBBF24)
        r = 251; g = 191; b = 36; a = 255;
      }

      // Target reticle pip at center
      if (dist < 0.04) {
        r = 254; g = 243; b = 199; a = 255;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);

  return Buffer.concat([len, body, crc]);
}

// Simple CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Generate icons
fs.writeFileSync('public/pwa-192x192.png', createPNG(192, 192));
fs.writeFileSync('public/pwa-512x512.png', createPNG(512, 512));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPNG(512, 512));
fs.writeFileSync('public/apple-touch-icon.png', createPNG(180, 180));
console.log('PNG icons created successfully in public/');

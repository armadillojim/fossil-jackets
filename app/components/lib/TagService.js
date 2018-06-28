// Encode an array of bytes into a Base64 string
// Inspired by https://github.com/mathiasbynens/base64/blob/master/base64.js
const base64Encoding = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const encodeBase64 = (bytes) => {
  const extraBytes = bytes.length % 3;
  // Make sure any extra bytes are handled outside of the loop
  const length = bytes.length - extraBytes;

  var output = '';
  var position = -1;

  // Read 3 octets, split into 4 sextets, and append the matching code to the output
  while (++position < length) {
    const buffer = (bytes[position] << 16) + (bytes[++position] << 8) + bytes[++position];
    output += (
      base64Encoding.charAt(buffer >> 18) +
      base64Encoding.charAt(buffer >> 12 & 0x3f) +
      base64Encoding.charAt(buffer >> 6  & 0x3f) +
      base64Encoding.charAt(buffer       & 0x3f)
    );
  }

  // Add remaining characters and padding (if necessary)
  if (extraBytes == 2) {
    const buffer = (bytes[position] << 8) + bytes[++position];
    output += (
      base64Encoding.charAt(buffer >> 10) +
      base64Encoding.charAt(buffer >> 4 & 0x3f) +
      base64Encoding.charAt(buffer << 2 & 0x3f) +
      '='
    );
  } else if (extraBytes == 1) {
    const buffer = bytes[position];
    output += (
      base64Encoding.charAt(buffer >> 2) +
      base64Encoding.charAt(buffer << 4 & 0x3f) +
      '=='
    );
  }

  return output;
};

// Convert an integer to an array of bytes
const numberToBytes = (n, b) => {
  const bytes = Array(b);
  for (var i = 0; i < b; i++) {
    const byte = n & 0xff;
    bytes[i] = byte;
    n = (n - byte) / 0x100;
  }
  return bytes;
};

// Polyfill for String.prototype.padStart because react-native uses such an old JavaScriptCore.
const padHex = (s) => {
  if (s.length === 2) { return s; }
  else { return '0'+s; }
};

// Format UUID bytes into a hex string with dashes
function renderUuidBytes(uuidBytes) {
  const uuidHex = uuidBytes.map(byte => padHex(byte.toString(16)));
  return [
    uuidHex[0], uuidHex[1],
    uuidHex[2], uuidHex[3], '-',
    uuidHex[4], uuidHex[5], '-',
    uuidHex[6], uuidHex[7], '-',
    uuidHex[8], uuidHex[9], '-',
    uuidHex[10], uuidHex[11],
    uuidHex[12], uuidHex[13],
    uuidHex[14], uuidHex[15],
  ].join('');
}

import sjcl from './sjcl';

// Generate a v5 UUID in the DNS namespace
// use timestamp.uid.tagSerial.DOMAIN as the name
const uuidDNS = [0x6b, 0xa7, 0xb8, 0x10,  0x9d, 0xad,  0x11, 0xd1,  0x80, 0xb4,  0x00, 0xc0, 0x4f, 0xd4, 0x30, 0xc8];
const version = 0x50;
import { domain } from '../../config.json';
const generateUUID = (created, uid, serial) => {
  const domainName = `${created}.${uid}.${serial.map(byte => padHex(byte.toString(16))).join('')}.${domain}`;
  const bytesToHash = [...uuidDNS, ...domainName.split('').map(c => c.charCodeAt(0))];
  const hashBytes = sjcl.codec.bytes.fromBits(sjcl.hash.sha1.hash(sjcl.codec.bytes.toBits(bytesToHash)));
  hashBytes[6] = (hashBytes[6] & 0x0f) | version;
  hashBytes[8] = (hashBytes[8] & 0x3f) | 0x80;
  return hashBytes.slice(0, 16);
};

// Generate an HMAC signature from the tag bytes
const hmac = (bytes, token) => {
  const hmacSigner = new sjcl.misc.hmac(sjcl.codec.utf8String.toBits(token), sjcl.hash.sha256);
  const hmacBits = hmacSigner.mac(sjcl.codec.bytes.toBits(bytes));
  return sjcl.codec.bytes.fromBits(hmacBits);
};

/**
 * Tag data format
 *     serial:   7 byte NDEF tag serial number
 *     version:  2 byte version number
 *     created:  8 byte JavaScript timestamp
 *     uid:      4 byte user ID
 *     uuid:     16 byte tag UUID
 *     hmac:     32 byte SHA2-256 HMAC
 **/

// Construct tag payload
const buildTag = (serial, uid, token) => {
  // bytes in little-endian order (least significant byte first)
  const version = [1, 0];
  const created = Date.now();
  const uuid = generateUUID(created, uid, serial);
  const unsignedTag = [
    ...serial,
    ...version,
    ...numberToBytes(created, 8),
    ...numberToBytes(uid, 4),
    ...uuid,
  ];
  const tagHmac = hmac(unsignedTag, token);
  return {
    uuid: renderUuidBytes(uuid),
    tagString: encodeBase64([...unsignedTag, ...tagHmac]),
  };
};

export { buildTag };

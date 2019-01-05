// NB: a native BigInt is implemented in V8 as of May 2018, but hasn't landed in
// a production release of Node.js yet.  BigInt would simply things.  Also,
// these are not optimal routines, but they are correct and are used infrequently.

// We assume wordBase * bigBase < Number.MAX_SAFE_INTEGER, and bigBase covers an
// integer number of octets.  Our "BigInt" is an array of integers, from least
// significant to most significant.

import sjcl from './sjcl';

import words from '../assets/words';
const wordBase = words.length;

const bigBase = 2 ** 32;
const bigBaseOctets = 4;

const bigIntCarry = (bigInt) => {
  const len = bigInt.length;
  for (var i=0; i<len; i++) {
    let low = bigInt[i] % bigBase;
    let high = (bigInt[i] - low) / bigBase;
    bigInt[i] = low;
    if (high) { bigInt[i+1] = bigInt[i+1] + high || high; }
  }
  // no return; we mutate bigInt
};
const bigIntAdd = (bigInt, d) => {
  bigInt[0] += d;
  bigIntCarry(bigInt);
};
const bigIntMul = (bigInt, d) => {
  for (var i=0; i<bigInt.length; i++) {
    bigInt[i] *= d;
  }
  bigIntCarry(bigInt);
};
const digitsToBigInt = (digits) => {
  const bigInt = [digits.pop()];
  while (digits.length) {
    bigIntMul(bigInt, wordBase);
    bigIntAdd(bigInt, digits.pop());
  }
  return bigInt;
};

// NB: we fill out all the octets in bigBase even if zero.  Less significant
// bits can always be zero, and we cannot simply right-trim off zeros without
// calculating in advance the precise length we need to output.  Since the
// HMAC algorithm pads the key to the right with zeros if its length is less
// than the blocksize, we are safe not trimming zeros on the right (most
// significant).  This is only an issue if we begin to use passphrases near
// the blocksize; since this is 64 bytes for SHA-2, we need not worry.
const intToString = (n) => {
  const s = Array(bigBaseOctets);
  for (var i=0; i<bigBaseOctets; i++) {
    s[i] = String.fromCharCode(n & 0xff);
    n >>= 8;
  }
  return s.join('');
};
const bigIntToString = (bigInt) => {
  const strings = bigInt.map(intToString);
  return strings.join('');
};

const decodeTokenArray = (tokens) => {
  // NB: if a user submits a word not in the dictionary, indexOf returns -1 (an
  // integer) so the decoding will fail gracefully.
  const tokenDigits = tokens.map((word) => words.indexOf(word));
  const tokenBigInt = digitsToBigInt(tokenDigits);
  return bigIntToString(tokenBigInt);
};

// Sort the keys on the array objects to get a stable JSON.  We rely on ES6
// behavior: keys are iterated over in the order they were added.  Also consider
// libraries such as:
// * https://www.npmjs.com/package/json-stable-stringify
// * https://www.npmjs.com/package/jsonlint
// * https://stackoverflow.com/a/31102605
const sortObject = (unordered) => {
    const ordered = {};
    Object.keys(unordered).sort().forEach((key) => {
        ordered[key] = unordered[key];
    });
    return ordered;
};

const generateSignature = (payload, token) => {
    // sort the payload into a standard order, and JSONify it
    const payloadJSON = JSON.stringify(sortObject(payload));
    // use the token as the key to compute the HMAC
    const hmacSigner = new sjcl.misc.hmac(sjcl.codec.utf8String.toBits(token), sjcl.hash.sha256);
    const hmacBits = hmacSigner.mac(payloadJSON);
    return sjcl.codec.base64.fromBits(hmacBits);
};

export { decodeTokenArray, generateSignature };

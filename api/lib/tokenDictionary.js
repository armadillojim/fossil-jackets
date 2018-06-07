// Tool to convert an 80-bit integer to a sequence of 6 dictionary words

// NB: a native BigInt is implemented in V8 as of May 2018, but hasn't landed in
// a production release of Node.js yet.  BigInt would simply things.

// We assume wordBase * bigBase < Number.MAX_SAFE_INTEGER, and bigBase covers an
// integer number of octets.  Our "BigInt" is an array of integers, from least
// significant to most significant.

const bigBase = 2 ** 32;
const bigBaseOctets = 4;

const words = require('./words.js');
const wordBase = words.length;

// Use long division to compute divmod(BigInt, Number).
const divmod = (x, d) => {
    const q = Array(x.length).fill(0);
    for (var i = x.length - 1, r = 0; i >= 0; i--) {
        r *= bigBase;
        r += x[i];
        const rNext = r % d;
        q[i] = (r - rNext) / d;
        r = rNext;
    }
    return [q, r];
};

// Convert a string of bytes to a BigInt.
const stringToNumber = (s) => {
    for (var i = Math.min(bigBaseOctets, s.length), n = 0; i > 0;) {
        n *= 256;
        n += s.charCodeAt(--i);
    }
    return n;
};
const stringToBigInt = (s) => {
    return s.match(new RegExp(`.{1,${bigBaseOctets}}`, 'g')).map(stringToNumber);
};

// Convert a string of bytes to dictionary words
const stringLengthToDictionaryLength = 8.0 * Math.log(2.0) / Math.log(wordBase);
const stringToDictionary = (s) => {
    var b = stringToBigInt(s), w = [], r;
    const isZero = (x) => x === 0;
    while (!b.every(isZero)) {
        [b, r] = divmod(b, wordBase);
        w.push(words[r]);
    }
    const dictionaryLength = Math.ceil(s.length * stringLengthToDictionaryLength);
    return w.concat(Array(dictionaryLength - w.length).fill(words[0]));
};

module.exports = stringToDictionary;

// Schema for jacket object validation.

// NB: we rely on signature verification to validate the UID as existing and
// having a non-revoked token.

const jacketSchema = {
    type: 'object',
    properties: {
        version: { type: 'integer', const: 2 },
        juid: { type: 'integer', minimum: 0 },
        expedition: { type: 'string', minLength: 1, maxLength: 256 },
        jacketNumber: { type: 'string', minLength: 1, maxLength: 256 },
        created: { type: 'integer', format: 'recent' },
        locality: { type: 'string', minLength: 1, maxLength: 256 },
        lat: { type: 'number', minimum: -90.0, maximum: +90.0 },
        lng: { type: 'number', minimum: -180.0, maximum: +180.0 },
        elevation: { type: 'number', minimum: -12000.0, maximum: +10000.0 },
        formation: { type: 'string', minLength: 1, maxLength: 256 },
        specimenType: { type: 'string', minLength: 1, maxLength: 256 },
        personnel: { type: 'string', minLength: 1, maxLength: 256 },
        notes: { type: 'string', minLength: 1, maxLength: 1024 },
        tid: { type: 'string', pattern: '[0-9A-F]{14}' },
        jhmac: { type: 'string', format: 'base64', minLength: 44, maxLength: 44 },
    },
    required: [ 'version', 'juid', 'expedition', 'jacketNumber', 'created', 'jhmac' ],
    additionalProperties: false
};

const photoSchema = {
    type: 'object',
    properties: {
        puid: { type: 'integer', minimum: 0 },
        jid: { type: 'integer', minimum: 0 },
        image: { type: 'string', format: 'imageDataUri', minLength: 4 },
        phmac: { type: 'string', format: 'base64', minLength: 44, maxLength: 44 },
    },
    required: [ 'puid', 'jid', 'image', 'phmac' ],
    additionalProperties: false
};

const validBase64 = (data, offset) => {
    const base64Length = data.length - offset;
    const Base64Regexp = new RegExp(`^.{${offset}}[+/0-9=A-Za-z]*$`);
    const goodCharacters = base64Length && base64Length % 4 === 0 && Base64Regexp.test(data);
    if (!goodCharacters) { return false; }
    const firstPad = data.indexOf('=');
    const dataLength = data.length;
    const okPadding = firstPad === -1 || firstPad === dataLength - 1 || firstPad === dataLength - 2 && data.slice(-1) === '=';
    return okPadding;
};

// validate a string as Base64
// NB: ajv does not yet do any validation for `contentEncoding: "base64"`.
const base64Format = {
    type: 'string',
    validate: (data) => {
        return validBase64(data, 0);
    },
};

// validate a string as a data URI for an image
const imageDataUriRegexp = new RegExp('^data:(image/.{3,16});base64,');
const imageDataUriFormat = {
    type: 'string',
    validate: (data) => {
        const match = data.match(imageDataUriRegexp);
        if (!match) { return false; }
        return validBase64(data, match[0].length);
    },
};

// check that a time isn't too far in the past nor in the future
const recentFormat = {
    type: 'number',
    validate: (data) => {
        const now = Date.now();
        const oneYearAgo = now - 365 * 86400 * 1000;
        return oneYearAgo < data && data < now;
    },
};

module.exports = {
    jacketSchema: jacketSchema,
    photoSchema: photoSchema,
    base64Format: base64Format,
    imageDataUriFormat: imageDataUriFormat,
    imageDataUriRegexp: imageDataUriRegexp,
    recentFormat: recentFormat,
};

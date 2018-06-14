// Schema for jacket object validation.

// NB: we rely on signature verification to validate the UID as existing and
// having a non-revoked token.

const jacketSchema = {
    type: 'object',
    properties: {
        version: { type: 'integer', const: 1 },
        juid: { type: 'integer', minimum: 0 },
        expedition: { type: 'string', minLength: 1, maxLength: 256 },
        jacketNumber: { type: 'string', minLength: 1, maxLength: 256 },
        created: { type: 'integer', format: 'recent' },
        locality: { type: 'string', minLength: 1, maxLength: 256 },
        lat: { type: 'number', minimum: -90.0, maximum: +90.0 },
        lng: { type: 'number', minimum: -180.0, maximum: +180.0 },
        formation: { type: 'string', minLength: 1, maxLength: 256 },
        specimenType: { type: 'string', minLength: 1, maxLength: 256 },
        personnel: { type: 'string', minLength: 1, maxLength: 256 },
        notes: { type: 'string', minLength: 1, maxLength: 1024 },
        tid: { type: 'string', format: 'uuid' },
        jhmac: { type: 'string', format: 'base64', minLength: 44, maxLength: 44 },
    },
    required: [ 'version', 'juid', 'expedition', 'jacketNumber', 'created', 'jhmac' ],
    additionalProperties: false
};

// validate a string as Base64
// NB: ajv does not yet do any validation for `contentEncoding: "base64"`.
const Base64Characters = /^[+/0-9=A-Za-z]*$/;
const base64Format = {
    type: 'string',
    validate: (data) => {
        const l = data.length;
        const goodCharacters = l && l % 4 === 0 && Base64Characters.test(data);
        if (!goodCharacters) { return false; }
        const firstPad = data.indexOf('=');
        const okPadding = firstPad === -1 || firstPad === l - 1 || firstPad === l - 2 && data[l - 1] === '=';
        return okPadding;
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
    base64Format: base64Format,
    recentFormat: recentFormat,
};

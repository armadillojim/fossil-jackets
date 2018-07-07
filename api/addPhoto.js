// Add a new photo from JSON, JPEG, or PNG

const bail = (message) => {
    console.error(message);
    process.exit(1);
}

if (process.argv.length < 4 || process.argv.length > 5) {
    bail('Usage: node addPhoto.js fullPathToFile JID [UID]');
}

const fs = require('fs');
const fileName = process.argv[2];
const isJson = fileName.endsWith('.json');
const isPng = fileName.endsWith('.png');
const isJpeg = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');
const jid = Number(process.argv[3]);
const uid = Number(process.argv[4]);

var photo;
if (isJson) {
    const photoJSON = fs.readFileSync(fileName, { encoding: 'utf8' });
    photo = JSON.parse(photoJSON);
    if (uid) { photo.puid = uid; }
    photo.jid = jid;
}
else if (isPng || isJpeg) {
    if (!uid) { bail('Must provide UID for raw images.'); }
    const imagePrefix = isJpeg ? 'data:image/jpeg;base64,' : 'data:image/png;base64,';
    const imageBuffer = fs.readFileSync(fileName);
    photo = {
        puid: uid,
        jid: jid,
        image: imagePrefix + imageBuffer.toString('base64'),
    };
}
else {
    console.error('Can only upload JSON, JPEG, or PNG.');
    process.exit(1);
}

const initDb = require('./lib/initDb.js')(console);
var db = false;
initDb.then((theDb) => {
    db = theDb;
    const { generateSignature } = require('./components/common/common.service.js')(db);
    return generateSignature(photo, photo.puid);
}).then((hmac) => {
    photo.phmac = hmac;
    const jacketService = require('./components/jacket/jacket.service.js')(db);
    const jacketController = require('./components/jacket/jacket.controller.js')(jacketService);
    return jacketController.putPhoto(jid, photo);
}).then((pid) => {
    console.log(`wrote PID: ${pid}`);
    const logger = require('./lib/initLogger.js');
    logger.info(`wrote PID: ${pid} from ${fileName}`);
    return db.end();
}).catch((err) => {
    console.error(err);
    if (db) { return db.end(); }
});

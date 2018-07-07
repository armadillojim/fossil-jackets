// Add a new jacket from JSON file

if (process.argv.length !== 3 || !process.argv[2].endsWith('.json')) {
    console.error('Please provide one and only one JSON profile to process.');
    process.exit(1);
}
const fileName = process.argv[2];
var jacket;
try {
    const fs = require('fs');
    const jacketJSON = fs.readFileSync(fileName, { encoding: 'utf8' });
    jacket = JSON.parse(jacketJSON);
} catch (err) {
    console.error(err);
    process.exit(1);
}

const initDb = require('./lib/initDb.js')(console);
var db = false;
initDb.then((theDb) => {
    db = theDb;
    const jacketService = require('./components/jacket/jacket.service.js')(db);
    const jacketController = require('./components/jacket/jacket.controller.js')(jacketService);
    return jacketController.putJacket(jacket);
}).then((jid) => {
    console.log(`wrote JID: ${jid}`);
    const logger = require('./lib/initLogger.js');
    logger.info(`wrote JID: ${jid} from ${fileName}`);
    return db.end();
}).catch((err) => {
    console.error(err);
    if (db) { return db.end(); }
});

// Blow some simulated data into the jackets table.
// We don't do photos for the moment as that would require generating some random JPEGs.

const faker = require('faker');
const fakeJacketData = async (uid, generateSignature) => {
    const oneYear = 365 * 86400 * 1000;
    const now = Date.now();
    const jacketData = {
        version: 1,
        uid: uid,
        expedition: faker.company.companyName() + ' 2018',
        jacketNumber: faker.helpers.replaceSymbols('###########?'),
        created: faker.random.number({ min: now - oneYear, max: now }),
        locality: faker.address.streetName(),
        lat: Number(faker.address.latitude()),
        lng: Number(faker.address.longitude()),
        formation: faker.company.catchPhrase(),
        specimenType: faker.random.words(),
        notes: faker.lorem.sentences(),
        tidA: faker.random.uuid(),
        tidB: faker.random.uuid(),
    };

    const personnelNames = Array(faker.random.number({ min: 0, max: 5 })).fill(null).map(() => faker.name.firstName());
    if (personnelNames.length) { jacketData.personnel = personnelNames.join(', '); }

    // TODO: generate some fake s3 URIs?  or generate some fake JPEGs?

    // sign the jacket and return it
    jacketData.jhmac = await generateSignature(jacketData, uid);
    return jacketData;
};

const initDb = require('./lib/initDb.js')(console);
initDb.then(async (db) => {

    const commonService = require('./components/common/common.service.js')(db);
    const jacketService = require('./components/jacket/jacket.service.js')(db);
    const jacketController = require('./components/jacket/jacket.controller.js')(jacketService);

    const uidQuery = 'select uid from users where revoked is null order by random() limit 1';
    const uidResult = await db.query(uidQuery);
    const uid = uidResult.rows[0].uid;

    const jacket = await fakeJacketData(uid, commonService.generateSignature);
    const jid = await jacketController.putJacket(jacket);
    console.log(`success: ${jid} ${JSON.stringify(jacket)}`);

    // TODO: use returned JID to insert into photos

    await db.end();

}).catch((err) => {
    console.error(err);
});

// Blow some simulated data into the jackets and photos table.

const faker = require('faker');

const fakeJacketData = async (uid, generateSignature) => {
    const oneYear = 365 * 86400 * 1000;
    const now = Date.now();
    const jacketData = {
        version: 1,
        juid: uid,
        expedition: faker.company.companyName() + ' 2018',
        jacketNumber: faker.helpers.replaceSymbols('###########?'),
        created: faker.random.number({ min: now - oneYear, max: now }),
        locality: faker.address.streetName(),
        lat: Number(faker.address.latitude()),
        lng: Number(faker.address.longitude()),
        formation: faker.company.catchPhrase(),
        specimenType: faker.random.words(),
        notes: faker.lorem.sentences(),
        tid: faker.random.uuid(),
    };

    const personnelNames = Array(faker.random.number({ min: 0, max: 5 })).fill(null).map(() => faker.name.firstName());
    if (personnelNames.length) { jacketData.personnel = personnelNames.join(', '); }

    // sign the jacket and return it
    jacketData.jhmac = await generateSignature(jacketData, uid);
    return jacketData;
};

const redDotPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
const checkedBoxPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD///+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4Ug9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC';
const eyesJpeg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDADIiJSwlHzIsKSw4NTI7S31RS0VFS5ltc1p9tZ++u7Kfr6zI4f/zyNT/16yv+v/9////////wfD/////////////2wBDATU4OEtCS5NRUZP/zq/O////////////////////////////////////////////////////////////////////wAARCAAYAEADAREAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAQMAAgQF/8QAJRABAAIBBAEEAgMAAAAAAAAAAQIRAAMSITEEEyJBgTORUWFx/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AOgM52xQDrjvAV5Xv0vfKUALlTQfeBm0HThMNHXkL0Lw/swN5qgA8yT4MCS1OEOJV8mBz9Z05yfW8iSx7p4j+jA1aD6Wj7ZMzstsfvAas4UyRHvjrAkC9KhpLMClQntlqFc2X1gUj4viwVObKrddH9YDoHvuujAEuNV+bLwFS8XxdSr+Cq3Vf+4F5RgQl6ZR2p1eAzU/HX80YBYyJLCuexwJCO2O1bwCRidAfWBSctswbI12GAJT3yiwFR7+MBjGK2g/WAJR3FdF84E2rK5VR0YH/9k=';

const fakePhotoData = async (uid, jid, generateSignature) => {
    const photoData = {
        puid: uid,
        jid: jid,
        image: faker.random.arrayElement([redDotPng, checkedBoxPng, eyesJpeg]),
    };

    // sign the photo and return it
    photoData.phmac = await generateSignature(photoData, uid);
    return photoData;
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

    const photo = await fakePhotoData(uid, jid, commonService.generateSignature);
    const pid = await jacketController.putPhoto(jid, photo);
    console.log(`success: ${pid}`);

    await db.end();

}).catch((err) => {
    console.error(err);
});

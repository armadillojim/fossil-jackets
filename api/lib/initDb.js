// Create a database promise for a connection

// NB: for higher performance, consider switching to libpq.  Changes required:
// * below: const { Pool } = require('pg').native;
// * Dockerfile: apt-get install -y build-essential libpq-dev
// * package.json: "pg-native": "^3.0.0",

const fs = require('fs');
const pg = require('pg');

const dbUrl = process.env.DB_URL;
const awsRdsSsl = {
    ca: fs.readFileSync('lib/rds-combined-ca-bundle.pem', 'utf8'),
    rejectUnauthorized: true,
};
const poolConfig = {
    connectionString: dbUrl,
    ssl: (process.env.NODE_ENV === 'development') ? false : awsRdsSsl,
    statement_timeout: 1000, // 1s timeout on queries
    connectionTimeoutMillis: 250, // 250ms timeout connecting a new client
    idleTimeoutMillis: 10000, // 10s idle time on pool connections
    max: 3, // keep 3 connections in the pool
};

// We use int8s for JavaScript timestamps.  The library returns these as strings
// since Javascript internally uses IEEE double-precision floats, and those only
// have 53 bits of mantissa.  That is, there is a potential loss of precision
// for very large int8s.  But we don't want strings, we want JavaScript
// timestamps ... sigh.  Note: this setting is undocumented, and cannot be made
// in the poolConfig.  Double sigh.
pg.defaults.parseInt8 = true;

module.exports = function(logger) {

    return new Promise((resolve, reject) => {
        const pgPool = new pg.Pool(poolConfig);
        pgPool.connect()
            .then((pgClient) => {
                // install a listener to log uncaught error events
                pgPool.on('error', (err) => {
                    logger.error('api-db: something bad has happened! ' + JSON.stringify(err.stack, null, 4));
                });
                // release the client, log the connection, et voila
                pgClient.release();
                logger.info(`api-db: connected to ${dbUrl}`);
                resolve(pgPool);
            })
            .catch((err) => {
                logger.error('api-db: connection error ' + JSON.stringify(err.stack, null, 4));
                reject(err);
            });
    });

};

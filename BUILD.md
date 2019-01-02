1. Install [docker](https://docs.docker.com/install/).

1. Install [docker-compose](https://docs.docker.com/compose/install/).

1. Pull this repository.

1. Copy `.env_TEMPLATE` to `.env`, and customize the variables in there.  At a minimum, you should use your own domain name for the `DOMAIN` variable, and set the `HOST_IP` to the IP address on your LAN of your development machine.  If using a self-signed certificate, using `DOMAIN=localhost` is acceptable.

1. Install your certificate and key in `nginx/certificates/` in `cert.pem` and `key.pem`.  Here are some [sample instructions](https://stackoverflow.com/a/10176685) for generating a self-signed certificate for development.  Alternatively, if you own your own domain, you can get free certificates from [Let's Encrypt](https://letsencrypt.org/getting-started/).  I used `local.example.com` (substituting my domain name for `example.com`), set an `A` record in my DNS for `local.example.com` to point to the `HOST_IP` from `.env`, and used the certbot docker container with a DNS challenge to create my certificates.

1. Add your custom list of formations and localities to `app/components/assets/` in `formations.js` and `localities.js`.  Each file needs a simple `module.exports = [ 'Alice', 'Bob', ... ];`.

1. `docker-compose build` from the base of the repository.  This will take some time, but will only have to happen once.

1. `docker-compose up` from the base of the repository.  Alternatively, use `docker-compose start` and `docker-compose stop` to start and stop the containers.  Note: if you use `docker-compose down`, you will destroy all the containers.  While this has no effect on most of the components, it means your database will be wiped out; any data there will be lost.

1. `docker exec fossil-jackets-db schema.sh` to populate an empty database.  Once you have an operating test, staging, or production database, you can dump or restore it using the corresponding scripts.

1. On your phone, install the [Expo](https://expo.io/tools#client) app.  Open the app, and click "Scan QR Code".  Use your phone to scan the QR code that is displayed when starting the `app` container.  Note: make sure your development host has ports 443, 19000, and 19001 open.

1. During development, container services should automagically detect file changes and restart themselves.

1. You can register users by using `docker exec fossil-jackets-api node registerUser.js`.  The script will repeat back the UID and password tokens you'll need on the phone app.  There are other convenience tools for viewing and revoking user credentials, along with inserting jackets and photos at will.

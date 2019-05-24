#!/bin/sh
# Usage: docker exec -it fossil-jackets-db /db/migration_v01_to_v02.sh

# Add elevation field to jackets.
/usr/local/bin/psql $DB_URL -c 'alter table jackets add column elevation float8;'

# Change tag ID from UUID to tag serial number (hex encoded).  Existing UUIDs get
# converted to formatted strings.
/usr/local/bin/psql $DB_URL -c 'alter table jackets alter column tid type varchar(128);'

# New tokens are 256 bits.  With 64 bits of salt and 64 bits of AES padding, this
# base64 encodes to 64 bytes (with no base64 padding).  Existing token values get
# padded right to fill them out to 64 characters.
/usr/local/bin/psql $DB_URL -c 'alter table users alter column token type char(64);'
# Revoke existing users' credentials.  Users will need to be re-registered.
/usr/local/bin/psql $DB_URL -c 'update users set revoked=cast(1000.0*extract(epoch from current_timestamp) as bigint) where revoked is null;'

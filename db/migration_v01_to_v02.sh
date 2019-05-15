#!/bin/sh
# Usage: docker exec -it fossil-jackets-db /db/migration_v01_to_v02.sh
/usr/local/bin/psql $DB_URL -c 'alter table jackets alter column tid type varchar(128);'

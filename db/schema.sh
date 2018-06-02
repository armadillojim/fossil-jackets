#!/bin/sh
# Usage: docker exec -it fossil-jackets-db /db/schema.sh
/usr/local/bin/psql $DB_URL < /db/schema.sql

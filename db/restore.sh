#!/bin/sh
# Usage: docker exec -it fossil-jackets-db /db/restore.sh
/bin/zcat /db/db.sql.gz | /usr/local/bin/psql $DB_URL > /dev/null

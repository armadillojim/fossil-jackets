There are three scripts in the directory:
* `schema.sh` uses `schema.sql` to initially populate the database
* `dump.sh` to save the contents of the database to a local file, `db.sql.gz`
* `restore.sh` to use `db.sql.gz` to re-populate the database

The `schema.sql` serves as the principal reference for the database tables and
fields.  Every time it changes, create a `schemaAlter-vX-vY.sql` to migrate an
existing database to the new schema.  For example, a planned change is to add a
new `elevation` column to the `jackets` table.

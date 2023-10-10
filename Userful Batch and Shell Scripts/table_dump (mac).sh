#!/bin/bash

# Get a list of tables in the database
DB_NAME="local"
TABLES=$(mysql -u root -proot -N -B -e "SHOW TABLES FROM $DB_NAME")

dump_table() {
  TABLE=$1
  FILENAME=$(echo -n "$TABLE" | md5 | cut -d ' ' -f 4).sql
  mysqldump -u root -proot local "$TABLE" | pv | tail -n +2 > "$FILENAME"
  echo "Dumped table: $TABLE"
}

export -f dump_table

# Multithread the dumping of tables
echo "$TABLES" | xargs -I {} -P 4 bash -c 'dump_table "$@"' _ {}
```

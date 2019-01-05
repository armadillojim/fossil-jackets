#!/bin/sh

/bin/cp $HOME/config_TEMPLATE.json $HOME/src/components/config.json
/bin/sed -i "s/\${DOMAIN}/$DOMAIN/" $HOME/src/components/config.json

/usr/local/bin/npm start

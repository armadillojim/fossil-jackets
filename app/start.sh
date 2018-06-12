#!/bin/sh

/bin/cp $HOME/config_TEMPLATE.json $HOME/config.json
/bin/sed -i "s/\${DOMAIN}/$DOMAIN/" $HOME/config.json

/usr/local/bin/yarn start

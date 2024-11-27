#!/bin/bash
BASEDIR=$(dirname $0)/..

echo $BASEDIR

if [ -z $HPAPP_CONFIG_NAME ]; then
    echo "HPAPP_CONFIG_NAME is not defined."
    exit 1
fi

EAS_JSON=$BASEDIR/config/$HPAPP_CONFIG_NAME/eas.json

cp $EAS_JSON $BASEDIR/eas.json

# echo $@
eas $@
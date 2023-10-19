#!/bin/bash
BASEDIR=$(dirname $0)/..

echo $BASEDIR

if [ -z $HPAPP_CONFIG_NAME ]; then
    echo "HPAPP_CONFIG_NAME is not defined."
    exit 1
fi

if [ -z $HPAPP_CONFIG_PLATFORM ]; then
    HPAPP_CONFIG_PLATFORM=ios
fi

EAS_JSON=$BASEDIR/config/$HPAPP_CONFIG_NAME/eas.json

if [ ! -f $EAS_JSON ]; then
    echo "$EAS_JSON does not exist."
    exit 1
fi

cp $EAS_JSON $BASEDIR/eas.json
yarn eas build --profile $HPAPP_CONFIG_NAME --platform $HPAPP_CONFIG_PLATFORM --non-interactive
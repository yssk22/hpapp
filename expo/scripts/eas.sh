#!/bin/bash
BASEDIR=$(dirname $0)/..

echo $BASEDIR

if [ -z $HPAPP_CONFIG_NAME ]; then
    echo "HPAPP_CONFIG_NAME is not defined."
    exit 1
fi

## extract environment secrets if exists
if [ -z $GOOGLE_SERVICES_INFO_PLIST ]; then
    echo "no GOOGLE_SERVICES_INFO_PLIST found"
else
    echo "generating $BASEDIR/config/$HPAPP_CONFIG_NAME/GoogleService-Info.plist from environment variable."
    envsubst < $BASEDIR/config/GoogleService-Info.plist.env > $BASEDIR/config/$HPAPP_CONFIG_NAME/GoogleService-Info.plist
fi

if [ -z $GOOGLE_SERVICES_JSON ]; then
    echo "no GOOGLE_SERVICES_JSON found"
else
    echo "generating $BASEDIR/config/$HPAPP_CONFIG_NAME/google-services.json from environment variable."
    envsubst < $BASEDIR/config/google-services.json.env > $BASEDIR/config/$HPAPP_CONFIG_NAME/google-services.json
fi

if [ "$1" = "build" -o "$1" = "update" ]; then
    EAS_JSON=$BASEDIR/config/$HPAPP_CONFIG_NAME/eas.json
elif [ "$1" = "submit" ]; then
    EAS_JSON=$BASEDIR/config/eas.json
else
    echo "only build or submit is allowed."
    exit 1
fi

echo "use ${EAS_JSON}"
cp $EAS_JSON $BASEDIR/eas.json

# # echo $@
eas $@
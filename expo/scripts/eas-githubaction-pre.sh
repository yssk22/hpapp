#!/bin/bash
BASEDIR=$(dirname $0)/..

if [ -z $HPAPP_CONFIG_NAME ]; then
    echo "HPAPP_CONFIG_NAME is not defined."
    exit 1
fi

## extract environment screts 
echo '$SECRETS_JSON' | envsubst > $BASEDIR/config/$HPAPP_CONFIG_NAME/secrets.json
echo '$GOOGLE_SERVICES_INFO_PLIST' | envsubst > $BASEDIR/config/$HPAPP_CONFIG_NAME/GoogleService-Info.plist
echo '$GOOGLE_SERVICES_JSON' | envsubst > $BASEDIR/config/$HPAPP_CONFIG_NAME/google-services.json

## remove .gitignore as eas still ignore those files
rm $BASEDIR/config/$HPAPP_CONFIG_NAME/.gitignore
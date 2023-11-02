#!/bin/bash
BASEDIR=$(dirname $0)/..

ICON_PNG=$BASEDIR/config/$HPAPP_CONFIG_NAME/icon.png
SPLASH_PNG=$BASEDIR/config/$HPAPP_CONFIG_NAME/splash.png

# Files are loaded by using `useAssets()`, which doesn't support dynamic path. 
cp $ICON_PNG $BASEDIR/assets/icon.png
cp $SPLASH_PNG $BASEDIR/assets/splash.png

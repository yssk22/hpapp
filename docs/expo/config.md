# Build Configurations

## app.config.js

app.config.js is a configuration file that allows you to define how your app is built. We have some logic to aggregate the configurations from multiple files.

### app.config.default.js

This file is the base file for any environment. We use the automatic build number (iOS) / version code (Android) allocation based on the timestamp so that we can avoid the manual increment of the version number.

### config/{env}/secrets.json

The static JSON file to store (potentially) sensitive environment-specific values. Currently we support the following format only.

```json
{
  "extra": {
    "hpapp": {
      "graphQLEndpoint": "{your GraphQL endpoint}",
      "auth": {
        "google": {
          "iosClientId": "{your iOS client ID}",
          "androidClientId": "{your android client ID}"
        }
      }
    }
  }
}
```

### config/{env}/app.config.js

The environment specific configurations are stored in the config/{env}/app.config.js file. The values in app.config.default.js can be overwritten in the environment specific configuration file. You should not add any sensitive information (API keys, ...etc) to this file and this file can be added to git repository.

## development build

In development builds (expo-dev-client), app.config.js is loaded from **your development container** (not from your build) **only first time** when the app is launched. This means

- If you need to reflect changes on above app.config.js related files you need to reinstall the app.
- You need to have all configuration files (such as googleServicesFile) on your development container.

## Common Senarios

### I want to use my local Go server to test someting

TBD

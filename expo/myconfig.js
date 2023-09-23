module.exports = ({ config }) => {
  config.slug = "app-helloproject-yssk22";
  config.ios.bundleIdentifier = "app.helloproject.yssk22";
  config.android.package = "app.helloproject.yssk22";
  // config.ios.googleServicesFile = "./" + ENV + "/GoogleService-Info.plist";
  // config.android.googleServicesFile = "./" + ENV + "/google-services.json";

  config.extra.eas.projectId = "aa2bfb84-cbdd-419c-9298-37d41a367e16";
  // config.extra.hpapp.graphql_endpoint = "http://192.168.1.66:8080/graphql/v3";
  return config;
};

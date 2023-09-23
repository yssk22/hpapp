module.exports = ({ config }) => {
  config.slug = "app.helloproject.yssk22";
  config.ios.bundleIdentifier = "app.helloproject.yssk22";
  // config.ios.googleServicesFile = "./" + ENV + "/GoogleService-Info.plist";
  config.android.package = "app.helloproject.yssk22";
  // config.android.googleServicesFile = "./" + ENV + "/google-services.json";

  // If you get "Couldn't get GraphQL endpoint" error on start up,
  // you need to point GraphQL Endpoint to your dev container here
  // confit.extra.hpapp.graphql_endpoint = ""

  return config;
};

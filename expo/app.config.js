const fs = require("fs");
const config = require("./app.config.default").expo;

module.exports = (_) => {
  if (process.env["REACT_NATIVE_PACKAGER_HOSTNAME"] != "") {
    config.extra.hpapp.graphql_endpoint =
      "http://" +
      process.env["REACT_NATIVE_PACKAGER_HOSTNAME"] +
      ":8080/graphql/v3";
  }

  // use developer specific configuration (e.g slug, bundleidentifier, ...etc)
  // using myconfi.js if it exists
  const configure = fs.existsSync("./myconfig.js")
    ? require("./myconfig")
    : ({ config }) => config;
  const myconfig = configure({ config });
  return myconfig;
};

/* eslint-disable @typescript-eslint/no-var-requires */
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const wp = require("@cypress/webpack-preprocessor");
const dotenv = require("dotenv");
const path = require("path");

module.exports = (on, config) => {
  const options = {
    webpackOptions: require("../webpack.cypress.config"),
  };
  on("file:preprocessor", wp(options));

  // add environment variables to Cypress config (Cypress.env('env_name'))
  dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });
  config.env.TILE_API_SERVICE_URL = process.env.TILE_API_SERVICE_URL;
  config.env.OAUTH_SERVICE_URL = process.env.OAUTH_SERVICE_URL;
  config.env.OAUTH_SERVICE_AUTH_TOKEN = process.env.OAUTH_SERVICE_AUTH_TOKEN;
  return config;
};

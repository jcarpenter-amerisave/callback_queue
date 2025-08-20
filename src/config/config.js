const { getSecret } = require("../../src/utils/util");

const API_CLIENT_ID = getSecret("API_CLIENT_ID"); // Your API client ID
const BASIC_AUTH_USER = getSecret("BASIC_AUTH_USER");
const BASIC_AUTH_PASSWORD = getSecret("BASIC_AUTH_PASSWORD");
const API_CLIENT_SECRET = getSecret("API_CLIENT_SECRET"); // Your API client secret
const AUTH_URL = getSecret("AUTH_URL"); // The URL to get your bearer token
const AUTH_AUDIENCE = getSecret("AUTH_AUDIENCE");
const YOUR_ENDPOINT_URL = getSecret("YOUR_ENDPOINT_URL"); // Your final API endpoint
const SFMC_JWT_SECRET = getSecret("SFMC_JWT_SECRET"); // From your installed package in SFMC

module.exports = {
  API_CLIENT_ID,
  BASIC_AUTH_USER,
  BASIC_AUTH_PASSWORD,
  API_CLIENT_SECRET,
  AUTH_URL,
  AUTH_AUDIENCE,
  YOUR_ENDPOINT_URL,
  SFMC_JWT_SECRET
};
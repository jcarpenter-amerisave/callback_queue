const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router({});
const { API_CLIENT_ID, BASIC_AUTH_USER, BASIC_AUTH_PASSWORD, API_CLIENT_SECRET, AUTH_URL, AUTH_AUDIENCE, YOUR_ENDPOINT_URL, SFMC_JWT_SECRET } = require("../config/config");
console.log("Journey Builder Router");
console.log(API_CLIENT_ID);
console.log(BASIC_AUTH_USER);
console.log(BASIC_AUTH_PASSWORD);
console.log(API_CLIENT_SECRET);
console.log(AUTH_URL);
console.log(AUTH_AUDIENCE);
console.log(YOUR_ENDPOINT_URL);
console.log(SFMC_JWT_SECRET);
// Function to decode the JWT from SFMC
function decodeJwt(req, res, next) {
    const token = req.body.toString("utf8");
    if (!token) {
      return res.status(401).send("Unauthorized: No JWT provided");
    }
  
    try {
      const decoded = jwt.verify(token, SFMC_JWT_SECRET, {
        algorithms: ["HS256"],
      });
      req.jwtPayload = decoded;
      next();
    } catch (err) {
      console.error("JWT Verification Failed:", err);
      return res.status(401).send("Unauthorized: Invalid JWT");
    }
}


// Endpoint for Journey Builder to call for activity execution
// This is the `execute` endpoint defined in your config.json
router.post("/execute", decodeJwt, async (req, res) => {
console.log("Received execute request from Journey Builder");
const inArguments = req.jwtPayload.inArguments;

// InArguments are configured in the customActivity.js and passed from Journey Builder
const customPayload = inArguments.find((arg) => arg.payload)?.payload;

if (!customPayload) {
    console.error("Payload not found in inArguments");
    return res
    .status(400)
    .json({ status: "error", message: "Payload not found" });
}

try {
    // Step 1: Authenticate and get a bearer token using your specified details
    console.log(
    "Authenticating with external API using your custom payload..."
    );
    const authPayload = {
    client_id: API_CLIENT_ID,
    client_secret: API_CLIENT_SECRET,
    audience: AUTH_AUDIENCE,
    grant_type: "client_credentials",
    };

    const authResponse = await fetch(AUTH_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(authPayload),
    });

    if (!authResponse.ok) {
    throw new Error(
        `Authentication failed with status: ${authResponse.status}`
    );
    }

    const authData = await authResponse.json();
    const bearerToken = authData.access_token;
    console.log("Authentication successful. Bearer token received.");

    // Step 2: Send the final payload with the bearer token
    console.log("Sending payload to your endpoint...");
    const apiResponse = await fetch(YOUR_ENDPOINT_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(customPayload),
    });

    if (!apiResponse.ok) {
    throw new Error(`API call failed with status: ${apiResponse.status}`);
    }

    const apiResult = await apiResponse.json();
    console.log("API call successful. Response:", apiResult);

    // Journey Builder expects a 200 OK response to know the activity completed successfully
    return res.status(200).json({ status: "success", result: apiResult });
} catch (error) {
    console.error("Execution failed:", error.message);
    return res.status(500).json({ status: "error", message: error.message });
}
});

module.exports = router;
requirejs.config({
  paths: {
    postmonger: "./postmonger.min",
  },
});

require(["postmonger"], function (Postmonger) {
  "use strict";

  const connection = new Postmonger.Session();
  let payload = {};
  let authTokens = {};

  connection.on("initActivity", onInit);
  connection.on("requestedTokens", onGetTokens);
  connection.on("requestedEndpoints", onGetEndpoints);
  connection.on("clickedNext", onClickedNext);

  document.getElementById("cancel").addEventListener("click", function () {
    connection.trigger("destroy");
  });

  function onInit(data) {
    if (data) {
      payload = data;
    }

    connection.trigger("requestTokens");
    connection.trigger("requestEndpoints");

    const inArguments =
      (payload["arguments"] && payload["arguments"].execute.inArguments) || [];
    const savedPayload = inArguments.find((arg) => arg.payload)?.payload;
    if (savedPayload) {
      document.getElementById("payload").value = JSON.stringify(
        savedPayload,
        null,
        2
      );
    }
  }

  function onGetTokens(tokens) {
    authTokens = tokens;
    console.log("Tokens received:", authTokens);
  }

  function onGetEndpoints(endpoints) {
    console.log("Endpoints received:", endpoints);
  }

  function onClickedNext() {
    const payloadValue = document.getElementById("payload").value;
    try {
      const parsedPayload = JSON.parse(payloadValue);

      payload["arguments"] = payload["arguments"] || {};
      payload["arguments"].execute = payload["arguments"].execute || {};
      payload["arguments"].execute.inArguments = [{ payload: parsedPayload }];

      console.log("Saving payload:", payload);

      connection.trigger("updateActivity", payload);
    } catch (e) {
      alert("Invalid JSON in payload. Please correct and try again.");
      console.error("Invalid JSON:", e);
    }
  }
});

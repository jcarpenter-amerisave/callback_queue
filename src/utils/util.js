const fs = require("fs");

const getSecret = function (secretName) {
    let finalFileName = process.env[secretName + "_FILE"] || process.env[secretName + "_SECRET"];
    console.log("Secret Name: " + secretName + " Final File Name: " + finalFileName);
    if(finalFileName){
        return fs.readFileSync(`/var/run/secrets/${finalFileName}`, "utf8");
    }else{
        return process.env[secretName];
    }
};

module.exports = { getSecret };
const functions = require("firebase-functions");

exports.goodbyeWorld = functions.https.onRequest((req, res) => {
  res.json({ data: "Goodbye World!" });
});

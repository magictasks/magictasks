const { helloWorld } = require("./helloWorld");
const { goodbyeWorld } = require("./goodbyeWorld");

exports.helloWorld = helloWorld;
exports.goodbyeWorld = goodbyeWorld;

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const { FieldValue } = require("firebase-admin/firestore");

exports.writeSessionData = functions.https.onRequest(async (req, res) => {
  try {
    const docRef = admin.firestore().collection("sessions").doc("test-session");
    await docRef.set({
      user: "demoUser",
      timestamp: FieldValue.serverTimestamp(),
      message: "This is some session test data",
    });
    res.status(200).send("Session data written to Firestore!");
  } catch (error) {
    console.error("Error writing session data:", error);
    res.status(500).send("Failed to write session data");
  }
});


exports.readSessionData = functions.https.onRequest(async (req, res) => {
  try {
    const docRef = admin.firestore().collection("sessions").doc("test-session");
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).send("No session data found.");
    }

    // Return the document data as JSON
    res.status(200).json(docSnap.data());
  } catch (error) {
    console.error("Error reading session data:", error);
    res.status(500).send("Failed to read session data");
  }
});

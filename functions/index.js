/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// This function triggers when a new user signs up
exports.createUserDocument = functions.auth.user().onCreate((user) => {
    // It will create a new document in the 'Users' collection with a default profile_status 'Pending'
    return admin.firestore().collection('Users').doc(user.uid).set({
        email: user.email,
        name: user.displayName,
        profile_picture: user.photoURL,
        phone_number: phoneNumber,
        Account: 0,
        profile_status: 'Pending',
        // Add other necessary fields
    });
});






const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors')({ origin: true });

admin.initializeApp();

// This function triggers when a new user signs up
exports.createUserDocument = functions.auth.user().onCreate((user) => {
    // It will create a new document in the 'Users' collection with a default profile_status 'Pending'
    return admin.firestore().collection('Users').doc(user.uid).set({
        email: user.email,
        name: user.displayName,
        profile_picture: user.photoURL,
        phone_number: user.phoneNumber,
        Account: 0,
        profile_status: 'Pending',
        // Add other necessary fields
    });
});

// Proxy function to handle CORS and make requests to an external API
// Get Api User
exports.proxyApi = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const apiUrl = 'https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/795f455d-1286-41f3-b8b7-da7d8bc35e3d';
            
            const apiResponse = await axios.get(apiUrl, {
                headers: {
                    'Ocp-Apim-Subscription-Key': 'f4f2da18c0db4033b897644dc8ef1fec',
                    'X-Target-Environment': 'sandbox'
                }
            });
            
            response.send(apiResponse.data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    });
});


// Generate UUIDV4 for 
exports.proxyApi1 = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const apiUrl = 'https://www.uuidgenerator.net/api/version4';
            
            // Making a GET request to the API
            const apiResponse = await axios.get(apiUrl);
            
            // Sending the text response directly
            response.send(apiResponse.data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    });
});


// some reqest
exports.proxyApi2 = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const apiUrl = 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/39ec2fca-713b-4c92-adc2-50d64676a33a';
            const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSMjU2In0.eyJjbGllbnRJZCI6Ijc5NWY0NTVkLTEyODYtNDFmMy1iOGI3LWRhN2Q4YmMzNWUzZCIsImV4cGlyZXMiOiIyMDIzLTEwLTI0VDA1OjUwOjE5LjIxOSIsInNlc3Npb25JZCI6IjY5MDRmMDEwLTA4ZTEtNDJlYS04MzM1LTYwOWYwMjFiYTlhNyJ9.VzwX7d8EvZzCdATvqRr57F2jLm3RUvM1GNpfLIQsSiU4LPdG1SBjniGiV1tLNBxnMMnn-Ax1YU8mTZyPxiGXe5PthheWnFAphp69AYGZmW5OyxvadSztH5s5_eY-1oPL6HRUUFA9Nzv-DULVFiO14ra4aU_T78mHPYGnDF2OUjkvOoN8xOyC4r5SM9SpVNyxe18bsNcdFV06ZmBE3MizvzsiL6K-GT0GCSx1vP5ZQXy9WYZAfiFbadVR9D1f0syN3Bk2iW6tqnxjkXKTWyoVbmY4_O-XENvuscyBUbeFI9wuqra735OTyllJ4Ppcdg2legHyHe98OzDW-YyYEowigw';

            const apiResponse = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`, // Replace YOUR_ACCESS_TOKEN with your actual token
                    'Ocp-Apim-Subscription-Key': 'f4f2da18c0db4033b897644dc8ef1fec',
                    'X-Target-Environment': 'sandbox'
                }
            });
            
            response.send(apiResponse.data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    });
});


// GeneRATE API token Key
exports.proxyApi3 = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const apiUrl = 'https://sandbox.momodeveloper.mtn.com/collection/token/';
            
            // Encoding username and password in base64
            const username = '795f455d-1286-41f3-b8b7-da7d8bc35e3d';
            const password = '62bf365f2e444e8b8a8bfa9da929a964';
            const base64Credentials = Buffer.from(username + ':' + password).toString('base64');
            
            const apiResponse = await axios.post(apiUrl, null, {
                headers: {
                    'Authorization': `Basic ${base64Credentials}`,
                    'Ocp-Apim-Subscription-Key': 'f4f2da18c0db4033b897644dc8ef1fec',
                    'X-Target-Environment': 'sandbox'
                }
            });
            
            response.send(apiResponse.data);
        } catch (error) {
            console.error(error); // Log the full error object
            response.status(500).send(`Internal Server Error: ${error.toString()}`);
        }
    });
});


// REQUEST TO PAY
//////////
exports.getTransaction = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const uuidResponse = await axios.get('https://us-central1-transactunity.cloudfunctions.net/proxyApi1');
            const uuid = uuidResponse.data;
            
            const apiUrl = `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay`;
            const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSMjU2In0.eyJjbGllbnRJZCI6Ijc5NWY0NTVkLTEyODYtNDFmMy1iOGI3LWRhN2Q4YmMzNWUzZCIsImV4cGlyZXMiOiIyMDIzLTEwLTI0VDA2OjU2OjE4LjExNSIsInNlc3Npb25JZCI6IjI4OWVkN2JjLWEwZWEtNGQwYS1hN2FiLWM2YTZiNmY4MmUwNSJ9.dpikss7NajjA6J9VjQqYLJKyBB9awqKVBjrT88x_-4up_IyqPyHXLe51HHCKzSKyXHOxdPTJJAZRvzlSX5f-2oF5WQH4SrqVvFUnOgRsNM67Iy1zSowEf4kOil1wDwPyZ9S0wskGB565Diy2Y95M4kcs5hgcPaazSeueQIlJbaCYrPFW-_SHhVJSW_d6U0JdiOHTiELaySs7a59IIPWeKZAQC5GkiK9Jp26CEslwx2p1iCkUd2CGY20qbofWWA0AltU4lHBYRqDz3bZBz9DeCFEjV_M3Pw6Ipy4JLb30K8OalOz0aH6ql840EkMShqG3-WbowQhUgMl52kaVJ_bqiw';

            const headers = {
                'Authorization': `Bearer ${TOKEN}`,
                'Ocp-Apim-Subscription-Key': 'f4f2da18c0db4033b897644dc8ef1fec',
                'X-Reference-Id': uuid,
                'X-Target-Environment': 'sandbox'
            };
            // ... (your other codes like TOKEN and headers here)
            
            const body = { // You can name this constant as 'body' if it makes it clearer
                "amount": "5.0",
                "currency": "EUR",
                "externalId": "6353636",
                "payer": {
                    "partyIdType": "MSISDN",
                    "partyId": "0248888736"
                },
                "payerMessage": "Pay for product a",
                "payeeNote": "payer note"
            };
            
            const config = { headers: headers }; // Define headers in the config object
            
            const apiResponse = await axios.post(apiUrl, body, config); // Sending 'body' as the request body
            
            response.send(apiResponse.status);
            
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            // Sending the received error status code directly
            const errorStatusCode = error.response ? error.response.status : 500;
            response.status(errorStatusCode).send(`Error: ${error.toString()}`);
        }
    });
});

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
        accountBalance: 0,
        money_in:0,
        money_out:0,
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


// some reqest, pay status
exports.proxyApi2 = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const uuid = request.body.uuid; // Extracting uuid from the request body

            if (!uuid) {
                response.status(400).send('Missing UUID in request body.');
                return;
            }

            const apiUrl = `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/${uuid}`;

            const tokenResponse = await axios.get('https://us-central1-transactunity.cloudfunctions.net/requestAccessToken');
            const TOKEN = tokenResponse.data.access_token;

            const apiResponse = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
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



// Generate API Collection token Key
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

// request access token collections
exports.requestAccessToken = functions.https.onRequest((request, response) => {
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

            // Respond with the access token
            response.json({ access_token: apiResponse.data.access_token });
            
        } catch (error) {
            console.error(error); // Log the full error object
            response.status(500).send(`Internal Server Error: ${error.toString()}`);
        }
    });
});


//request access token disburemnts
exports.proxyApi7 = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const apiUrl = 'https://sandbox.momodeveloper.mtn.com/disbursement/token/';
            
            // Encoding username and password in base64
            const username = 'b65b1e35-8283-4408-ba0a-1f7f409cfece';
            const password = 'f32459a554dc487bba7442e43fd6679d';
            const base64Credentials = Buffer.from(username + ':' + password).toString('base64');
            
            const apiResponse = await axios.post(apiUrl, null, {
                headers: {
                    'Authorization': `Basic ${base64Credentials}`,
                    'Ocp-Apim-Subscription-Key': '44c5387ae9d24392bc4c1a10012d98e7',
                    'X-Target-Environment': 'sandbox'
                }
            });
            
            response.json({ access_token: apiResponse.data.access_token });
        } catch (error) {
            console.error(error); // Log the full error object
            response.status(500).send(`Internal Server Error: ${error.toString()}`);
        }
    });
});

// REQUEST TO PAY
exports.getTransaction = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const uuidResponse = await axios.get('https://us-central1-transactunity.cloudfunctions.net/proxyApi1');
            const uuid = uuidResponse.data;
            
            const apiUrl = `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay`;
            const tokenResponse = await axios.get('https://us-central1-transactunity.cloudfunctions.net/requestAccessToken');
            const TOKEN = tokenResponse.data.access_token;
            //const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSMjU2In0.eyJjbGllbnRJZCI6Ijc5NWY0NTVkLTEyODYtNDFmMy1iOGI3LWRhN2Q4YmMzNWUzZCIsImV4cGlyZXMiOiIyMDIzLTEwLTI0VDA2OjU2OjE4LjExNSIsInNlc3Npb25JZCI6IjI4OWVkN2JjLWEwZWEtNGQwYS1hN2FiLWM2YTZiNmY4MmUwNSJ9.dpikss7NajjA6J9VjQqYLJKyBB9awqKVBjrT88x_-4up_IyqPyHXLe51HHCKzSKyXHOxdPTJJAZRvzlSX5f-2oF5WQH4SrqVvFUnOgRsNM67Iy1zSowEf4kOil1wDwPyZ9S0wskGB565Diy2Y95M4kcs5hgcPaazSeueQIlJbaCYrPFW-_SHhVJSW_d6U0JdiOHTiELaySs7a59IIPWeKZAQC5GkiK9Jp26CEslwx2p1iCkUd2CGY20qbofWWA0AltU4lHBYRqDz3bZBz9DeCFEjV_M3Pw6Ipy4JLb30K8OalOz0aH6ql840EkMShqG3-WbowQhUgMl52kaVJ_bqiw';

            // Extracting values from the request
            // Extracting values from the request
            let { amount, payerId, payerNote } = request.body;

            // Sanitize and validate the amount
            amount = Number(amount); // Ensure the amount is a number

            const headers = {
                'Authorization': `Bearer ${TOKEN}`,
                'Ocp-Apim-Subscription-Key': 'f4f2da18c0db4033b897644dc8ef1fec',
                'X-Reference-Id': uuid,
                'X-Target-Environment': 'sandbox'
            };
            // ... (your other codes like TOKEN and headers here)
            
            const body = { // You can name this constant as 'body' if it makes it clearer
                "amount": amount,
                "currency": "EUR",
                "externalId": uuid,
                "payer": {
                    "partyIdType": "MSISDN",
                    "partyId": payerId
                },
                "payerMessage": "Pay for product a",
                "payeeNote": "payer note"
            };
            
            const config = { headers: headers }; // Define headers in the config object
            
            const apiResponse = await axios.post(apiUrl, body, config); // Sending 'body' as the request body
            
            response.send({
                status: apiResponse.status,
                message: apiResponse.statusText,
                uuid: uuid // replace "your_uuid_here" with the actual uuid
            });
            
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            // Sending the received error status code directly
            const errorStatusCode = error.response ? error.response.status : 500;
            response.status(errorStatusCode).send(`Error: ${error.toString()}`);
        }
    });
});


// Disbursement Token Request
exports.proxyApi5 = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const apiUrl = 'https://sandbox.momodeveloper.mtn.com/disbursement/token/';
            
            // Encoding username and password in base64
            const username = 'b65b1e35-8283-4408-ba0a-1f7f409cfece';
            const password = 'f32459a554dc487bba7442e43fd6679d';
            const base64Credentials = Buffer.from(username + ':' + password).toString('base64');
            
            const apiResponse = await axios.post(apiUrl, null, {
                headers: {
                    'Authorization': `Basic ${base64Credentials}`,
                    'Ocp-Apim-Subscription-Key': '44c5387ae9d24392bc4c1a10012d98e7',
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


// Check Deposit Status
exports.proxyApi9 = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const uuid = request.body.uuid; // Extracting uuid from the request body

            if (!uuid) {
                response.status(400).send('Missing UUID in request body.');
                return;
            }

            const apiUrl = `https://sandbox.momodeveloper.mtn.com/disbursement/v1_0/deposit/${uuid}`;

            const tokenResponse = await axios.get('https://us-central1-transactunity.cloudfunctions.net/proxyApi7');
            const TOKEN = tokenResponse.data.access_token;

            const apiResponse = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Ocp-Apim-Subscription-Key': '44c5387ae9d24392bc4c1a10012d98e7',
                    'X-Target-Environment': 'sandbox'
                }
            });
            
            response.send(apiResponse.data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    });
});


// DEPOSIT MOMO
exports.depositTransaction = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        try {
            const uuidResponse = await axios.get('https://us-central1-transactunity.cloudfunctions.net/proxyApi1');
            const uuid = uuidResponse.data;
            
            const apiUrl = `https://sandbox.momodeveloper.mtn.com/disbursement/v1_0/deposit`;
            const tokenResponse = await axios.get('https://us-central1-transactunity.cloudfunctions.net/proxyApi7');
            const TOKEN = tokenResponse.data.access_token;
            //const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSMjU2In0.eyJjbGllbnRJZCI6Ijc5NWY0NTVkLTEyODYtNDFmMy1iOGI3LWRhN2Q4YmMzNWUzZCIsImV4cGlyZXMiOiIyMDIzLTEwLTI0VDA2OjU2OjE4LjExNSIsInNlc3Npb25JZCI6IjI4OWVkN2JjLWEwZWEtNGQwYS1hN2FiLWM2YTZiNmY4MmUwNSJ9.dpikss7NajjA6J9VjQqYLJKyBB9awqKVBjrT88x_-4up_IyqPyHXLe51HHCKzSKyXHOxdPTJJAZRvzlSX5f-2oF5WQH4SrqVvFUnOgRsNM67Iy1zSowEf4kOil1wDwPyZ9S0wskGB565Diy2Y95M4kcs5hgcPaazSeueQIlJbaCYrPFW-_SHhVJSW_d6U0JdiOHTiELaySs7a59IIPWeKZAQC5GkiK9Jp26CEslwx2p1iCkUd2CGY20qbofWWA0AltU4lHBYRqDz3bZBz9DeCFEjV_M3Pw6Ipy4JLb30K8OalOz0aH6ql840EkMShqG3-WbowQhUgMl52kaVJ_bqiw';

            // Extracting values from the request
            let { amount, partyId, payeeNote, transactionId } = request.body;

            // Sanitize and validate the amount
            amount = Number(amount); // Ensure the amount is a number

            const headers = {
                'Authorization': `Bearer ${TOKEN}`,
                'Ocp-Apim-Subscription-Key': '44c5387ae9d24392bc4c1a10012d98e7',
                'X-Reference-Id': transactionId,
                'X-Target-Environment': 'sandbox'
            };
            // ... (your other codes like TOKEN and headers here)
            
            const body = { // You can name this constant as 'body' if it makes it clearer
                "amount": amount,
                "currency": "EUR",
                "externalId": transactionId,
                "payee": {
                    "partyIdType": "MSISDN",
                    "partyId": partyId
                },
                "payerMessage": "Pay for product a",
                "payeeNote": payeeNote
            };
            
            const config = { headers: headers }; // Define headers in the config object
            
            const apiResponse = await axios.post(apiUrl, body, config); // Sending 'body' as the request body
            
            response.send({
                status: apiResponse.status,
                message: apiResponse.statusText,
                uuid: uuid // replace "your_uuid_here" with the actual uuid
            });
            
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            // Sending the received error status code directly
            const errorStatusCode = error.response ? error.response.status : 500;
            response.status(errorStatusCode).send(`Error: ${error.toString()}`);
        }
    });
});
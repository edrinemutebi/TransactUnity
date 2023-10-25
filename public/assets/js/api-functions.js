

    function fetchTransaction() {
        const btnFetch = document.getElementById('fetch_it');

        btnFetch.disabled = true;

        // blur form while processing top up payment
        var divToBlur = document.getElementById('addmoneyform');
        divToBlur.classList.add('blur-effect');
    
        // Getting values from the input fields (assuming you have input fields to get these values)
        const amount = document.getElementById('amount').value;
        const payerId = document.getElementById('payer_id').value;
        const payerNote = 'transact unity api sandbox test';

        fetch('https://us-central1-transactunity.cloudfunctions.net/getTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount,
                payerId: payerId,
                payerNote: payerNote
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 202) {
                // Extract the response and uuid
                const responseInfo = data.text; // Assuming response data is under key "response"
                const uuid = data.uuid; // Assuming uuid is under key "uuid"

                
    
                // Do something with the extracted information if necessary
                console.log(`Response: ${responseInfo}, UUID: ${uuid}`);

                        // Call the function to check the transaction status and handle Firestore operations
                checkTransactionStatus(uuid);
            }

            document.getElementById('result').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').textContent = error.message;
        })
        .finally(() => {
            // Re-enable the button
            btnFetch.disabled = false;

            // Remove the blur class when the function is done
            divToBlur.classList.remove('blur-effect');
        });
    }

    // Attaching the fetchTransaction function to the button click event
    // document.getElementById('fetch_it').addEventListener('click', fetchTransaction);


// Initialize Firebase
// firebase.initializeApp(yourFirebaseConfig);

function checkTransactionStatus(uuid) {
    if (uuid) {
       
        fetch(`https://us-central1-transactunity.cloudfunctions.net/proxyApi2`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uuid: uuid
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
           
                //
                if (data.status === "SUCCESSFUL") {
                    updateFirestore(data);
                } else {
                    console.log("Transaction not successful: ", data.status);
                }

                // Extract the response and uuid
                const responseInfo = data.status; // Assuming response data is under key "response"
                console.log(`Response: ${data.status}`);
               

                // Do something with the extracted information if necessary
                console.log(`Response: ${responseInfo}`);
                document.getElementById('result').innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').textContent += error.message;
        })
              
    }
}

// Function to update Firestore
function updateFirestore(data) {
    const db = firebase.firestore(); // Assuming you have already initialized firebase

    // Structure the data
    const transactionData = {
        financialTransactionId: data.financialTransactionId,
        amount: data.amount,
        partyId: data.payer.partyId,
        payeeNote: data.payeeNote,
        transactionDate: new Date(),
        transactionType: "Added Money"
    };

    // Update Firestore
    let userId = sessionStorage.getItem('userUid');
    db.collection('Users').doc(userId).collection('transactions').add(transactionData)
        .then(() => {
            console.log("Transaction successfully written!");
            alert("Transaction Completed successfully");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

    // Update user balance
    const userRef = db.collection('Users').doc(userId);
    userRef.update({
        accountBalance: firebase.firestore.FieldValue.increment(data.amount),
        money_in: data.amount
    });
}

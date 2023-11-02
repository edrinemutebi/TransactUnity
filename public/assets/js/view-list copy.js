document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const paymentListsContainer = document.getElementById('paymentLists');
            const listId = sessionStorage.getItem('docRef');

            if (listId) {
                const paymentListRef = firebase.firestore().collection('payment_lists').doc(listId);
                paymentListRef.get()
                    .then(doc => {
                        if (doc.exists) {
                            const paymentListData = doc.data();

                            // Code for displaying payment details in a table
                            const paymentListsContainer = document.getElementById('paymentLists');
            
                            let itemsTable = `<table>
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Phone No.</th>
                                                        <th>Amount</th>
                                                        <th>Reason</th>
                                                        <th>Payment Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>`;
            
                            paymentListData.paymentList.forEach(item => {
                                itemsTable += `<tr>
                                                <td>${item.recipientName}</td>
                                                <td>${item.recipientNumber}</td>
                                                 <td>${item.amount}</td>
                                                 <td>${item.reason}</td>
                                                 <td>${item.status}</td>
                                               </tr>`;
                            });
            
                            itemsTable += `</tbody></table>`;
            
                            const paymentListDiv = `
                                <div class="payment-list">
                                    <h2>${paymentListData.listName}</h2>
                                    ${itemsTable}
                                    <br>
                                    <button id="pay-now" class="make-payment">Make Payment</button>
                                    <button class="schedule-payment">Schedule Payment</button>
                                </div>
                            `;
            
                            paymentListsContainer.innerHTML = paymentListDiv;
                            // ...

                            const makePaymentButton = document.getElementById('pay-now')
                            makePaymentButton.addEventListener('click', function() {
                                paymentListData.paymentList.forEach(item => {
                                    postTransaction(item.amount,item.recipientNumber,item.reason,item.itemId)
                                });
                            });                            
                        } else {
                            console.log("No such document!");
                        }
                    })
                    .catch(error => {
                        console.error("Error getting document:", error);
                    });
            }
        } else {
            console.log('No user is signed in');
            window.location.href = "index.html";
        }
    });
});


function postTransaction(amount,phone,payeeNote,transactionId) {
    console.log(amount);
    console.log(phone);
    console.log(payeeNote);

    fetch('https://us-central1-transactunity.cloudfunctions.net/depositTransaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: amount,
            partyId: phone,
            payeeNote: payeeNote,
            transactionId: transactionId
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
            const responseInfo = data.status; // Assuming response data is under key "response"
            const uuid = data.uuid; // Assuming uuid is under key "uuid"

            // Do something with the extracted information if necessary
            console.log(`Response: ${responseInfo}, UUID-: ${transactionId}`);

            // Call the function to check the transaction status and handle Firestore operations
            checkDepositStatus(transactionId);
        }
      
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        // // Re-enable the button
        // btnFetch.disabled = false;
        // // Remove the blur class when the function is done
        // divToBlur.classList.remove('blur-effect');
    });
}

function checkDepositStatus(transactionId) {
    if (transactionId) {
       
        fetch(`https://us-central1-transactunity.cloudfunctions.net/proxyApi9`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uuid: transactionId
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
                    //updateFirestore(data);
                    const docRefId = sessionStorage.getItem('docRef');
                    updateFirestore(data);
                    console.log("Deposit Transaction Successful: ", data.payee);
                } else {
                    console.log("Deposit Transaction not successful: ", data.status);
                }

                // Extract the response and uuid
                // const responseInfo = data.status; // Assuming response data is under key "response"
                // console.log(`Response: ${data.status}`);
               

                // Do something with the extracted information if necessary
                // console.log(`Response: ${responseInfo}`);
                // document.getElementById('result').innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        })
        .catch(error => {
            console.error('Error:', error);
            //document.getElementById('result').textContent += error.message;
        })
              
    }
}




function updateFirestore(data) {
    const db = firebase.firestore(); // Assuming you have already initialized firebase
    const docId = sessionStorage.getItem('docRef');
  
    const docRef = db.collection('payment_lists').doc(docId)

    docRef.get().then((docSnapshot) => {
        if (docSnapshot.exists) {
            const paymentList = docSnapshot.data().paymentList;
    
            // Creating a new updated list
            console.log(paymentList)
            console.log("---------------------")
            const updatedPaymentList = paymentList.map(record => {
                if (record.itemId === data.itemId) {
                    console.log(record);
                    return {
                        ...record,
                        status: 'Success' // Updating the status of the matching record
                    };
                }
                return record; // Returning unmodified records
            });
    
            // Updating the document with the new payment list
            console.log("////////////////")
            console.log(updatedPaymentList);
            docRef.update({
                paymentList: updatedPaymentList
            }).then(() => {
                console.log('Document successfully updated!');
            });
        } else {
            console.log('No such document!');
        }
    }).catch((error) => {
        console.error("Error: ", error);
    });
    
    
    
    //const paymentList = docSnapshot.data().paymentList || [];

    // Directly modifying the status in the paymentList array

    // Update user balance
    
}
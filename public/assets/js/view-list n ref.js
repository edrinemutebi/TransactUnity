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
                            let itemsTable = `<table class="items-center w-full mb-0 align-top border-gray-200 text-slate-500">
                                                <thead class="align-bottom">
                                                    <tr>
                                                    <th class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Receiver Name</th>
                                                    <th class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Phone No.</th>
                                                    <th class="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Amount</th>
                                                    <th class="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Reason</th>
                                                    </tr>
                                                </thead>
                                                <tbody>`;
                            
                            for (let itemId in paymentListData.paymentList) {
                                let item = paymentListData.paymentList[itemId];
                                itemsTable += `<tr>
                                                <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                                  <div class="flex px-2 py-1">
                                                    <div>
                                                      <img src="../assets/img/illustrations/rocket-white.png" class="inline-flex items-center justify-center mr-4 text-sm text-white transition-all duration-200 ease-soft-in-out h-9 w-9 rounded-xl" alt="user1" />
                                                    </div>
                                                    <div class="flex flex-col justify-center">
                                                      <h6 class="mb-0 text-sm leading-normal">${item.recipientName}</h6>
                                                    </div>
                                                  </div>
                                                </td>
                                                <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                                  <p class="mb-0 text-xs font-semibold leading-tight">${item.recipientNumber}</p>
                                                </td>
                                                <td class="p-2 text-sm leading-normal text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                                  <span class="bg-gradient-to-tl from-green-600 to-lime-400 px-2.5 text-xs rounded-1.8 py-1.4 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">${item.amount}</span>
                                                </td>
                                                <td class="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                                  <span class="text-xs font-semibold leading-tight text-slate-400">${item.reason}</span>
                                                </td>
                                                <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent" >
                                                  <span id="${item.itemId}" class="bg-gradient-to-tl from-slate-600 to-slate-300 px-2.5 text-xs rounded-1.8 py-1.4 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">${item.status}</span>
                                                </td>
                                              </tr>`;
                            }
                        
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
                        
                            const makePaymentButton = document.getElementById('pay-now');
                            makePaymentButton.addEventListener('click', function() {
                                for (let itemId in paymentListData.paymentList) {
                                    let item = paymentListData.paymentList[itemId];
                                    postTransaction(item.amount, item.recipientNumber, item.reason, item.itemId);
                                }
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
    console.log(transactionId);

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
        //window.location.reload();
        console.log("all payment processed....")
       
        document.getElementById("alert-1").textContent = "Bulk Transaction Completed"
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
                    //console.log(data.externalId)
                    // const uuid = sessionStorage.getItem('docRef');
                    updateFirestore(data);
                    console.log(data.externalId)
                   // console.log("Deposit Transaction Successful: ", data.payee);
                } else {
                    console.log("Deposit Transaction not successful: ", data.status);
                    document.getElementById(data.externalId).textContent = "Failed"
                    document.getElementById(data.externalId).classList.remove("from-slate-600", "to-slate-300");
                    document.getElementById(data.externalId).classList.add("from-red-500", "to-red-700"); 
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
    console.log("my data itemid - " + data.externalId);
  
    const docId = sessionStorage.getItem('docRef');
    const docRef = db.collection('payment_lists').doc(docId);
    //console.log(data.itemId)

    docRef.get().then((docSnapshot) => {
        if (docSnapshot.exists) {
            const paymentList = docSnapshot.data().paymentList;
            let updatedPaymentList = {...paymentList}; // Creating a shallow copy of paymentList object
            console.log(updatedPaymentList)
            for (let key in updatedPaymentList) {
                if (updatedPaymentList[key].itemId === data.externalId) {
                    //console.log(updatedPaymentList[key]);
                    updatedPaymentList[key] = {
                        ...updatedPaymentList[key],
                        status: 'Success' // Updating the status of the matching record
                    };
                    console.log(updatedPaymentList[key]);
                    document.getElementById(data.externalId).textContent = "Success"
                    document.getElementById(data.externalId).classList.remove("from-slate-600", "to-slate-300");
                    document.getElementById(data.externalId).classList.add("from-green-600", "to-lime-400");
                }
            }
    
            // Updating the document with the new payment list
            //console.log("////////////////");
            //console.log(updatedPaymentList);
            db.collection('payment_lists').doc(docId).set({
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
}



// Initialize the balance variable
let balance = 0;

document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // Retrieve the balance from Firestore
            const uuid = user.uid; // Assuming the user's UUID is available
            getBalanceFromFirestore(uuid).then((initialBalance) => {
                balance = initialBalance || 0; // Set the initial balance (or 0 if not found)
                displayAllPaymentList();
            });
        } else {
            console.log('No user is signed in');
            window.location.href = "index.html";
        }
    });
});

// Function to retrieve balance from Firestore
function getBalanceFromFirestore(uuid) {
    const db = firebase.firestore();
    const userRef = db.collection('Users').doc(uuid);

    return userRef.get()
        .then((doc) => {
            if (doc.exists) {
                return doc.data().accountBalance || 0;
            } else {
                return 0; // Set a default balance if user document doesn't exist
            }
        })
        .catch(error => {
            console.error("Error getting balance from Firestore:", error);
            return 0; // Set a default balance on error
        });
}

function displayAllPaymentList() {
    const user = firebase.auth().currentUser;
    const paymentListsContainer = document.getElementById('paymentLists');
    // Remove the listId variable since we want all documents in the collection

    const paymentListRef = firebase.firestore().collection('payment_lists').doc(user.uid).collection('lists');

    paymentListRef.get()
        .then((querySnapshot) => {
            // Initialize an empty string to accumulate payment list divs
            let paymentListsHTML = '';

            querySnapshot.forEach((doc) => {
                const paymentListData = doc.data();
                const paymentListDiv = createPaymentListDiv(paymentListData);
                paymentListsHTML += paymentListDiv;
            });

            // Update the container's HTML with all the payment list divs
            paymentListsContainer.innerHTML = paymentListsHTML;
        })
        .catch(error => {
            console.error("Error getting payment lists:", error);
        });
}

function calculateTotalAmount(paymentList) {
    let total = '0'; // Initialize total as a string
    for (let itemId in paymentList) {
        total = (parseFloat(total) + parseFloat(paymentList[itemId].amount)).toString(); // Convert to numbers and back to a string
    }
    return total;
}

function setcolor(itemStatus)
{
    let color = ""

}
//
function createPaymentListDiv(paymentListData) {
    var storedListName = sessionStorage.getItem('listNameRef');
    
    let itemsTable = `
    <div>
    <div class="flex-none w-full max-w-full px-3">
      <div class="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
        <div class="p-6 pb-0 mb-0 bg-white border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
          <h6>Please Uploaded Excel Pay List&nbsp;&nbsp;-&nbsp;&nbsp;<span id="listTitle" ></span></h6>
        </div>
        <div class="flex-auto px-0 pt-0 pb-2">
          <div class="p-0 overflow-x-auto">
            <table id="itemList" class="items-center w-full mb-0 align-top border-gray-200 text-slate-500">
            <thead class="align-bottom">
            <tr>
                <th class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Receiver Name</th>
                <th class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Phone No.</th>
                <th class="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Amount</th>
                <th class="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Reason</th>
            </tr>
            </thead>
    `; // Create an empty table
    // Add table header and rows using a loop

    for (let itemId in paymentListData.paymentList) {

        let item = paymentListData.paymentList[itemId]

        if (item.status === "Success") {
            color = "bg-gradient-to-tl from-green-600 to-lime-400";
        } else if (item.status === "Failed") {
            color = "bg-gradient-to-tl from-red-500 to-red-700";
        } else {
            color = "bg-gradient-to-tl from-slate-600 to-slate-300";
        }
             
        const newRow = `
        <tr>
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
                <p class="mb-0 text-xs font-semibold leading-tight">${item.amount}</p>
            </td>
            <td class="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                <span class="text-xs font-semibold leading-tight text-slate-400">${item.reason}</span>
            </td>
            <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                <span id="${item.itemId}" class="${color} px-2.5 text-xs rounded-1.8 py-1.4 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">${item.status}</span>
            </td>
        </tr>
    `;
    itemsTable +=  newRow;
    }

    itemsTable += '</table>'; // Close the table

    return `
                <div class="payment-list">
                ${itemsTable}
                <br>
                </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    `;
}

function makePayments(paymentList) {
    for (let itemId in paymentList) {
        const item = paymentList[itemId];
        postTransaction(item.amount, item.recipientNumber, item.reason, item.itemId);
    }
}

// Rest of your code (postTransaction, checkDepositStatus, updateFirestore) remains the same.
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
            deductFromBalance(amount);
            checkDepositStatus(transactionId,amount,phone);

        }
      
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        //window.location.reload();
        console.log("all payment processed....")
       
        // document.getElementById("alert-1").textContent = "Bulk Transaction Completed"
        // // Re-enable the button
        // btnFetch.disabled = false;
        // // Remove the blur class when the function is done
        // divToBlur.classList.remove('blur-effect');
    });
}

function checkDepositStatus(transactionId, amount,phone) {
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

                    // Get a reference to the "alert-1" element using its id
                    const alertElement = document.getElementById("alert-1");

                    // Hide the element after a 3-second delay
                    setTimeout(function () {
                        alertElement.style.display = "none";
                    }, 5000); // 3000 milliseconds (3 seconds)

                    // Show the element by setting its style to display: block
                    alertElement.style.display = "block";

                    // Add text to the element by setting its innerHTML
                    alertElement.innerHTML = 'Deposited - ' + amount + ' to ' + phone;

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
    const user = firebase.auth().currentUser;
    const db = firebase.firestore(); // Assuming you have already initialized firebase
    console.log("my data itemid - " + data.externalId);
  
    const docId = sessionStorage.getItem('docRef');
    //const docRef = db.collection('payment_lists').doc(docId);
    const docRef = db.collection('payment_lists').doc(user.uid).collection('lists').doc(docId);
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
            db.collection('payment_lists').doc(user.uid).collection('lists').doc(docId).set({
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

// Function to deduct the transaction amount from the balance
function deductFromBalance(amount) {
    // Deduct the amount from the balance
    balance -= amount;

    // Update the balance in Firestore
    const uuid = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    const userRef = db.collection('Users').doc(uuid);

    userRef.update({ accountBalance: balance })
        .then(() => {
            console.log('Balance updated in Firestore');
        })
        .catch(error => {
            console.error('Error updating balance in Firestore:', error);
        });
}


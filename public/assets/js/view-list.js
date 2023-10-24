document.addEventListener('DOMContentLoaded', function() {  
    // Auth state observer
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
                            const paymentListsContainer = document.getElementById('paymentLists');
            
                            let itemsTable = `<table>
                                                <thead>
                                                    <tr>
                                                        <th>Item Name</th>
                                                        <th>Description</th>
                                                        <th>Amount</th>
                                                        <th>Recipient Name</th>
                                                        <th>Recipient Number</th>
                                                    </tr>
                                                </thead>
                                                <tbody>`;
            
                            paymentListData.items.forEach(item => {
                                itemsTable += `<tr>
                                                 <td>${item.itemName}</td>
                                                 <td>${item.description}</td>
                                                 <td>${item.amount}</td>
                                                 <td>${item.recipientName}</td>
                                                 <td>${item.recipientNumber}</td>
                                               </tr>`;
                            });
            
                            itemsTable += `</tbody></table>`;
            
                            const paymentListDiv = `
                                <div class="payment-list">
                                    <h2>${paymentListData.listName}</h2>
                                    ${itemsTable}
                                    <br>
                                    <button class="make-payment">Make Payment</button>
                                    <button class="schedule-payment">Schedule Payment</button>
                                </div>
                            `;
            
                            paymentListsContainer.innerHTML = paymentListDiv;
                        } else {
                            console.log("No such document!");
                        }
                    })
                    .catch(error => {
                        console.error("Error getting document:", error);
                    });
            }
            

            console.log('User is signed in', user.email);
            console.log('User is signed in', user.uid);

        } else {
            console.log('No user is signed in');
            window.location.href = "index.html";
        }
    });
    
});
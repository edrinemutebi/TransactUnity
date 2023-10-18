function createList() {
    const listName = document.getElementById('listName').value;
    if (listName.trim() === "") {
        alert("Please enter a payment list name");
        return;
    }
    document.getElementById('listTitle').textContent = listName;
    document.getElementById('itemForm').style.display = 'block';
}

function addItem() {
    const itemName = document.getElementById('itemName').value;
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const recipientName = document.getElementById('recipientName').value;
    const recipientNumber = document.getElementById('recipientNumber').value;

    if (itemName.trim() === "" || description.trim() === "" || amount.trim() === "" ||
        recipientName.trim() === "" || recipientNumber.trim() === "") {
        alert("Please fill out all fields");
        return;
    }

    const itemList = document.getElementById('itemList').getElementsByTagName('tbody')[0];
    const newRow = itemList.insertRow(itemList.rows.length);

    newRow.insertCell(0).innerHTML = itemName;
    newRow.insertCell(1).innerHTML = description;
    newRow.insertCell(2).innerHTML = amount;
    newRow.insertCell(3).innerHTML = recipientName;
    newRow.insertCell(4).innerHTML = recipientNumber;

    // Clear the inputs
    document.getElementById('itemName').value = "";
    document.getElementById('description').value = "";
    document.getElementById('amount').value = "";
    document.getElementById('recipientName').value = "";
    document.getElementById('recipientNumber').value = "";
}


//var db = firebase.firestore(); // Make sure Firebase is correctly initialized

function saveList() {
    const user = firebase.auth().currentUser;
    const userId = (user.uid); // TODO: Replace with actual user ID
    const category = "general"
    //const category = document.getElementById('category').value; // Assuming you have a select input with id="category"
    const listName = document.getElementById('listName').value;
    const table = document.getElementById('itemList').getElementsByTagName('tbody')[0];
    const items = [];

    for (let row of table.rows) {
        let item = {
            itemName: row.cells[0].innerHTML,
            description: row.cells[1].innerHTML,
            amount: row.cells[2].innerHTML,
            recipientName: row.cells[3].innerHTML,
            recipientNumber: row.cells[4].innerHTML,
        };
        items.push(item);
    }

    firebase.firestore().collection('payment_lists').add({
        userId,
        category,
        listName,
        items
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        alert("The payment list has been saved!");
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}



document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signOutButton').addEventListener('click', signOut);
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const userPhotoElement = document.getElementById('userPhoto');
    const signOutButton = document.getElementById('signOutButton');
    const loadEl = document.querySelector('#load');
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.firestore().doc('/foo/bar').get().then(() => { });
    // firebase.functions().httpsCallable('yourFunction')().then(() => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    // firebase.analytics(); // call to activate
    // firebase.analytics().logEvent('tutorial_completed');
    // firebase.performance(); // call to activate
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥


    function signOut() {
        firebase.auth().signOut().then(() => {
            window.location.href = 'index.html'; // Redirect to sign-in
        }).catch((error) => {
            console.error(error);
        });
    }

    // Auth state observer
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const firstName = user.displayName.split(' ')[0];

            // Update the dashboard with the user's first name
            //document.getElementById('userName').textContent = firstName;
            //document.getElementById('userName').textContent = user.displayName;
            //document.getElementById('userEmail').textContent = user.email;
            //document.getElementById('userPhoto').src = user.photoURL;
            console.log('User is signed in', user);
            console.log('User is signed in', user.displayName);
            console.log('User is signed in', user.email);
            ///////////////////////
            const userRef = firebase.firestore().collection('Users').doc(user.uid);
            userRef.get()
                .then((doc) => {
                    if (doc.exists) {
                        const accountBalance = doc.data().accountBalance;
                        const companyName = doc.data().companyName;
                        const accountBalanceElement = document.getElementById('account-balance');
                        const companyNameElement = document.getElementById('company-name');
                        //accountBalanceElement.innerText = `${accountBalance}`;
                        companyNameElement.innerText = `${companyName}`;
                    } else {
                        console.log('User balance not found');
                    }
                })
                .catch((error) => {
                    console.error('Error checking profile status', error);
                });
            /////////////////////
        } else {
        console.log('No user is signed in');
        window.location.href = "index.html";
        }
    });
    
}); 

function loadPaymentLists() {
    const paymentListsContainer = document.getElementById('paymentLists');

    // Fetching the payment lists from Firestore
   // const user = firebase.auth().currentUser;
    const user = firebase.auth().currentUser;
    if (user) {
        const userId = user.uid;

        firebase.firestore().collection('payment_lists')
            .where('userId', '==', userId)
            .get()
            .then((querySnapshot) => {
                paymentListsContainer.innerHTML = ''; // Clear the container before populating
                querySnapshot.forEach((doc) => {
                    const paymentListData = doc.data();
                    const paymentListDiv = `
                        <div class="payment-list">
                            <h2>${paymentListData.listName}</h2>
                            <button class="make-payment">Make Payment</button>
                            <button class="schedule-payment">Schedule Payment</button>
                        </div>
                    `;
                    paymentListsContainer.innerHTML += paymentListDiv;
                });
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
            });
    } else {
        paymentListsContainer.innerHTML = '<p>You need to sign in to see your payment lists.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadPaymentLists); // Load the payment lists when the document is ready


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
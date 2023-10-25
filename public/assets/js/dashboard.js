
document.addEventListener('DOMContentLoaded', function() {
    const userNameElement = document.getElementById('userName');
    const accountBalanceElement = document.getElementById('account-balance');

    function signOut() {
        firebase.auth().signOut().then(() => {
            window.location.href = 'sign-in.html'; // Redirect to sign-in
        }).catch((error) => {
            console.error(error);
        });
    }

    document.getElementById('signOutLink').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default action (navigation)
        signOut(); // Call your signOut function
    });
    

    // Auth state observer
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const firstName = user.displayName.split(' ')[0];
            const fullName = user.displayName

            sessionStorage.setItem('userName', user.displayName);
            sessionStorage.setItem('userEmail', user.email);
            sessionStorage.setItem('userUid', user.uid);

            // Update the dashboard with the user's first name
            let userName = sessionStorage.getItem('userName');
            document.getElementById('userName').innerText = userName;
            console.log('User is signed in', user);
            console.log('User is signed in', user.displayName);
            console.log('User is signed in', user.email);

            const userRef = firebase.firestore().collection('Users').doc(user.uid);
            userRef.get()
                .then((doc) => {
                    if (doc.exists) {
                        const accountBalance = doc.data().accountBalance;
                        //const companyName = doc.data().companyName;
                        accountBalanceElement.innerText = `${accountBalance}`;
                    } else {
                        console.log('User balance not found');
                    }
                })
                .catch((error) => {
                    console.error('Error checking profile status', error);
                });
            
            function listenForBalanceUpdates(userId) {
                //const userRef = db.collection('Users').doc(userId);
                
                userRef.onSnapshot((doc) => {
                    if (doc.exists) {
                    const balance = doc.data().accountBalance;
                    const money_in = doc.data().money_in;
                    const money_out = doc.data().money_out;
                    updateUI(balance,money_in,money_out);
                    } else {
                    console.error("No such document!");
                    }
                }, (error) => {
                    console.error("Error getting document:", error);
                });
            }
        
            function updateUI(balance,money_in,money_out) {
                const balanceElement = document.getElementById('account-balance');
                const money_inElement = document.getElementById('money-in');
                const money_outElement = document.getElementById('money-out');
                balanceElement.textContent = balance;
                money_inElement.textContent = money_in;
                money_outElement.textContent = money_out;
            }

            listenForBalanceUpdates(user.uid);
            

        } else {
        console.log('No user is signed in');
        window.location.href = "sign-in.html";
        }
    });
}); 

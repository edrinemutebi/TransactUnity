
document.addEventListener('DOMContentLoaded', function() {
    const userNameElement = document.getElementById('fullName');
    const accountBalanceElement = document.getElementById('account-balance');

    function signOut() {
        firebase.auth().signOut().then(() => {
            window.location.href = 'sign-in.html'; // Redirect to sign-in
        }).catch((error) => {
            console.error(error);
        });
    }

    // Auth state observer
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const firstName = user.displayName.split(' ')[0];
            document.getElementById('fullName').textContent = user.displayName;
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('companyName').textContent = user.displayName;
            document.getElementById('userId').textContent = user.uid;
            console.log('User is signed in', user);
            console.log('User is signed in', user.displayName);
            console.log('User is signed in', user.email);

            const userRef = firebase.firestore().collection('Users').doc(user.uid);
            userRef.get()
                .then((doc) => {
                    if (doc.exists) {
                        const accountBalance = doc.data().accountBalance;
                        const companyName = doc.data().companyName;
                        accountBalanceElement.innerText = `${accountBalance}`;
                    } else {
                        console.log('User balance not found');
                    }
                })
                .catch((error) => {
                    console.error('Error checking profile status', error);
                });
        } else {
        console.log('No user is signed in');
        window.location.href = "index.html";
        }
    });
}); 

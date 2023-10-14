
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
            document.getElementById('userName').textContent = firstName;
            // document.getElementById('userName').textContent = user.displayName;
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('userPhoto').src = user.photoURL;
            console.log('User is signed in', user);
            console.log('User is signed in', user.displayName);
            console.log('User is signed in', user.email);
        } else {
        console.log('No user is signed in');
        window.location.href = "index.html";
        }
    });
}); 

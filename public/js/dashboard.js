function signOut() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'index.html'; // Redirect to sign-in
    }).catch((error) => {
        console.error(error);
    });
}

firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'index.html'; // Redirect to sign-in
    }
});

document.getElementById('signOut').addEventListener('click', signOut);

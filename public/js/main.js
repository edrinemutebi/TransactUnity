
document.addEventListener('DOMContentLoaded', function() {
  const signInWithGoogleButton = document.getElementById('signInWithGoogle'); 
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

  // Sign in with Google function
  signInWithGoogleButton.addEventListener('click', () => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleAuthProvider)
      .then((result) => {
        console.log('User signed in');
      })
      .catch((error) => {
        console.error('Error signing in', error);
      });
  });

  // Auth state observer
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log('User is signed in', user);
      window.location.href = "dashboard.html";
    } else {
      console.log('No user is signed in');
    }
  });
}); 

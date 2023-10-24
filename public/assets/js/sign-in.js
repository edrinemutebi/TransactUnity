document.addEventListener('DOMContentLoaded', function () {
  signOutUser(); // Signing out any currently signed-in user
  
  const signInWithGoogleButton = document.getElementById('signInWithGoogle');
  
  // Event listener for the Google sign-in button
  signInWithGoogleButton.addEventListener('click', signInWithGoogle);
  
  // Auth state observer
  firebase.auth().onAuthStateChanged(authStateObserver);
});

/**
* Sign out the current user
*/
function signOutUser() {
  firebase.auth().signOut().then(() => {
    console.log('User signed out');
  }).catch((error) => {
    console.error('Error signing out', error);
  });
}

/**
* Sign in with Google
*/
function signInWithGoogle() {
  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(googleAuthProvider)
      .catch((error) => {
          handleSignInError(error);
      });
}

/**
* Auth state observer callback
* @param {Object} user - The user object from Firebase Auth.
*/
function authStateObserver(user) {
  if (user) {
      console.log('User is signed in', user);
      redirectToDashboard();
  } else {
      console.log('No user is signed in');
  }
}

/**
* Redirects to the dashboard page
*/
function redirectToDashboard() {
  window.location.href = "dashboard.html";
}

/**
* Handles sign-in errors and displays a user-friendly message
* @param {Object} error - The error object.
*/
function handleSignInError(error) {
  console.error('Error signing in', error);
  alert('An error occurred while signing in. Please try again.');
}

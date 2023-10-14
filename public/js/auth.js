
// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOk71-I8exUGJi-2hrLH-XgSZCEdMQ7vo",
  authDomain: "transactunity.firebaseapp.com",
  databaseURL: "https://transactunity-default-rtdb.firebaseio.com",
  projectId: "transactunity",
  storageBucket: "transactunity.appspot.com",
  messagingSenderId: "635214873583",
  appId: "1:635214873583:web:126755531eb4335447ec1a",
  measurementId: "G-FTW1C4MPCS"
};

firebase.initializeApp(firebaseConfig);

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
          window.location.href = 'dashboard.html'; // Redirect to dashboard
      })
      .catch((error) => {
          console.error(error);
      });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
      window.location.href = 'dashboard.html'; // Redirect to dashboard
  }
});

document.getElementById('googleSignUp').addEventListener('click', signInWithGoogle);

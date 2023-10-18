document.addEventListener('DOMContentLoaded', function() {
    const companyDetailsForm = document.getElementById('company-details-form');
    
    companyDetailsForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const form = document.getElementById('company-details-form'); // Replace 'my-form' with your form's ID
      const loadingIndicator = document.getElementById('loading-indicator'); // Loading indicator element
      
      // Extract company details from the form
      const companyName = document.getElementById('company-name').value;
      const companyAddress = document.getElementById('company-address').value;
      const companyPhone = document.getElementById('company-phone').value;
      
      // Get the current user
      const user = firebase.auth().currentUser;
      
      // Check if the user is signed in and has a UID
      if (user && user.uid) {
        // Create a reference to the Firestore collection where you want to store company details
        const userDocRef = firebase.firestore().collection('Users').doc(user.uid);

        /// const form = document.getElementById('my-form'); // Replace 'my-form' with your form's ID
        // Show the loading indicator
        loadingIndicator.style.display = 'block';

        // Apply the blur effect to the form and its contents
        form.classList.add('blurry-form');
        
        // Update the user's document with company details
        userDocRef.update({
          companyName: companyName,
          companyAddress: companyAddress,
          companyPhone: companyPhone,
          accountBalance: 0,
          profile_status: 'Active', // Assuming the user's profile is now active
        })
        .then(() => {
          console.log('Company details updated successfully.');
          // Redirect the user to the dashboard or another page as needed.
          window.location.href = "dashboard.html";
        })
        .catch((error) => {
          console.error('Error updating company details:', error);
        });
      }
    });
  });
  

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

    // Function to fetch and display transaction data
    // ... Your existing code ...

    // Function to fetch and display transaction data
    function fetchTransactionData(userUid) {
        const transactionDataElement = document.getElementById('transaction-data');
        const transactionDataRangeElement = document.getElementById('transaction-data-range');
    
        // Reference to the transactions subcollection for the user
        const transactionsRef = firebase.firestore().collection('Users').doc(userUid).collection('transactions');
    
        // Query the transactions collection (e.g., limit to the last 10 transactions) and order by transactionDate
        transactionsRef.orderBy('transactionDate', 'desc').limit(10).get()
        .then((querySnapshot) => {
            let transactionData = '';
    
            querySnapshot.forEach((doc) => {
            const data = doc.data();
            const transactionDate = data.transactionDate.toDate();

            // Calculate the start date (3 days ago) and end date (current date) for each transaction
            
            const endDate = new Date(transactionDate);
            console.log('endDate:', endDate); // Check if endDate is a valid date.
            
            const startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 10);
            console.log('startDate:', startDate); // Check if startDate is calculated correctly.
            transactionDataRangeElement.textContent = ` ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()} `;
            
            if(data.transactionType == "Added Money")
            {
                colortheme = "border-lime-500"
                textcolortheme = "text-lime-500"
                amounttext = "from-green-600 to-lime-400"
            }else{
                colortheme = "border-red-600"
                textcolortheme = "text-red-600"
                amounttext = "from-red-600 to-rose-400"
            }


            
            // You can format and display the transaction data as you need
            transactionData += `
            <li class="relative flex justify-between px-4 py-2 pl-0 mb-2 bg-white border-0 rounded-t-inherit text-inherit rounded-xl">
                <div class="flex items-center">
                <button class="leading-pro ease-soft-in text-xs bg-150 w-6.35 h-6.35 p-1.2 rounded-3.5xl tracking-tight-soft bg-x-25 mr-4 mb-0 flex cursor-pointer items-center justify-center border border-solid ${colortheme} border-transparent bg-transparent text-center align-middle font-bold uppercase ${textcolortheme} transition-all hover:opacity-75"><i class="fas fa-arrow-down text-3xs"></i></button>
                <div class="flex flex-col">
                    <h6 class="mb-1 leading-normal text-sm text-slate-700">${data.transactionType}</h6>
                    <span class="leading-tight text-xs">${transactionDate.toLocaleString()}</span>
                </div>
                </div>
                <div class="flex flex-col items-center justify-center">
                <p class="relative z-10 inline-block m-0 font-semibold leading-normal text-transparent bg-gradient-to-tl ${amounttext} text-sm bg-clip-text">${formatAmount(data.amount)}</p>
                </div>
            </li>
            `;
            });    
            // Display the transaction data in the element
            transactionDataElement.innerHTML = transactionData;
            
        })
        .catch((error) => {
            console.error('Error fetching transaction data:', error);
        });
    }
    
    function formatAmount(amount) {
        const formattedAmount = `UGX ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        return formattedAmount;
    }

    function formatUgandanAmount(amount) {
        if (amount >= 1000000) {
          const formattedAmount = (amount / 1000000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return `UGX ${formattedAmount}M`; // Format in millions
        } else if (amount >= 1000) {
          const formattedAmount = (amount / 1000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return `UGX ${formattedAmount}K`; // Format in thousands
        } else {
          const formattedAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return `UGX ${formattedAmount}`; // Format as is
        }
      }
         

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
            userName = userName.split(' ')[0];
            document.getElementById('userName').innerText = userName;
            console.log('User is signed in', user);
            console.log('User is signed in', user.displayName);
            console.log('User is signed in', user.email);

            fetchTransactionData(user.uid);

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
                balance = formatUgandanAmount(balance)
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

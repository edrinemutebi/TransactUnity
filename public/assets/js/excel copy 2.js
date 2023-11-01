const appState = {
    listName: null,
};

function handleFile() {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];

    if (file) {
        // Set the file name as the list name
        appState.listName = file.name.split('.').slice(0, -1).join('.'); // Remove the file extension
        const listName =  appState.listName
        sessionStorage.setItem('listNameRef', listName);
        
        document.getElementById('listTitle').textContent = listName;

        document.getElementById('itemForm').style.display = 'block';

        const reader = new FileReader();
        reader.onload = function (e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            const json = XLSX.utils.sheet_to_json(worksheet);

            processExcelData(json); // Function to handle processing of Excel data
        };
        reader.readAsBinaryString(file);
    }
}


function processExcelData(data) {
    const itemList = document.getElementById('itemList').getElementsByTagName('tbody')[0];

    data.forEach(item => {
        const newRow = itemList.insertRow(itemList.rows.length);

        // Assuming your Excel has columns: recipientName, recipientNumber, amount, reason
        const { recipientName, recipientNumber, amount, reason } = item;
        newRow.innerHTML = `
        <tr>
        <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
          <div class="flex px-2 py-1">
            <div>
              <img src="../assets/img/illustrations/rocket-white.png" class="inline-flex items-center justify-center mr-4 text-sm text-white transition-all duration-200 ease-soft-in-out h-9 w-9 rounded-xl" alt="user1" />
            </div>
            <div class="flex flex-col justify-center">
              <h6 class="mb-0 text-sm leading-normal">${recipientName}</h6>
            </div>
          </div>
        </td>
        <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
          <p class="mb-0 text-xs font-semibold leading-tight">${recipientNumber}</p>
        </td>
        <td class="p-2 text-sm leading-normal text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
          <span class="bg-gradient-to-tl from-green-600 to-lime-400 px-2.5 text-xs rounded-1.8 py-1.4 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">${amount}</span>
        </td>
        <td class="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
          <span class="text-xs font-semibold leading-tight text-slate-400">${reason}</span>
        </td>
        <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
          <a href="javascript:;" class="text-xs font-semibold leading-tight text-slate-400"> Status </a>
        </td>
      </tr>
    `;
    });
}


function createList() {
    const listName = document.getElementById('listName').value;
    if (listName.trim() === "") {
        alert("Please enter a payment list name");
        return;
    }
    document.getElementById('listTitle').textContent = listName;
    document.getElementById('itemForm').style.display = 'block';
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function saveList() {
    const user = firebase.auth().currentUser;
    const userId = (user.uid); // TODO: Replace with actual user ID
    const category = "general"
    //const category = document.getElementById('category').value; // Assuming you have a select input with id="category"
    const listName =  appState.listName

    const table = document.getElementById('itemList').getElementsByTagName('tbody')[0];
    const paymentList = {};

    for (let row of table.rows) {
        const cells = row.getElementsByTagName('td');
    
        let recipientName = cells[0].getElementsByTagName('h6')[0].innerText;
        let recipientNumber = cells[1].innerText.trim();
        let amount = cells[2].innerText.trim();
        let reason = cells[3].innerText.trim(); // Capturing the full reason/description
    
        let itemId = generateUUID(); // Assuming generateUUID() function is available
    
        paymentList[itemId] = {
            itemId: itemId,
            recipientName: recipientName, // Extracting the name from inside the nested structure
            recipientNumber: recipientNumber,
            amount: amount,
            reason: reason, // Capturing as description
            status: "pending"
        };
    }    

    firebase.firestore().collection('payment_lists').add({
        paymentList
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        alert("The payment list has been saved!");
        sessionStorage.setItem('docRef', docRef.id);
        window.location.href = 'view-list.html';
        console.error("saveddd");
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
   

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
           
            console.log('User is signed in', user);
            console.log('User is signed in', user.displayName);
            console.log('User is signed in', user.email);
           
        } else {
        console.log('No user is signed in');
        //window.location.href = "index.html";
        }
    });
    
}); 
// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqBwsi98NoqTeqpssVyIKgjF_jQ8-jXic",
  authDomain: "sinusonic-8dcd9.firebaseapp.com",
  projectId: "sinusonic-8dcd9", 
  storageBucket: "sinusonic-8dcd9.firebasestorage.app",
  messagingSenderId: "1065090252987",
  appId: "1:1065090252987:web:2ada53c708e561449fe99e",
  measurementId: "G-METFS796MR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

console.log("✅ Firebase Connected!"); 

const nameInput = document.getElementById("nickname"); 
const msgInput = document.getElementById("message");

const sendButton = document.getElementById("send-button");

const messagesList = document.getElementById("messages-list");

sendButton.onclick = async function () {

    event.preventDefault();

    console.log("📩 Sending message...");

    const nname = nameInput.value;
    const msg = msgInput.value;

    try {
        await addDoc(collection(db, "messages"), { 
            nickname: nname,
            message: msg 
        });

        console.log("✅ Message stored in Firebase!");
        console.log("Message sent! 🚀");
        nameInput.value = ""; // Clear the nickname input
        msgInput.value = ""; // Clear the message input
        loadMessages(); // Refresh the message list
    } catch (error) {  
        console.log("Error sending message:", error);
    }
}


async function loadMessages() {

    try {
        console.log("📡 Fetching messages from Firebase...");
        const querySnapshot = await getDocs(collection(db, "messages"));

        console.log(querySnapshot.size + " messages loaded.");
        
        querySnapshot.forEach((doc) => {
            const { nickname, message } = doc.data();
            const messageElement = document.createElement('p');
            messageElement.innerHTML = `<strong>${nickname}</strong>: <normal>${message}<normal>`;
            messagesList.appendChild(messageElement);
        });
        

        console.log("✅ Messages loaded!");

    } catch (error) {
        console.log("Error loading messages:", error);
    }
}

/*
document.getElementById("message-form").addEventListener("submit", (event) => {
    event.preventDefault();  // Prevent page reload
    console.log("📩 Form submitted!");

    const nickname = nameInput.value;
    const message = msgInput.value;

    if (nickname && message) {
        sendButton.onclick(); // Use the sendButton's handler to send the message
    } else {
        alert("Please enter both a nickname and a message.");
    }
});
*/

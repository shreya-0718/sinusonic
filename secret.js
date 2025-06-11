// Import the functions you need from the SDKs you need
import { initializeApp } from "./node_modules/firebase-app";
import { getAnalytics } from "./node_modules/firebase/analytics";
import { getFirestore } from "./node_modules/firebase/firestore";
import { collection, addDoc, getDocs } from "./node_modules/firebase/firestore"; 

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

console.log("✅ Firebase Connected!"); 

const nameInput = document.getElementById("nickname"); 
const msgInput = document.getElementById("message");

const sendButton = document.getElementById("send-button");
const loadButton = document.getElementById("load-messages");

messagesList = document.getElementById("messages-list");


async function sendMessage() {

    nname = nameInput.value.trim();
    msg = msgInput.value.trim();

    try {
        const addTo = await addDoc(collection(db, "messages"), { 
            nickname: nname, 
            message: msg 
        });
        console.log("✅ Message stored in Firebase!");
        alert("Message sent! 🚀");
        loadMessages(); // Refresh the message list
    } catch (error) {  
        alert("Error sending message:", error);
    }
}

loadButton.onclick = async function loadMessages() {
    loadButton.innerHTML = "Loading 🕺";

    try {
        console.log("📡 Fetching messages from Firebase...");
        const querySnapshot = await getDocs(collection(db, "messages"));
        console.log(querySnapshot);

        const temporary = document.createElement("p");
        temporary.innerHTML = querySnapshot.size + " messages loaded.";

        /*
        querySnapshot.forEach((doc) => {
            const { nickname, message } = doc.data();
            const messageElement = document.createElement("p");
            messageElement.innerHTML = `<strong>${nickname}</strong>: ${message}`;

            //messagesList.appendChild(messageElement);
        });
        */

        console.log("✅ Messages loaded!");

    } catch (error) {
        console.log("Error loading messages:", error);
    }

    return "good";
}

document.getElementById("load-messages").onclick = async function() { 
    try { 
        const response = await fetch('https://api.example.com/data'); 
        const data = await response.json(); 
        console.log(data); 
    } catch (error) { 
        console.error('Error fetching data:', error); 
    } 
};

document.getElementById("message-form").addEventListener("submit", (event) => {
    event.preventDefault();  // Prevent page reload
    console.log("📩 Form submitted!");

    if (nickname && message) {
        sendMessage(nickname, message);
    } else {
        alert("Please enter both a nickname and a message.");
    }
});

// Load messages when the page loads
//loadMessages(); 
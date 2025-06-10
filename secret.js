// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; 

// Firebase configuration (replace with your Firebase details)
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
const db = getFirestore(app);  // Firestore database

// Send message to Firebase
async function sendMessage(nickname, message) {
    try {
        console.log("Sending message to Firestore...");
        const docRef = await addDoc(collection(db, "messages"), { nickname, message });
        console.log("Message stored successfully with ID:", docRef.id); // Verify Firestore write

        alert("Message sent! 🚀");
        loadMessages();
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// Load messages from Firebase
async function loadMessages() {
    try {
        const querySnapshot = await getDocs(collection(db, "messages"));
        const messagesList = document.getElementById("messages-list");
       // messagesList.innerHTML = "";  // Clear list

        querySnapshot.forEach((doc) => {
            const { nickname, message } = doc.data();
            const listItem = document.createElement("li");
            listItem.textContent = `${nickname}: ${message}`;
            messagesList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error loading messages:", error);
    }
}

// Attach event listener to form submission
document.getElementById("message-form").addEventListener("submit", (event) => {
    event.preventDefault();  // Stops page reload!

    const nickname = document.getElementById("nickname").value;
    const message = document.getElementById("message").value;

    if (!nickname || !message) {
        alert("Please enter both a nickname and a message.");
        return;
    }

    sendMessage(nickname, message);
});

// Load messages when page loads
loadMessages();
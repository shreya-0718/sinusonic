// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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

const nickname = document.getElementById("nickname").value; 
const message = document.getElementById("message").value;

const sendButton = document.getElementById("send-button");

messagesList = document.getElementById("messages-list");

async function sendMessage(nickname, message) {
    try {
        await addDoc(collection(db, "messages"), { nickname, message });
        console.log("✅ Message stored in Firebase!");
        alert("Message sent! 🚀");
        loadMessages(); // Refresh the message list
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

async function loadMessages() {
    try {
        console.log("📡 Fetching messages from Firebase...");
        const querySnapshot = await getDocs(collection(db, "messages"));

        sendButton.innerHTML = "Sent! 🔥";

        querySnapshot.forEach((doc) => {
            const { nickname, message } = doc.data();
            const listItem = document.createElement("li");
            listItem.textContent = `${nickname}: ${message}`;
            messagesList.appendChild(listItem);
        });

        console.log("✅ Messages loaded!");

    } catch (error) {
        console.error("Error loading messages:", error);
    }
}

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
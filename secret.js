const CODESPACE_URL = "https://improved-chainsaw-7v569jjrpxv2q7w-3000.app.github.dev";  

document.getElementById("message-form").addEventListener("submit", async (event) => {
    event.preventDefault(); 

    const nickname = document.getElementById("nickname").value;
    const message = document.getElementById("message").value;

    if (!nickname || !message) {
        alert("Please enter both a nickname and a message.");
        return;
    }

    try {
        const response = await fetch(`${CODESPACE_URL}/send-message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nickname, message }),
        });

        if (response.ok) {
            alert("Message sent!");
            loadMessages();
        } else {
            alert("Error sending message.");
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Could not connect to the server.");
    }
});

async function loadMessages() {
    try {
        const response = await fetch(`${CODESPACE_URL}/messages`);
        const messages = await response.json();

        const messagesList = document.getElementById("messages-list");
        messagesList.innerHTML = "";

        messages.forEach(({ nickname, message }) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${nickname}: ${message}`;
            messagesList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error loading messages:", error);
    }
}

loadMessages();
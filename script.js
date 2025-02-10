const ws = new WebSocket("ws://localhost:8080"); // Connect to WebSocket server
let userPrivateKey, userPublicKey, chatAESKey, otherUserPublicKey;
let currentUsername;

// Handle Login
document.getElementById("login-button").addEventListener("click", async () => {
    currentUsername = document.getElementById("username-input").value.trim();
    if (!currentUsername) return alert("Please enter a username!");

    document.getElementById("login-container").style.display = "none";
    document.getElementById("chat-container").style.display = "block";

    document.getElementById("welcome-message").textContent = `Welcome, ${currentUsername}!`;

    await generateRSAKeys();
});

// Generate RSA Key Pair
async function generateRSAKeys() {
    const keyPair = await crypto.subtle.generateKey(
        { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
        true,
        ["encrypt", "decrypt"]
    );
    userPrivateKey = keyPair.privateKey;
    userPublicKey = keyPair.publicKey;

    // Send Public Key to Server
    const exportedPublicKey = await crypto.subtle.exportKey("spki", userPublicKey);
    ws.send(JSON.stringify({ type: "publicKey", username: currentUsername, publicKey: Array.from(new Uint8Array(exportedPublicKey)) }));
}

// Generate AES Key for Chat
async function generateAESKey() {
    return await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

// Encrypt AES Key using RSA Public Key
async function encryptAESKey(aesKey, recipientPublicKey) {
    const exportedAESKey = await crypto.subtle.exportKey("raw", aesKey);
    return await crypto.subtle.encrypt({ name: "RSA-OAEP" }, recipientPublicKey, exportedAESKey);
}

// Decrypt AES Key using RSA Private Key
async function decryptAESKey(encryptedKey) {
    const decrypted = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, userPrivateKey, new Uint8Array(encryptedKey));
    return await crypto.subtle.importKey("raw", decrypted, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
}

// Encrypt Message using AES
async function encryptAES(text, key) {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(text));
    return { iv: Array.from(iv), encrypted: Array.from(new Uint8Array(encrypted)) };
}

// Decrypt Message using AES
async function decryptAES(data, key) {
    const { iv, encrypted } = data;
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(iv) }, key, new Uint8Array(encrypted));
    return new TextDecoder().decode(decrypted);
}

// Display Message in Chat
function displayMessage(sender, message) {
    const chatBox = document.getElementById("chat-box");
    const msgDiv = document.createElement("div");

    msgDiv.classList.add("message");
    if (sender === currentUsername) {
        msgDiv.classList.add("self");
    } else {
        msgDiv.classList.add("other");
    }

    msgDiv.innerHTML = `<b>${sender}:</b> ${message}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle Incoming Messages
ws.onmessage = async (event) => {
    const { type, sender, publicKey, encryptedKey, encryptedMessage } = JSON.parse(event.data);

    if (type === "publicKey") {
        otherUserPublicKey = await crypto.subtle.importKey("spki", new Uint8Array(publicKey), { name: "RSA-OAEP", hash: "SHA-256" }, true, ["encrypt"]);
        
        chatAESKey = await generateAESKey();
        const encryptedAESKey = await encryptAESKey(chatAESKey, otherUserPublicKey);
        ws.send(JSON.stringify({ type: "aesKey", sender: currentUsername, recipient: sender, encryptedKey: Array.from(new Uint8Array(encryptedAESKey)) }));
    } 
    else if (type === "aesKey" && sender !== currentUsername) {
        chatAESKey = await decryptAESKey(encryptedKey);
    } 
    else if (type === "message") {
        const decryptedMsg = await decryptAES(encryptedMessage, chatAESKey);
        displayMessage(sender, decryptedMsg);
    }
};

// Send Encrypted Message
document.getElementById("send-button").addEventListener("click", async () => {
    const message = document.getElementById("message-input").value;
    if (!message || !chatAESKey) return;

    const encryptedMsg = await encryptAES(message, chatAESKey);
    ws.send(JSON.stringify({ type: "message", sender: currentUsername, encryptedMessage: encryptedMsg }));

    displayMessage(currentUsername, message);
    document.getElementById("message-input").value = "";
});

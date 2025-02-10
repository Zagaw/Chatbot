/*const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
const users = {}; // Stores connected users & their public keys
const aesKeys = {}; // Stores AES keys for decrypting messages

console.log("WebSocket server running on ws://localhost:8080");

// Handle WebSocket connections
wss.on("connection", (ws) => {
    console.log("New user connected.");

    ws.on("message", async (message) => {
        try {
            const data = JSON.parse(message);
            await handleIncomingMessage(ws, data);
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    });

    ws.on("close", () => {
        console.log("User disconnected.");
        removeDisconnectedUser(ws);
    });
});

// Handle Incoming Messages
async function handleIncomingMessage(ws, data) {
    if (data.type === "publicKey") {
        // Store user's public key
        users[data.username] = { ws, publicKey: data.publicKey };
        console.log(`🔑 Public key received from ${data.username}`);

        // Send public key to all connected users
        broadcastExceptSender(ws, {
            type: "publicKey",
            sender: data.username,
            publicKey: data.publicKey,
        });
    } 
    else if (data.type === "aesKey") {
        // Store AES key for decrypting messages (normally not done on the server)
        aesKeys[data.sender] = data.encryptedKey;

        console.log(`🔐 AES Key exchanged between ${data.sender} and ${data.recipient}:`);
        console.log(`📜 Encrypted AES Key:`, data.encryptedKey);

        // Forward AES key to the recipient
        if (users[data.recipient]) {
            users[data.recipient].ws.send(JSON.stringify({
                type: "aesKey",
                sender: data.sender,
                encryptedKey: data.encryptedKey
            }));
        }
    } 
    else if (data.type === "message") {
        console.log(`📩 New Encrypted Message from ${data.sender}:`);
        console.log(`🔒 Encrypted:`, JSON.stringify(data.encryptedMessage));

        // Try to decrypt the message (if AES key is available)
        if (aesKeys[data.sender]) {
            try {
                const decryptedText = await decryptAES(data.encryptedMessage, aesKeys[data.sender]);
                console.log(`🔓 Decrypted Message: "${decryptedText}"`);
            } catch (error) {
                console.log(`❌ Failed to decrypt (missing AES key)`);
            }
        }

        // Broadcast encrypted message to all users
        broadcastExceptSender(ws, data);
    }
}

// Send data to all users except sender
function broadcastExceptSender(senderWs, data) {
    wss.clients.forEach((client) => {
        if (client !== senderWs && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Remove disconnected users
function removeDisconnectedUser(ws) {
    for (let username in users) {
        if (users[username].ws === ws) {
            delete users[username];
            delete aesKeys[username]; // Remove AES key
            console.log(`${username} disconnected and removed.`);
            break;
        }
    }
}

// Mock AES Decryption (Normally done in Browser)
async function decryptAES(data, encryptedKey) {
    return "[Decryption is normally done in the client. Provide AES key for testing]";
}
*/
/*
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
const users = {}; // Stores connected users & their public keys
const aesKeys = {}; // Stores AES keys for decrypting messages

console.log("WebSocket server running on ws://localhost:8080");

// Handle WebSocket connections
wss.on("connection", (ws) => {
    console.log("New user connected.");

    ws.on("message", async (message) => {
        try {
            const data = JSON.parse(message);
            await handleIncomingMessage(ws, data);
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    });

    ws.on("close", () => {
        console.log("User disconnected.");
        removeDisconnectedUser(ws);
    });
});

// Handle Incoming Messages
async function handleIncomingMessage(ws, data) {
    if (data.type === "publicKey") {
        // Store user's public key
        users[data.username] = { ws, publicKey: data.publicKey };
        console.log(`🔑 Public key received from ${data.username}`);

        // Send public key to all connected users
        broadcastExceptSender(ws, {
            type: "publicKey",
            sender: data.username,
            publicKey: data.publicKey,
        });
    } 
    else if (data.type === "aesKey") {
        // Store AES key for decrypting messages (normally not done on the server)
        aesKeys[data.sender] = data.encryptedKey;

        console.log(`🔐 AES Key exchanged between ${data.sender} and ${data.recipient}:`);
        console.log(`📜 Encrypted AES Key:`, data.encryptedKey);

        // Forward AES key to the recipient
        if (users[data.recipient]) {
            users[data.recipient].ws.send(JSON.stringify({
                type: "aesKey",
                sender: data.sender,
                encryptedKey: data.encryptedKey
            }));
        }
    } 
    else if (data.type === "message") {
        // Encrypt and log the message in a more readable format (Base64 or Hex)
        console.log(`📩 New Encrypted Message from ${data.sender}:`);
        console.log(`🔒 Encrypted (Base64): ${Buffer.from(data.encryptedMessage.encrypted, 'hex').toString('base64')}`);
        console.log(`🔒 Encrypted (Hex): ${data.encryptedMessage.encrypted}`);

        // Broadcast encrypted message to all users
        broadcastExceptSender(ws, data);
    }
}

// Send data to all users except sender
function broadcastExceptSender(senderWs, data) {
    wss.clients.forEach((client) => {
        if (client !== senderWs && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Remove disconnected users
function removeDisconnectedUser(ws) {
    for (let username in users) {
        if (users[username].ws === ws) {
            delete users[username];
            delete aesKeys[username]; // Remove AES key
            console.log(`${username} disconnected and removed.`);
            break;
        }
    }
}
*/

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
const users = {}; // Stores connected users & their public keys
const aesKeys = {}; // Stores AES keys for decrypting messages

console.log("WebSocket server running on ws://localhost:8080");

// Handle WebSocket connections
wss.on("connection", (ws) => {
    console.log("New user connected.");

    ws.on("message", async (message) => {
        try {
            const data = JSON.parse(message);
            await handleIncomingMessage(ws, data);
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    });

    ws.on("close", () => {
        console.log("User disconnected.");
        removeDisconnectedUser(ws);
    });
});

// Handle Incoming Messages
async function handleIncomingMessage(ws, data) {
    if (data.type === "publicKey") {
        // Store user's public key
        users[data.username] = { ws, publicKey: data.publicKey };
        console.log(`🔑 Public key received from ${data.username}`);

        // Send public key to all connected users
        broadcastExceptSender(ws, {
            type: "publicKey",
            sender: data.username,
            publicKey: data.publicKey,
        });
    } 
    else if (data.type === "aesKey") {
        // Store AES key for decrypting messages (normally not done on the server)
        aesKeys[data.sender] = data.encryptedKey;

        // Log AES key exchange in terminal
        console.log(`🔐 AES Key exchanged between ${data.sender} and ${data.recipient}:`);
        console.log(`📜 Encrypted AES Key:`, data.encryptedKey);

        // Forward AES key to the recipient
        if (users[data.recipient]) {
            users[data.recipient].ws.send(JSON.stringify({
                type: "aesKey",
                sender: data.sender,
                encryptedKey: data.encryptedKey
            }));
        }
    } 
    else if (data.type === "message") {
        // Encrypt and log the message in a more readable format (Base64 or Hex)
        console.log(`📩 New Encrypted Message from ${data.sender}:`);
        console.log(`🔒 Encrypted (Base64): ${Buffer.from(data.encryptedMessage.encrypted, 'hex').toString('base64')}`);
        console.log(`🔒 Encrypted (Hex): ${data.encryptedMessage.encrypted}`);

        // Broadcast encrypted message to all users
        broadcastExceptSender(ws, data);
    }
}

// Send data to all users except sender
function broadcastExceptSender(senderWs, data) {
    wss.clients.forEach((client) => {
        if (client !== senderWs && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Remove disconnected users
function removeDisconnectedUser(ws) {
    for (let username in users) {
        if (users[username].ws === ws) {
            delete users[username];
            delete aesKeys[username]; // Remove AES key
            console.log(`${username} disconnected and removed.`);
            break;
        }
    }
}

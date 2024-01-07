import Cookies from "js-cookie";

// Define the WebSocket connection here
const socket = new WebSocket(
    `${process.env.REACT_APP_AUTH_WS}/lif_account_recovery`,
);

// If page is not account recovery then close connection
if (window.location.pathname !== "/account_recovery") {
    delete socket.close();
}

// Create a reference to the event listener function
const closeConnection = () => {
    if (socket) {
        socket.close();

        // Remove the event listener after socket close
        window.removeEventListener("closeConnection", closeConnection);
    };
};

// Listen for 'closeConnection' event
window.addEventListener("closeConnection", closeConnection);

// Handle websocket open
socket.onopen = (event) => {
    console.log("WebSocket connection opened:", event);

    // Emit a custom event when the connection is established
    const connectionEvent = new CustomEvent("connectionEstablished");
    window.dispatchEvent(connectionEvent);
};

// Handle socket errors
socket.onerror = (error) => {
    console.error("WebSocket connection error:", error);

    // Emit a custom event when the connection fails
    const connectionEvent = new CustomEvent("connectionFailed");
    window.dispatchEvent(connectionEvent);
};

// Export the connect function and the send_email function
export const connect = {
    send_email(email) {
        return new Promise((resolve, reject) => {
            // Handle incoming messages
            socket.onmessage = (event) => {
                const response = JSON.parse(event.data);
                console.log("Received Response:");
                console.log(response);

                if (response && response.responseType === "emailSent") {
                    console.log("Email sent:", response);
                    resolve("OK");
                } else {
                    console.error("Unexpected response:", response);

                    if (response && response.message === "Invalid Email!") {
                        resolve("BAD_EMAIL");
                    } else {
                        resolve("ERROR");
                    }
                }
            };

            // Handle socket errors
            socket.onerror = (error) => {
                console.error("WebSocket connection error:", error);
                reject(error); // Reject the Promise in case of an error
            };

            // Send the email request via the socket
            socket.send(JSON.stringify({ email: email }));
        });
    },
    send_code(code) {
        return new Promise((resolve, reject) => {
            // Handle incoming messages
            socket.onmessage = (event) => {
                const response = JSON.parse(event.data);
                console.log("Received Response:");
                console.log(response);

                if (response && response.responseType === "codeCorrect") {
                    console.log("Code sent:", response);
                    resolve('OK');
                } else {
                    console.error("Unexpected response:", response);

                    if (response && response.message === 'Bad Code') {
                        resolve('BAD_CODE');
                    } else {
                        resolve('ERROR');
                    }
                }
            };

            // Handle socket errors
            socket.onerror = (error) => {
                console.error('WebSocket connection error:', error);
                reject(error); // Reject the Promise in case of an error
            };

            // Send the code request via the socket
            socket.send(JSON.stringify({ code: code }));
        });
    },
    send_password(password) {
        return new Promise((resolve, reject) => {
            // Handle incoming messages
            socket.onmessage = (event) => {
                const response = JSON.parse(event.data);
                console.log("Received Response:");
                console.log(response);

                if (response && response.responseType === "passwordUpdated") {
                    console.log("Code sent:", response);

                    // Set login cookies
                    Cookies.set("LIF_USERNAME", response.username, {path: "/"});
                    Cookies.set("LIF_TOKEN", response.token, {path: "/"});

                    resolve('OK');
                } else {
                    console.error("Unexpected response:", response);

                    resolve('ERROR');
                }
            };

            // Handle socket errors
            socket.onerror = (error) => {
                console.error("WebSocket connection error:", error);
                reject(error); // Reject the Promise in case of an error
            };

            // Send the password request via the socket
            socket.send(JSON.stringify({ password: password }));
        });
    }
};

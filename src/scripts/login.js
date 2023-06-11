import save_cookie from "./save_cookie";

export async function login(username, password) {
  return new Promise((resolve, reject) => {
    let sent_credentials = false;

    // Create a new WebSocket connection
    const socket = new WebSocket('ws://localhost:9000');

    // Event handler for successful connection
    socket.onopen = function (event) {
      console.log('WebSocket connection opened');

      // Requests a handshake from the server
      socket.send('USER_LOGIN');
    };

    // Event handler for receiving messages from the server
    socket.onmessage = function (event) {
      const message = event.data;
      console.log('Received message from server:', message);

      if (message === 'SEND_CREDENTIALS') {
        // Prepare the credentials as a JSON object
        const credentials = {
          Username: username,
          Password: password,
        };

        // Convert the JSON object to a string
        const jsonCredentials = JSON.stringify(credentials);

        console.log(jsonCredentials);

        // Send the credentials to the server using the WebSocket connection
        socket.send(jsonCredentials);

        sent_credentials = true;
      }
      if (sent_credentials === true) {
        if (message !== "INVALID_CREDENTIALS") {
          save_cookie("LIF_TOKEN", message);
          socket.close();
          resolve("LOGIN_GOOD");
        } else {
          socket.close();
          reject("LOGIN_BAD");
        }
      }
    };
  });
}


export default login;

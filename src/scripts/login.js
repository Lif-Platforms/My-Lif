import CryptoJS from 'crypto-js';

export async function login(username, password) {
    let handshake_complete = false;
    let server_pub_key = 'none';
  
    // Create a new WebSocket connection
    const socket = new WebSocket('ws://localhost:9000');
  
    // Event handler for successful connection
    socket.onopen = function (event) {
      console.log('WebSocket connection opened');
  
      // Requests a handshake from the server
      socket.send('HANDSHAKE');
    };
  
    // Event handler for receiving messages from the server
    socket.onmessage = function (event) {
      const message = event.data;
      console.log('Received message from server:', message);
  
      // If the handshake is not complete, the client will save the message as the public key
      if (handshake_complete === false) {
        server_pub_key = message;
        console.log(server_pub_key);
  
        socket.send('USER_LOGIN');
      }
  
      // Checks if the server requested the user credentials
      if (message === 'SEND_CREDENTIALS') {
        // Prepare the credentials as a JSON object
        const credentials = {
          Username: username,
          Password: password,
        };
  
        // Convert the JSON object to a string
        const jsonCredentials = JSON.stringify(credentials);
  
        console.log(jsonCredentials);
  
        // Encrypt the JSON string using the server's public key
        const encryptedCredentials = CryptoJS.AES.encrypt(jsonCredentials, server_pub_key).toString();
  
        console.log('Encrypted Credentials: ' + encryptedCredentials);
  
        // Send the encrypted credentials to the server using the WebSocket connection
        socket.send(encryptedCredentials);
      }
    };
}

export default login;

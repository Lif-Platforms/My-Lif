let socket;

export const openConnection = async (url) => {
    socket = new WebSocket(url);

    socket.onopen = () => {
        console.log('Connected');
    };

    socket.onmessage = (event) => {
        console.log('Message from server ', event.data);
    };

    socket.onclose = () => {
        console.log('Disconnected');
    };

    socket.onerror = (error) => {
        console.error('WebSocket Error: ', error);
    };
};

export const closeConnection = () => {
    if (socket) {
        socket.close();
    }
};

export const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        console.error('WebSocket is not open');
    }
};

export const receiveMessage = (callback) => {
    if (socket) {
        socket.onmessage = (event) => {
            callback(event.data);
        };
    }
};

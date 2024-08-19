let socket;
let token;

function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            token = data.token;
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('chat-container').style.display = 'block';
            initializeChat();
        }
    });
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            token = data.token;
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('chat-container').style.display = 'block';
            initializeChat();
        }
    });
}

function initializeChat() {
    socket = io.connect('/', {
        query: { token }
    });

    socket.on('message', (message) => {
        const messagesContainer = document.getElementById('messages');
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messagesContainer.appendChild(messageElement);
    });

    socket.emit('joinRoom', 'general');
}

function sendMessage() {
    const message = document.getElementById('message-input').value;
    socket.emit('sendMessage', { room: 'general', message });
    document.getElementById('message-input').value = '';
}

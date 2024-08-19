// Wait for the DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Elements from the login form
  const loginContainer = document.getElementById('login-container');
  const chatContainer = document.getElementById('chat-container');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');

  // Elements from the chat interface
  const messages = document.getElementById('messages');
  const messageInput = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  const roomButtons = document.querySelectorAll('.room');

  // Socket.IO connection
  let socket;

  // Redirect to registration page
  registerBtn.addEventListener('click', () => {
    window.location.href = 'register.html';
  });

  // Handle login
  loginBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      displayError('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        handleSuccessfulLogin(data.token);
      } else {
        displayError(data.error);
      }
    } catch (error) {
      displayError('An error occurred during login.');
    }
  });
//=========Handle logout
    const logoutBtn = document.getElementById('logout-btn');

        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    // Clear any local storage or cookies if using tokens
                    localStorage.removeItem('authToken'); // Adjust if needed
                    window.location.href = 'index.html'; // Redirect to login page
                } else {
                    console.error(data.error || 'Logout failed.');
                }
            } catch (error) {
                console.error('An error occurred during logout:', error);
            }
        });
   

//=========
  // Display error messages
  function displayError(message) {
    errorMessage.innerText = message;
  }

  // Handle successful login
  function handleSuccessfulLogin(token) {
    // Clear error message
    errorMessage.innerText = '';

    // Store token in local storage (not secure for production use)
    localStorage.setItem('token', token);

    // Show chat container and hide login
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'block';

    // Connect to socket server
    connectToChat();
  }

  // Connect to the chat server via Socket.IO
  function connectToChat() {
    socket = io('http://localhost:3000', {
      auth: {
        token: localStorage.getItem('token') // Send token to the server for authentication
      }
    });

    socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    socket.on('message', displayMessage);

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
      displayError('Could not connect to chat server.');
    });
  }

  // Display a message in the chat
  function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messages.appendChild(messageElement);
  }

  // Send a message
  sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message && socket) {
      socket.emit('message', message);
      messageInput.value = '';
    }
  });

  // Handle room selection
  roomButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const room = button.getAttribute('data-room');
      if (socket) {
        socket.emit('joinRoom', room);
      }
    });
  });
});

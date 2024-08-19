import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './style.css';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  
 useEffect(() => {
  const newSocket = io('http://localhost:3000'); // Replace 3000 with the correct port number
  setSocket(newSocket);

  newSocket.on('connect', () => {
    console.log('Connected to server');
  });

  // Clean up on component unmount
  return () => {
    newSocket.disconnect();
  };
}, []);



    newSocket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    newSocket.on('user-list', (userList) => {
      setUsers(userList);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      socket.emit('message', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-window">
        <div className="message-list">
          {messages.map((message, index) => (
            <div key={index} className="message">{message}</div>
          ))}
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          className="message-input"
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
      <div className="user-list">
        <h4>Online Users:</h4>
        {users.map((user, index) => (
          <div key={index} className="user">{user}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
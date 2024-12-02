



'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import styles from './adminchat.module.css'; // Import the CSS module
import { FaTrashAlt } from 'react-icons/fa';


const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState(''); // Admin's reply message
  const [currentUserId, setCurrentUserId] = useState(''); // Current user being replied to
  const [socket, setSocket] = useState(null);
  const [activeUser, setActiveUser] = useState(''); // Track active user in sidebar

  useEffect(() => {
    const socketIo = io('http://localhost:3000');
    setSocket(socketIo);

    socketIo.emit('joinRoom', { userId: 'admin' });

    // Fetch all messages from server
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/api/chat');
        setMessages(response.data);
        setCurrentUserId(response.data[0]?.sender); // Set the first user as default
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    // Listen for real-time messages
    socketIo.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  // const sendResponse = async () => {
  //   if (response.trim() && currentUserId) {
  //     try {
  //       const msgObj = {
  //         sender: 'admin',
  //         receiver: currentUserId,
  //         message: response
  //       };

  //       // Send message to server
  //       await axios.post('/api/chat', msgObj);

  //       // Emit message to the user via socket
  //       socket.emit('adminReply', msgObj);
  //       setResponse(''); // Clear input after sending
  //     } catch (error) {
  //       console.error('Error sending response:', error);
  //     }
  //   }
  // };


  const sendResponse = async () => {
    if (response.trim() && currentUserId) {
      try {
        const msgObj = {
          sender: 'admin',
          receiver: currentUserId,
          message: response
        };
  
        // Send message to server
        await axios.post('/api/chat', msgObj);
  
        // Emit message to the user via socket
        socket.emit('adminReply', msgObj);
  
        // Immediately update messages state
        setMessages((prevMessages) => [...prevMessages, msgObj]);
  
        setResponse(''); // Clear input after sending
      } catch (error) {
        console.error('Error sending response:', error);
      }
    }
  };

  

  // Group messages by each user (by receiver or sender)
const groupedMessages = messages.reduce((acc, msg) => {
    const userId = msg.sender !== 'admin' ? msg.sender : msg.receiver;
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push(msg);
    return acc;
  }, {});

  const handleUserClick = (userId) => {
    setCurrentUserId(userId);
    setActiveUser(userId);
  };
 


 const handleDeleteUserChats = async (userId) => {
 try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      if (!token) {
        toast.error("Unauthorized: Please log in as admin.");
        return;
      }

      await axios.delete(`/api/chat/admin/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }); // API to delete user's chats

      setMessages((prevMessages) => prevMessages.filter(msg => msg.sender !== userId && msg.receiver !== userId));
    } catch (error) {
      console.error('Error deleting user chats:', error);
    }
  };


  return (
    <div className={styles.chatWrapper}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Users</h2>
        {Object.keys(groupedMessages).map((userId, index) => (
          <div
            key={index}
            className={`${styles.sidebarUser} ${activeUser === userId ? styles.activeUser : ''}`}
            onClick={() => handleUserClick(userId)}
          >

          <div className={styles.chatcontainer}>
            <p className={styles.userid}>{userId.slice(0, 8)}...</p>
           
            <p className={styles.lastMessage}>
              {groupedMessages[userId][groupedMessages[userId].length - 1]?.message}
            </p>
            </div>

            <FaTrashAlt
              className={styles.deleteIcon}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering user selection
                handleDeleteUserChats(userId);
              }}
            />

          </div>
        ))}
      </div>

      <div className={styles.chatContainer}>
        <h1 className={styles.title}>Admin Chat</h1>
        <div className={styles.messageList}>
          {groupedMessages[currentUserId]?.map((msg, idx) => (
            <p key={idx} className={msg.sender === 'admin' ? styles.adminMsg : styles.userMsg}>
              {msg.sender === 'admin' ? `${msg.message}` : `${msg.message}`}
            </p>
          ))}
        </div>




        {/* Reply section */}
        <div className={styles.replySection}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type a response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
          <button
            className={styles.replyBtn}
            onClick={sendResponse}
            disabled={!response.trim()}
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;

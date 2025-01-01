
"use client";

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { FaComments, FaPaperPlane } from 'react-icons/fa'; // Importing icons
import styles from './userchat.module.css';
import Loader from "../../../components/Loader";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [loading, setLoading] = useState(false);
  
 
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
 
  useEffect(() => {
    let storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      storedUserId = `user${Date.now()}`;
      localStorage.setItem('userId', storedUserId);
    }
    setUserId(storedUserId);

    // const socketIo = io('http://localhost:3000');
    const socketIo = io(baseUrl);
    setSocket(socketIo);

    socketIo.emit('joinRoom', { userId: storedUserId });

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/chat?userId=${storedUserId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    socketIo.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        setLoading(true);
        const msgObj = {
          sender: userId,
          receiver: 'admin',
          message
        };

        await axios.post('/api/chat', msgObj);
        socket.emit('userMessage', msgObj);
        setMessage('');
      } catch (error) {
        toast.error('Error sending message:', error)
        console.error('Error sending message:', error);
      }
      finally {
        setLoading(false);
      }
    }

    
  };

  if (loading) {
    return <Loader />; 
  }

  return (
    <div>
      {loading && <Loader />}

      {!isChatOpen && (
        <button className={styles.chatButton} onClick={() => setIsChatOpen(true)}>
          <FaComments className={styles.chatIcon} />
        </button>
      )}

      {isChatOpen && (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h1 className={styles.title}>ShopName</h1>
            <button className={styles.closeButton} onClick={() => setIsChatOpen(false)}>×</button>
          </div>
          
          <div className={styles.chatWindow}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.sender === userId ? styles.userMessage : styles.adminMessage}
              >
                <strong className={styles.msgbutton} > <p> {msg.message} </p> </strong> 
                {/*{msg.sender === userId ? 'You' : 'Admin'}: */}
              
              </div>
            ))}
          </div>

          <div className={styles.inputContainer}>
            <input
              type="text"
              className={styles.inputField}
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className={styles.sendButton} onClick={sendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;



"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './SendNewsletter.module.css';

const SendNewsletter = () => {
  const [users, setUsers] = useState([]);
  const [externalEmails, setExternalEmails] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/mail/sendNewsletter');
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };
    fetchUsers();
  }, []);

  const handleAddEmail = () => {
    if (newEmail && !externalEmails.includes(newEmail)) {
      setExternalEmails([...externalEmails, newEmail]);
      setNewEmail(''); // Clear input
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setExternalEmails(externalEmails.filter(email => email !== emailToRemove));
  };

  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const handleSendEmails = async () => {
    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('externalEmails', JSON.stringify(externalEmails));
  
    attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });
  
    try {
      await axios.post('/api/mail/sendNewsletter', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Emails sent successfully!');
    } catch (error) {
      console.error('Error sending emails', error);
      alert('Failed to send emails.');
    }
  };
  

  return (
    <div className={styles.container}>
      <h2>Send Newsletter</h2>
      <div className={styles.form}>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
          />
        </div>
        <div>
          <label>Attachments (images):</label>
          <input type="file" onChange={handleFileChange} multiple />
        </div>
        <h3>All Users</h3>
        <ul>
          {users.map(user => (
            <li key={user._id}>{user.email}</li>
          ))}
        </ul>
        <h3>Add External Emails</h3>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter external email"
        />
        <button onClick={handleAddEmail}>Add Email</button>
        <ul>
          {externalEmails.map((email, index) => (
            <li key={index}>
              {email} <button onClick={() => handleRemoveEmail(email)}>Remove</button>
            </li>
          ))}
        </ul>
        <button onClick={handleSendEmails}>Send Newsletter</button>
      </div>
    </div>
  );
};

export default SendNewsletter;

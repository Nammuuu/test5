








// "use client";
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import styles from '../../../styles/admin/users/UserList.module.css'; // Adjust the import path as needed
// import { useRouter } from 'next/navigation';


// const UserListPage = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const { data } = await axios.get('/api/admin/users', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsers(data.users);
//       } catch (error) {
//         toast.error('Error fetching users');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleDelete = async (id) => {
//     if (confirm('Are you sure you want to delete this user?')) {
//       try {
//         const token = localStorage.getItem('token');
//         await axios.delete(`/api/admin/users?id=${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsers(users.filter(user => user._id !== id));
//         toast.success('User deleted successfully');
//       } catch (error) {
//         toast.error('Error deleting user');
//       }
//     }
//   };

  // const handleUpdate = async (user) => {
  //   const newUsername = prompt('Enter new username:', user.username);
  //   const newEmail = prompt('Enter new email:', user.email);
  //   const newPhoneNumber = prompt('Enter new phone number:', user.phoneNumber);

  //   if (newUsername && newEmail) {
  //     try {
  //       const token = localStorage.getItem('token');
  //       await axios.put('/api/admin/users', {
  //         userId: user._id,
  //         username: newUsername,
  //         email: newEmail,
  //         phoneNumber: newPhoneNumber,
  //       }, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setUsers(users.map(u => u._id === user._id ? { ...u, username: newUsername, email: newEmail, phoneNumber: newPhoneNumber } : u));
  //       toast.success('User updated successfully');
  //     } catch (error) {
  //       toast.error('Error updating user');
  //     }
  //   }
  // };

//   return (
//     <div className={styles.userContainer}>
//       <h2>User List</h2>
//       {loading ? (
//         <p>Loading users...</p>
//       ) : (
//         <ul className={styles.userList}>
//           {users.map(user => (
//             <li key={user._id} className={styles.userItem}>
//               <a href={`/admin/users/${user._id}`}>{user.username}</a>
//               <p>Email: {user.email}</p>
//               <p>Phone Number: {user.phoneNumber}</p>
//               <button onClick={() => handleUpdate(user)}>Update</button>
//               <button onClick={() => handleDelete(user._id)}>Delete</button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default UserListPage;








 
 

"use client"; 

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from '../../../styles/admin/users/UserList.module.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState({ username: '', email: '', phoneNumber: '', role: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        // const { data } = await axios.get(`/api/admin/users?page=${currentPage}`, {
          const { data } = await axios.get('/api/admin/users', { 
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data.users);
        // setTotalPages(data.totalPages); // Adjust as per your API response
      } catch (error) {
        toast.error('Error fetching users');
      } finally {
        setLoading(false);
      } 
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/admin/users?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter(user => user._id !== id));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Error deleting user');
      }
    }
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setUserData({
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });
  };




  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateSubmit = async () => {
    const { username, email, phoneNumber, role } = userData;

    if (username && email) {
      try {
        const token = localStorage.getItem('token');
        await axios.put('/api/admin/users', {

          userId: selectedUser._id,
          username,
          email,
          phoneNumber,
          role,
        }, {
          headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" },
        });
        setUsers(users.map(u => u._id === selectedUser._id ? { ...u, ...userData } : u));
        toast.success('User updated successfully');
        setSelectedUser(null);
      } catch (error) {
        toast.error('Error updating user');
      }
    }
  };

  const handleClosePopup = () => {
    setSelectedUser(null);
  };

  return (
    <div className={styles.userContainer}>
      <h2>User List</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleUpdate(user)} className={styles.editButton}><FaEdit /></button>
                  <button onClick={() => handleDelete(user._id)} className={styles.deleteButton}><FaTrashAlt /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedUser && (
        <div className={styles.popupOverlay} onClick={handleClosePopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <h2>Edit User</h2>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Role:
              <select
               name="role"
              value={userData.role}
              onChange={handleInputChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              
                  </select>
      
            </label>
            <button onClick={handleUpdateSubmit}>Save</button>
            <button onClick={handleClosePopup}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListPage;

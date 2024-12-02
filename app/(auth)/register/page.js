'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../../styles/page/Register.module.css';
import Loader from '../../../components/Loader'; 
import { useAuth } from '../../../components/hooks/useAuth';


const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loadingg, setLoading] = useState(false);
  const { register, loading, error } = useAuth();
  const router = useRouter();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !username || !password) {
      toast.error("All fields are required!");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setLoading(true);

    const response = await register({ email, username, password });

    if (response.success) {
      toast.success("Registration successful!");
      router.push('/login');
    } else {
      toast.error(response.error || "Registration failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container2}>
        <div className={styles.containerimg}>
          <span>Logo</span>
          <p>
            Enter your Register credentials,
            <br />
            enjoy your day
          </p>
        </div>

        <form onSubmit={handleRegister} className={styles.form}>
          <h1 className={styles.title}>Register</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
            disabled={loading}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? <Loader size={20} /> : 'Register'}
          </button>

        {/*  <div>
            <h1>
              Already have an account? <br /> <Link href="/login">Login Here</Link>
            </h1>
          </div>

          */}
        </form>
      </div>
    </div>
  );
};

export default Register;

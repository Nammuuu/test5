'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../../styles/page/Login.module.css';
import Loader from '../../../components/Loader';
import { useAuth } from '../../../components/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import  logoimg from "../../../public/next.svg"

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, loading } = useAuth();
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false);



  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setUsername('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      
      toast.error("Email and password are required!");
      return;
     
    }

    const response = await login({ email, password });

    if (response.success) {
      toast.success("Login successful!");
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      // window.location.reload();
      // router.push('/');
      window.location.href = '/';
     
    } else {
      toast.error(response.error || "Login failed. Please check your credentials.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      toast.error("All fields are required!");
      return;
    }

    const response = await register({ email, username, password });

    if (response.success) {
      toast.success("Registration successful!.. Please Login In");
      // router.push('/');
    } else {
      toast.error(response.error || "Registration failed. Please try again.");
    }
  };

  // <Image  src="./logo" alt="logo" className={styles.logo}  />
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {isLogin ? (
          <form onSubmit={handleLogin} className={styles.form}>
          <div>
          <Image src={logoimg} alt="logo" className={styles.logo} 
          width={50}
          height={50} />
          </div>
            <h1 className={ `${styles.title} fontcolor`}>Login with your email & password</h1>
          
            <label htmlFor="email" className={`${styles.label} lglabelcolor`}>Email</label>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.input} lginputcolor`}
              required
              disabled={loading}
            />

            <label htmlFor="password" className={`${styles.label} lglabelcolor`}>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.input} lginputcolor`}
              required
              disabled={loading}
            />
            <button type="submit" className={`${styles.button} lgbuttoncolor`} disabled={loading}>
              {loading ? <Loader size={20} /> : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.form}>
          <div>
          <Image src={logoimg} alt="logo" className={styles.logo} 
          width={50}
          height={50} />
          <h1 className={ `${styles.title} fontcolor`}>By signing up, you agree to our terms & policy</h1>
          </div>

            
            <label htmlFor="email" className={`${styles.label} lglabelcolor`}>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.input} lginputcolor`}
              required
              disabled={loading}
            />

            <label htmlFor="text" className={`${styles.label} lglabelcolor`}>Name</label>
            <input
              type="text"
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`${styles.input} lginputcolor`}
              required
              disabled={loading}
            />

            <label htmlFor="password" className={`${styles.label} lglabelcolor`}>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.input} lginputcolor`}
              required
              disabled={loading}
            />
            <button type="submit" className={`${styles.button} lgbuttoncolor`} disabled={loading}>
              {loading ? <Loader size={20} /> : 'Register'}
            </button>
          </form>
        )}

        <div className={styles.sidebar}>
        

        <div onClick={handleSwitch} className={styles.switchButton}>
          {isLogin ? <p className= "lgdes">Don&#39;t have any account?<span className= "fontcolor"> register </span> </p>
             : 
            <p className= "lgdes">Already have an account?<span className= "fontcolor"> Login</span> </p>}
        </div>

      </div>

      </div>

     

    </div>
  );
};

export default LoginRegister;

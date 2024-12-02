
import Link from 'next/link';
import styles from '../styles/not-found.module.css'; 
export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.error_code}>404</h1>
      <p className={styles.error_message}>Oops! The page you&apos;re looking for does not exist.</p>
      <Link href="/" className={styles.home_link}>Go back to Home</Link>
    </div>
  );
}







"use client";

import { useRouter } from 'next/navigation'; 
import { useState } from 'react'; 
import styles from '../../styles/product/SearchBar.module.css'; 

const SearchBar = () => {
  const router = useRouter(); 
  const [query, setQuery] = useState(''); 

  // Handle input change
  const handleSearchChange = (e) => {
    setQuery(e.target.value); 
  };

  // Function to open the search page
  const openSearchPage = () => {
    router.push('/search'); 
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={handleSearchChange}
        onClick={openSearchPage}  
        className={styles.searchInput}
      />
    </div>
  );
};

export default SearchBar;

// "use client";

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import styles from '../../../../styles/product/SearchBar.module.css';

// const SearchBar = () => {
//   const [query, setQuery] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [sortByLatest, setSortByLatest] = useState(false); // State for sorting by latest

//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       try {
//         const response = await axios.get('/api/user/product/search', {
//           params: {
//             query,
//             sort: sortByLatest ? 'latest' : undefined, // Optional sort parameter
//           },
//         });

//         // Assuming response data contains categories, tags, and products
//         setSuggestions(response.data.products);
//       } catch (error) {
//         console.error('Error fetching suggestions:', error);
//       }
//     };

//     if (query) {
//       fetchSuggestions();
//     }
//   }, [query, sortByLatest]);

//   const handleSearchChange = (e) => {
//     setQuery(e.target.value);
//   };

//   const handleSuggestionClick = (product) => {
//     // Implement your navigation or selection logic here
//     console.log('Product selected:', product);
//   };

//   const handleSearchSubmit = () => {
//     // Redirect to /search page or handle the search query differently
//     window.location.href = `/search?query=${query}`;
//   };

//   return (
//     <div className={styles.searchBar}>
//       <input
//         type="text"
//         placeholder="Search for products..."
//         value={query}
//         onChange={handleSearchChange}
//         className={styles.searchInput}
//       />
//       <button onClick={handleSearchSubmit}>Search</button>

//       {suggestions.length > 0 && (
//         <div className={styles.suggestions}>
//           {suggestions.map((product) => (
//             <div
//               key={product._id}
//               className={styles.suggestionItem}
//               onClick={() => handleSuggestionClick(product)}
//             >
//               <img src={product.media[0]} alt={product.name} className={styles.suggestionImage} />
//               <div className={styles.suggestionDetails}>
//                 <h3>{product.name}</h3>
//                 <p>{product.description}</p>
//                 <p>Tags: {product.tags.join(', ')}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Filter by latest toggle */}
//       <div className={styles.filters}>
//         <label>
//           <input
//             type="checkbox"
//             checked={sortByLatest}
//             onChange={() => setSortByLatest((prev) => !prev)}
//           />
//           Sort by Latest
//         </label>
//       </div>
//     </div>
//   );
// };

// export default SearchBar;



// app/search/[query]/page.js

// app/(userpages)/search/[query]/page.js

// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const SearchResults = () => {
//   const router = useRouter();
//   const { query } = router.query; // Access the dynamic part of the URL
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (query) {
//       const fetchProducts = async () => {
//         try {
//           const response = await axios.get(`/api/user/product/search`, {
//             params: { query },
//           });
//           setProducts(response.data.products);
//         } catch (error) {
//           console.error('Error fetching products:', error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchProducts();
//     }
//   }, [query]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div>
//       <h1>Search Results for "{query}"</h1>
//       {products.length > 0 ? (
//         <ul>
//           {products.map((product) => (
//             <li key={product._id}>
//               <h2>{product.name}</h2>
//               <p>{product.description}</p>
//               <img src={product.media[0]} alt={product.name} width={100} />
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No products found.</p>
//       )}
//     </div>
//   );
// };

// export default SearchResults;





import React from 'react'

const page = () => {
  return (
    <div>
      search query 
    </div>
  )
}

export default page

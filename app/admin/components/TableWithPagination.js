

// "use client";
// // components/TableWithPagination.js
// import React, { useState, useEffect } from 'react';

// const TableWithPagination = ({ data, totalPages, currentPage, onPageChange }) => {
//   const [page, setPage] = useState(currentPage);

//   useEffect(() => {
//     setPage(currentPage);
//   }, [currentPage]);

//   const handlePrevious = () => {
//     if (page > 1) {
//       onPageChange(page - 1);
//     }
//   };

//   const handleNext = () => {
//     if (page < totalPages) {
//       onPageChange(page + 1);
//     }
//   };

//   return (
//     <div>
//       <table className="table-auto w-full">
//         <thead>
//           <tr>
//             {/* Customize your table headers */}
//             <th>Username</th>
//             <th>Email</th>
//             <th>Role</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item) => (
//             <tr key={item._id}>
//               <td>{item.username}</td>
//               <td>{item.email}</td>
//               <td>{item.role}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="pagination-controls">
//         <button onClick={handlePrevious} disabled={page === 1}>
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button onClick={handleNext} disabled={page === totalPages}>
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TableWithPagination;




// del page code no need thsi  
"use client";

import React, { useState, useEffect } from 'react';
import styles from "../../../styles/admin/TableWithPagination.module.css";

const TableWithPagination = ({ data, totalPages, currentPage, onPageChange }) => {
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.username}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
            </tr>
          ))} 
        </tbody>
      </table>
      <div className={styles.paginationControls}>
        <button onClick={handlePrevious} disabled={page === 1} className={styles.paginationButton}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={page === totalPages} className={styles.paginationButton}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TableWithPagination;





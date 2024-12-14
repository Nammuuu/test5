


"use client";

import React, { useEffect, useState } from "react";
import styles from "../../styles/InfoPages.module.css";
import Loader from "../../components/Loader";
import axios from "axios";

// import styles from '../../styles/blog/BlogDetails.module.css';

const DynamicPage = ({ pageName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const { data } = await axios.get(`/api/pagesdata/pagedata?name=${pageName}`);
        if (data.pages && data.pages.length > 0) {
          setPageData(data.pages[0]); // Assuming there's one page entry per name
        } else {
          setPageData({ title: "Not Found", content: "<p>No content available</p>" });
        }
      } catch (error) {
        console.error("Failed to fetch page data:", error);
        setPageData({ title: "Error", content: "<p>Unable to load page content.</p>" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [pageName]);

  return (
    <div className={styles.pageContainer}>
      {isLoading && <Loader />}

      {!isLoading && pageData && (
        <>
        {/* <h1>{pageData.title}</h1>   */}
          
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: pageData.content }}></div>
        </>
      )}
    </div>
  );
};

export default DynamicPage;

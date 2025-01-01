



"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../../../../styles/admin/blog/BlogEditor.module.css";
import { FaTimes } from "react-icons/fa"; 
import { useRouter } from 'next/navigation';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const PageEditor = () => {
  const [pageName, setPageName] = useState("AboutPage"); // Default page name
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pages, setPages] = useState([]); // List of existing pages
  const [selectedPage, setSelectedPage] = useState(null); // For edit/delete
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [router]);

  // Fetch existing pages for the selected page name
  const fetchPages = async () => {
    try {
      const { data } = await axios.get(`/api/admin/pagedata?name=${pageName}`);
      setPages(data.pages || []);
    } catch (error) {
      toast.error("Failed to fetch pages.");
    }
  };

  useEffect(() => {
    fetchPages();
  }, [pageName]);

  // Handle submit for POST or PUT (create or update)
  const handleSubmit = async () => {
    if (!title || !content) {
      toast.error("Title and content are required.");
      return;
    }

    try {
      setLoading(true);

      const payload = { title, content, name: pageName };
      let response;

      if (selectedPage) {
        // Update existing page (PUT)
        response = await axios.put(`/api/admin/pagedata/${selectedPage._id}`, payload);
        toast.success("Page updated successfully.");
      } else {
        // Create new page (POST)
        response = await axios.post("/api/admin/pagedata", payload);
        toast.success("Page created successfully.");
      }

      setLoading(false);
      setTitle("");
      setContent("");
      setSelectedPage(null);
      fetchPages(); // Refresh the list
    } catch (error) {
      toast.error("Failed to save page.");
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/pagedata/${id}`);
      toast.success("Page deleted successfully.");
      fetchPages(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete page.");
    }
  };



  const modules = {
    toolbar: [
      [{ header: "1" }, { p: "0.8" }, { header: "2" }, { header: "3" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        {
          color: ["red", "blue", "yellow",

            "#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff",
  "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff",
  "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff",
  "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2",
  "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"

           ],
        },
      ],
      [
        { list: "ordered" },
        { 'list': 'bullet' },
        { indent: "-1" },
        { indent: "+1" },
      ],
      // ["link", "image",],
      ["link"],
      ["clean"],
   
    ],


    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },

  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",  // "list" covers both ordered and bullet lists
    "indent",
    "link",
    // "image",
    "color",
  ];

  const handleContentChange = (content, delta, source, editor) => {
    const selection = editor.getSelection();
    
    if (selection) {
      // Check if pasted content is an image URL
      const pastedImageUrl = content.match(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i);
      if (pastedImageUrl) {
        // Insert the image into the Quill editor at the current selection
        editor.insertEmbed(selection.index, 'image', pastedImageUrl[0]);
      }
    }
  
    setContent(content); // Update content state
  };

  // Handle edit (populate form with existing data)
  const handleEdit = (page) => {
    setSelectedPage(page);
    setTitle(page.title);
    setContent(page.content);
  };

  return (
    <div className={styles.container}>
      <h2>Admin Page Editor</h2>

      {/* Dropdown for selecting page */}
      <select
        value={pageName}
        onChange={(e) => setPageName(e.target.value)}
        className={styles.inputField}
      >
        <option value="AboutPage">About Page</option>
        <option value="CookiesPolicy">Cookies Policy</option>
        <option value="FAQ">FAQ</option>
        <option value="Privacy">Privacy Policy</option>
        <option value="ReturnExchange">Return Exchange</option>
        <option value="Shipping">Shipping</option>
        <option value="TermsConditions">Terms & Conditions</option>
        <option value="ContactUs">Contact Us</option>
      </select>

      <div className={styles.form}>
        <input
          type="text"
          placeholder="Page Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
         className={styles.inputField}
        />

<ReactQuill
  value={content}
  onChange={handleContentChange} 
  modules={modules} 
  className={styles.textEditor}
  formats={formats}
  placeholder="compose here"
  theme="snow"
/>

        <button
          className={styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : selectedPage ? "Update Page" : "Create Page"}
        </button>
      </div>

      <div className={styles.pageList}>
        <h3>Existing Pages</h3>
        {pages.length > 0 ? (
          pages.map((page) => (
            <div key={page._id} className={styles.pageItem}>
              <h4>{page.title}</h4>
              <button
                className={styles.editButton}
                onClick={() => handleEdit(page)}
              >
                Edit
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(page._id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No pages found for {pageName}.</p>
        )}
      </div>
    </div>
  );
};

export default PageEditor;
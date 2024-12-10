


// "use client"
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import dynamic from 'next/dynamic';
// import 'react-quill/dist/quill.snow.css'; // Quill's CSS
// import styles from '../../../styles/admin/blog/BlogEditor.module.css';
// import Link from 'next/link';
// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// const BlogEditor = () => {
//   const [title, setTitle] = useState('');
//   const [heading, setHeading] = useState('');
//   const [content, setContent] = useState(''); // For rich text content
//   const [urlSlug, setUrlSlug] = useState('');
//   const [metaDescription, setMetaDescription] = useState('');
//   const [metaKeywords, setMetaKeywords] = useState('');
//   const [images, setImages] = useState([]); // For storing image URLs
//   const [loading, setLoading] = useState(false);

//   const router = useRouter();

  // const [isAdmin, setIsAdmin] = useState(false);
  // const [userId, setUserId] = useState('');
 

// //   fatce user id {admin }

// useEffect(() => {
//     // Check if the user is an admin
//     const token = localStorage.getItem('token');
//     if (!token) {
//     //   router.push('/login');
//       return;
//     }
//     axios.get('/api/admin/blog/admin', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(({ data }) => {
//       console.log("User data:", data); // Log the user data  
//         setIsAdmin(true);
//         setUserId(data.userId); 
//     })
//     .catch((error) => {
//       console.error('Error verifying admin:', error);
//       toast.error('Failed to verify admin');
//     //   router.push('/login');
//     });
//   }, [router]);


  // // Handle blog submission
  // const handleSubmit = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     setLoading(true);
 
  //     const { data } = await axios.post(
  //       '/api/admin/blog',
  //       {
  //         title,
  //         heading,
  //         content,
  //         urlSlug,
  //         metaDescription,
  //         metaKeywords,
  //         images, // Assuming the images URLs are already uploaded to cloud storage
  //         author: userId,
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     toast.success('Blog created successfully');
  //     setLoading(false);
  //   } catch (error) {
  //     toast.error('Error creating blog');
  //     setLoading(false);
  //   }
  // };



// //   if (!isAdmin) return null; 
//   return (
//     <div className={styles.container}>
//       <h2>Create a New Blog</h2>
//       <input
//         type="text"
//         placeholder="Blog Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className={styles.inputField}
//       />
//       <input
//         type="text"
//         placeholder="Blog Heading"
//         value={heading}
//         onChange={(e) => setHeading(e.target.value)}
//         className={styles.inputField}
//       />
//       <input
//         type="text"
//         placeholder="URL Slug"
//         value={urlSlug}
//         onChange={(e) => setUrlSlug(e.target.value)}
//         className={styles.inputField}
//       />
//       <ReactQuill
//         value={content}
//         onChange={setContent}
//         className={styles.textEditor}
//         theme="snow"
//       />
//       <input
//         type="text"
//         placeholder="Meta Description"
//         value={metaDescription}
//         onChange={(e) => setMetaDescription(e.target.value)}
//         className={styles.inputField}
//       />
//       <input
//         type="text"
//         placeholder="Meta Keywords (comma separated)"
//         value={metaKeywords}
//         onChange={(e) => setMetaKeywords(e.target.value)}
//         className={styles.inputField}
//       />

//        <Link className={styles.button} href={`/admin/blog/get`}>Get All Blogs</Link>
//       <button className={styles.button} onClick={handleSubmit} disabled={loading}>
//         {loading ? 'Creating...' : 'Create Blog'}
//       </button>
//     </div>
//   );
// };

// export default BlogEditor; 


// https://miro.medium.com/v2/resize:fit:828/format:webp/1*yBt65HhmARbqZDDJ1McFDg.png

 

// "use client"
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import dynamic from 'next/dynamic';
// import 'react-quill/dist/quill.snow.css';
// import styles from '../../../styles/admin/blog/BlogEditor.module.css';
// import Link from 'next/link';
// import { cloudinaryUploadProduct } from '../../../lib/frontendcloudinary'; // Cloudinary helper function

// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// const BlogEditor = () => {
//   const [title, setTitle] = useState('');
//   const [heading, setHeading] = useState('');
//   const [content, setContent] = useState(''); // For rich text content
//   const [urlSlug, setUrlSlug] = useState('');
//   const [metaDescription, setMetaDescription] = useState('');
//   const [metaKeywords, setMetaKeywords] = useState('');
//   const [images, setImages] = useState([]); // For storing image URLs
//   const [loading, setLoading] = useState(false);
//   const [allImages, setAllImages] = useState([]); // For storing all uploaded images
//   const [showModal, setShowModal] = useState(false); // Modal state

//   const router = useRouter();
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [userId, setUserId] = useState('');

//   useEffect(() => {
//     // Check if the user is an admin
//     const token = localStorage.getItem('token');
//     if (!token) {
//     //   router.push('/login');
//       return;
//     }
//     axios.get('/api/admin/blog/admin', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(({ data }) => {
//       console.log("User data:", data); // Log the user data  
//         setIsAdmin(true);
//         setUserId(data.userId); 
//     })
//     .catch((error) => {
//       console.error('Error verifying admin:', error);
//       toast.error('Failed to verify admin');
//     //   router.push('/login');
//     });
//   }, [router]);


//   const handleImageUpload = async () => {
//     const input = document.createElement('input');
//     input.setAttribute('type', 'file');
//     input.setAttribute('accept', 'image/*');
//     input.click();

//     input.onchange = async () => {
//       const file = input.files[0];
//       if (file) {
//         try {
//           const uploadResult = await cloudinaryUploadProduct(file);
//           const imageUrl = uploadResult.secure_url;
//           setImages((prevImages) => [...prevImages, imageUrl]);
//           toast.success('Image uploaded successfully');
//         } catch (error) {
//           toast.error('Error uploading image');
//         }
//       }
//     };
//   };

//   // Handle blog submission
//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       setLoading(true);
 
//       const { data } = await axios.post(
//         '/api/admin/blog',
//         {
//           title,
//           heading,
//           content,
//           urlSlug,
//           metaDescription,
//           metaKeywords,
//           images, // Assuming the images URLs are already uploaded to cloud storage
//           author: userId,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success('Blog created successfully');
//       setLoading(false);
//     } catch (error) {
//       toast.error('Error creating blog');
//       setLoading(false);
//     }
//   };

//   // Fetch all images from Cloudinary (you may want to implement pagination)
//   const fetchAllImages = async () => {
//     try {
//       const { data } = await axios.get('/api/admin/blog/images'); // Your API endpoint to get all images
//       setAllImages(data.images);
//     } catch (error) {
//       toast.error('Error fetching images');
//     }
//   };


//   const modules = {
//     toolbar: {
//       container: [
//         [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
//         [{size: []}],
//         ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//         [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//         ['link', 'image'], // Include image button
//         ['clean']
//       ],
//     },
//   };

//   const handleContentChange = (content, delta, source, editor) => {
//     const selection = editor.getSelection();
    
//     if (selection) {
//       // Check if pasted content is an image URL
//       const pastedImageUrl = content.match(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i);
//       if (pastedImageUrl) {
//         // Insert the image into the Quill editor at the current selection
//         editor.insertEmbed(selection.index, 'image', pastedImageUrl[0]);
//       }
//     }
  
//     setContent(content); // Update content state
//   };
  
  

  
//   const handleOpenModal = async () => {
//     await fetchAllImages();
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   // Copy image URL to clipboard
//   const handleImageClick = (url) => {
//     navigator.clipboard.writeText(url);
//     toast.success('Image URL copied to clipboard');
//     setShowModal(false);
//   };


//   if (!isAdmin) return null; 

//   return (
//     <div className={styles.container}>
//       <h2>Create a New Blog</h2>
//       <input
//         type="text"
//         placeholder="Blog Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className={styles.inputField}
//       />
//       <input
//         type="text"
//         placeholder="Blog Heading"
//         value={heading}
//         onChange={(e) => setHeading(e.target.value)}
//         className={styles.inputField}
//       />
//       <input
//         type="text"
//         placeholder="URL Slug"
//         value={urlSlug}
//         onChange={(e) => setUrlSlug(e.target.value)}
//         className={styles.inputField}
//       />
//       {/*
//       <ReactQuill
//         value={content}
//         onChange={setContent}
//         className={styles.textEditor}
//         theme="snow"
//       /> */}

//       <ReactQuill
//   value={content}
//   onChange={handleContentChange} // Use the custom change handler
//   modules={modules} // Use the custom toolbar
//   className={styles.textEditor}
//   theme="snow"
// />


//       <input
//         type="text"
//         placeholder="Meta Description"
//         value={metaDescription}
//         onChange={(e) => setMetaDescription(e.target.value)}
//         className={styles.inputField}
//       />
//       <input
//         type="text"
//         placeholder="Meta Keywords (comma separated)"
//         value={metaKeywords}
//         onChange={(e) => setMetaKeywords(e.target.value)}
//         className={styles.inputField}
//       />

//       <button onClick={handleImageUpload} className={styles.button}>
//         Upload Image
//       </button>

//       <button onClick={handleOpenModal} className={styles.button}>
//         Choose Image from Gallery
//       </button>

//       <button className={styles.button} onClick={handleSubmit} disabled={loading}>
//         {loading ? 'Creating...' : 'Create Blog'}
//       </button>

//       {/* Modal for showing all images */}
//       {showModal && (
//         <div className={styles.modal}>
//           <div className={styles.modalContent}>
//             <button onClick={handleCloseModal} className={styles.closeModal}>
//               &times;
//             </button>
//             <h3>Select an Image</h3>
//             <div className={styles.imageGrid}>
//               {allImages.map((image) => (
//                 <img
//                   key={image.public_id}
//                   src={image.secure_url}
//                   alt="Image"
//                   onClick={() => handleImageClick(image.secure_url)}
//                   className={styles.image}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BlogEditor;




// more funsanlity 


"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import dynamic from 'next/dynamic'; 
import styles from '../../../styles/admin/blog/BlogEditor.module.css';
import Link from 'next/link';
import { cloudinaryUploadProduct } from '../../../lib/frontendcloudinary'; // Cloudinary helper function
import { FaTimes } from "react-icons/fa"; 

// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

import 'react-quill/dist/quill.snow.css';
// import ImageResize from 'quill-image-resize-module-react';
// export default dynamic(() => Promise.resolve(BlogEditor), { ssr: false });

const BlogEditor = () => {
  const [title, setTitle] = useState('');
  const [heading, setHeading] = useState('');
  const [content, setContent] = useState(''); // For rich text content
  const [urlSlug, setUrlSlug] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [images, setImages] = useState([]); // For storing image URLs
  const [loading, setLoading] = useState(false);
  const [allImages, setAllImages] = useState([]); // For storing all uploaded images
  const [showModal, setShowModal] = useState(false); // Modal state
  const [keywords, setKeywords] = useState([]);


  const [showClientOnlyContent, setShowClientOnlyContent] = useState(false); 

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
  

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
  
      if (!token) {
        toast.error('Authentication required.');
        router.push('/login');
        return;
      }
  
      // Verify admin status
      axios
        .get('/api/admin/blog/admin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          console.log('User data:', data); // Log the user data
          setIsAdmin(true);
          setUserId(data.userId);
        })
        .catch((error) => {
          // console.error('Error verifying admin:', error);
          // toast.error('Failed to verify admin');
          // router.push('/login');

          const errorMessage =
        error.response?.data?.message || 'Failed to verify admin';
      toast.error(errorMessage);
      console.error('Admin verification error:', error.response || error);
      router.push('/login');

        });
    }
  }, [router]);
  
  useEffect(() => {
    setShowClientOnlyContent(true); // Set to true once client-side rendering is active
  }, []);
  
  if (!showClientOnlyContent || !isAdmin) {
    return null;
  }

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const uploadResult = await cloudinaryUploadProduct(file);
          const imageUrl = uploadResult.secure_url;
          setImages((prevImages) => [...prevImages, imageUrl]);
          toast.success('Image uploaded successfully');
        } catch (error) {
          toast.error('Error uploading image');
        }
      }
    };
  };



  const validateForm = () => {
    if (!title.trim()) {
      toast.error('Title is required.');
      return false;
    }
    if (!content.trim()) {
      toast.error('Content is required.');
      return false;
    }
    if (!urlSlug.trim()) {
      toast.error('URL slug is required.');
      return false;
    }
    if (!metaDescription.trim()) {
      toast.error('Meta description is required.');
      return false;
    }
    return true;
  };

  
  
  // Handle blog submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const token = localStorage.getItem('token');
      setLoading(true);
 
      const { data } = await axios.post(
        '/api/admin/blog',
        {
          title,
          heading,
          content,
          urlSlug,
          metaDescription,
          metaKeywords,
          images, // Assuming the images URLs are already uploaded to cloud storage
          author: userId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Blog created successfully');
      setLoading(false);
    } catch (error) {

      const errorMessage =
      error.response?.data?.message || 'Unexpected error occurred';
    toast.error(`Error: ${errorMessage}`);
    console.error('Blog creation error:', error.response || error);
      // toast.error('Error creating blog');
      // setLoading(false);
    }
    finally {
      setLoading(false);
    }
  };



  // Fetch all images from Cloudinary (you may want to implement pagination)
  const fetchAllImages = async () => {
    try {
      const { data } = await axios.get('/api/admin/blog/images'); // Your API endpoint to get all images
      setAllImages(data.images);
    } catch (error) {
      // toast.error('Error fetching images');
      const errorMessage =
      error.response?.data?.message || 'Failed to fetch images';
    toast.error(`Error: ${errorMessage}`);
    console.error('Fetching images error:', error.response || error);
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
      ["link", "image",],
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
    "image",
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
  
  

  
  const handleOpenModal = async () => {
    await fetchAllImages();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Copy image URL to clipboard
  const handleImageClick = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Image URL copied to clipboard');
    setShowModal(false);
  };



  const handleAddKeyword = () => {
    if (metaKeywords.trim() && !keywords.includes(metaKeywords.trim())) {
      setKeywords((prevKeywords) => [...prevKeywords, metaKeywords.trim()]);
      setMetaKeywords(""); // Clear input field
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };


 
  
  return (
    <div className={styles.container}>
      <h2>Create a New Blog</h2>
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.inputField}
      />
      <input
        type="text"
        placeholder="Blog small Description"
        value={heading}
        onChange={(e) => setHeading(e.target.value)}
        className={styles.inputField}
      />
      <input
        type="text"
        placeholder="URL Slug 'unice id'"
        value={urlSlug}
        onChange={(e) => setUrlSlug(e.target.value)}
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


      <input
        type="text"
        placeholder="Meta Description"
        value={metaDescription}
        onChange={(e) => setMetaDescription(e.target.value)}
        className={styles.inputField}
      />

      <div className={styles.keywordContainer}>
      <input
        type="text"
        placeholder="Meta Keywords (comma separated)"
        value={metaKeywords}
        onChange={(e) => setMetaKeywords(e.target.value)}
        onKeyPress={handleKeyPress}
        className={styles.inputField}
      />
      <button onClick={handleAddKeyword} className={styles.addButton}>
        Add Keyword
      </button>

      <div className={styles.keywordList}>
        {keywords.map((keyword, index) => (
          <div key={index} className={styles.keywordItem}>
            <span>{keyword}</span>
            <FaTimes
              className={styles.removeIcon}
              onClick={() => handleRemoveKeyword(keyword)}
            />
          </div>
        ))}
      </div>
    </div>


  

      <button className={styles.button} onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating...' : 'Create Blog'}
      </button>

      {/* Modal for showing all images */}

    </div>
  );
};


// const BlogEditor = dynamic(() => Promise.resolve(BlogEditor), { ssr: false });
// export default BlogEditor;
export default dynamic(() => Promise.resolve(BlogEditor), { ssr: false });







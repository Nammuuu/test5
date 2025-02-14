

 
import React from 'react'
import SettingsPage from "../../admin/settings/page"
import PageEditor from "../../admin/components/components/PageData"
import BannerPage from "../../admin/components/HomeBanners/Bnner"
{/* <SettingsPage /> */}
const mail = () => {
  return (
    <div>
      <BannerPage />
      {/* <PageEditor /> */}
    

    </div>
  )
}

export default mail



// import React from 'react'
// import ReviewsAdminPanel from "../../admin/components/components/Review"
// import ThamwSettingsPage from "../../admin/components/components/Thamesatting"
// const mail = () => {
//   return (
//     <div>
//     <ThamwSettingsPage />
    //  <ReviewsAdminPanel />
//     </div>
//   )
// }

// export default mail




// "use client";

// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const UpdatePageData = () => {
//   const [aboutPage, setAboutPage] = useState([
//     { title: "", description: "", smallTitle: "", smallDescription: "" },
//   ]);

//   // Fetch existing data on component mount
//   useEffect(() => {
//     const fetchAboutPageData = async () => {
//       try {
//         const response = await axios.get("/api/pagesdata?section=aboutpage");
//         if (response.status === 200) {
//           setAboutPage(response.data.aboutpage || []); // Populate the state with fetched data
//         } else {
//           console.error("Failed to fetch about page data.");
//         }
//       } catch (error) {
//         console.error("Error fetching about page data:", error);
//       }
//     };

//     fetchAboutPageData();
//   }, []); // Empty dependency array ensures this runs only once when the component mounts

//   const handleFieldChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedAboutPage = [...aboutPage];
//     updatedAboutPage[index] = { ...updatedAboutPage[index], [name]: value };
//     setAboutPage(updatedAboutPage);
//   };

//   const addNewField = () => {
//     setAboutPage([
//       ...aboutPage,
//       { title: "", description: "", smallTitle: "", smallDescription: "" },
//     ]);
//   };

//   const removeField = (index) => {
//     const updatedAboutPage = aboutPage.filter((_, i) => i !== index);
//     setAboutPage(updatedAboutPage);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.error("No token found in local storage");
//       toast.error("No token found. Please log in again.");
//       return;
//     }

//     try {
//       const response = await axios.put(
//         "/api/admin/pagedata",
//         {
//           section: "aboutpage",
//           updates: aboutPage,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         toast.success("Data updated successfully!");
//       } else {
//         throw new Error("Failed to update data.");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Error updating data.");
//     }
//   };

//   return (
//     <div>
//       <h1>Update About Page</h1>
//       <form onSubmit={handleSubmit}>
//         {aboutPage.map((field, index) => (
//           <div key={index} style={{ marginBottom: "1rem" }}>
//             <input
//               type="text"
//               name="title"
//               value={field.title}
//               onChange={(e) => handleFieldChange(index, e)}
//               placeholder="Title"
//             />
//             <input
//               type="text"
//               name="description"
//               value={field.description}
//               onChange={(e) => handleFieldChange(index, e)}
//               placeholder="Description"
//             />
//             <input
//               type="text"
//               name="smallTitle"
//               value={field.smallTitle}
//               onChange={(e) => handleFieldChange(index, e)}
//               placeholder="Small Title"
//             />
//             <input
//               type="text"
//               name="smallDescription"
//               value={field.smallDescription}
//               onChange={(e) => handleFieldChange(index, e)}
//               placeholder="Small Description"
//             />
//             <button type="button" onClick={() => removeField(index)}>
//               Remove
//             </button>
//           </div>
//         ))}
//         <button type="button" onClick={addNewField}>
//           Add New Field
//         </button>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default UpdatePageData;






// import React, { useState, useRef } from 'react';
// import axios from 'axios';

// const StudentProfile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [profilePic, setProfilePic] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null); // <-- for backend upload
//   const [notification, setNotification] = useState(null);
//   const fileInputRef = useRef();

//   // Toggle edit/view mode
//   const handleEditClick = () => setIsEditing(true);
//   const handleCancelEdit = () => setIsEditing(false);

//   // Handle profile picture upload preview
//   const handleProfilePicChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file); // <-- store file for upload
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (ev) => setProfilePic(ev.target.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   // Show notification
//   const showNotification = (message, type) => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 5000);
//   };

//   // Handle save (submit)
//   const handleSave = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       showNotification('Please select an image.', 'error');
//       return;
//     }
//     const formData = new FormData();
//     formData.append('profileImage', selectedFile);

//     try {
//       await axios.post('http://localhost:8081/api/student-profile/update', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       showNotification('Profile picture saved!', 'success');
//       setIsEditing(false);
//     } catch (err) {
//       showNotification('Upload failed.', 'error');
//     }
//   };

//   return (
//     <div>
//       {notification && (
//         <div className={`notification ${notification.type}`}>{notification.message}</div>
//       )}

//       {!isEditing ? (
//         <div id="profileDetails">
//           <div className="profile-pic">
//             {profilePic ? (
//               <img src={profilePic} alt="Profile" />
//             ) : (
//               <div className="no-pic">No Pic</div>
//             )}
//           </div>
//           <button id="editProfileBtn" onClick={handleEditClick}>Edit Profile</button>
//         </div>
//       ) : (
//         <div id="editProfileForm">
//           <form onSubmit={handleSave}>
//             <input
//               type="file"
//               id="profile-upload"
//               ref={fileInputRef}
//               accept="image/*"
//               onChange={handleProfilePicChange}
//             />
//             <button type="submit" id="saveProfileBtn">Save</button>
//             <button type="button" id="cancelEditBtn" onClick={handleCancelEdit}>Cancel</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentProfile;
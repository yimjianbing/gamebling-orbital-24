import React, { useState, useContext } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { storage, db } from '../../auth/firebase-config';
import './ProfilePicUpload.css';
import { AuthContext } from '../../context/AuthContext';

const ProfilePicUpload = () => {
  const [file, setFile] = useState(null);
  const { currentUserLoggedIn } = useContext(AuthContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const path = `profilePics/${currentUserLoggedIn.uid}`;

    const storageRef = ref(storage, `${path}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    const userDoc = doc(db, 'usersPicture', currentUserLoggedIn.uid.toString().substring(0, 5));
    await setDoc(userDoc, { profilePic: downloadURL }, { merge: true });

    alert('Profile picture uploaded successfully!');
  };

  return (
    <div>
      <h3>Change your profile picture </h3>
      <h3>by uploading a new picture below!</h3>
      <br/>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ProfilePicUpload;
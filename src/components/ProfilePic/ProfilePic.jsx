import React, { useEffect, useState } from 'react';
import { getProfilePicUrl } from '../../utils/profpicretriever'; // Adjust the import path as needed
import './ProfilePic.css'; // Adjust the import path as needed
import defaultAvatar from '../../assets/profile/default profile avatar.svg';

const ProfilePic = ({ filePath, size }) => {
  const [profilePicUrl, setProfilePicUrl] = useState('');

    useEffect(() => {
        if (filePath && filePath !== '') {
          const fetchProfilePic = async () => {
            try {
              const url = await getProfilePicUrl(filePath);
              setProfilePicUrl(url);
            } catch (error) {
              console.error("Error fetching profile picture URL:", error);
              setProfilePicUrl(defaultAvatar); // Fallback to default avatar on error
            }
          };
          fetchProfilePic();
        }
      }, [filePath]);

  const handleImgError = (e) => {
        e.target.src = "../../assets/profile/default profile avatar.svg"; // Path to your default image
    };

    return (
        <div className='filler'>
          {filePath && filePath !== '' ? (
            <div
              className={`profilePic ${size}`}
              style={{ backgroundImage: `url(${profilePicUrl})` }}
            ></div>
          ) : (
            <img
              className="profilePic"
              src={defaultAvatar}
              alt="default profile avatar"
              onError={handleImgError}
            />
          )}
        </div>
      );
};

export default ProfilePic;
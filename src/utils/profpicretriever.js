import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../auth/firebase-config'; // Adjust the import path as needed

export const getProfilePicUrl = async (filePath) => {
  const storageRef = ref(storage, filePath);
  const url = await getDownloadURL(storageRef);
  return url;
};
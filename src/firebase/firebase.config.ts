// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyD0a-s0onet8A37AFuF4ZYuNrhow4e-J8k',
  authDomain: 'bachgiaphat-new.firebaseapp.com',
  projectId: 'bachgiaphat-new',
  storageBucket: 'bachgiaphat-new.appspot.com',
  messagingSenderId: '831689366512',
  appId: '1:831689366512:web:f81486110a02fc48f15b35',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

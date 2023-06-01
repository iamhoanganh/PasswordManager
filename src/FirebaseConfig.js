// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATjfJYAWDYVD_Rl15XeRSq2M32o-1JgH4",
  authDomain: "password-manager-5b64f-eea4e.firebaseapp.com",
  projectId: "password-manager-5b64f",
  storageBucket: "password-manager-5b64f.appspot.com",
  messagingSenderId: "707805617552",
  appId: "1:707805617552:web:73cdb6f5d7c7a5413ce715",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

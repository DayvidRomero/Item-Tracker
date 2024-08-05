// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmrBf5yjdqD_SbvppzJRcs249DuKT54RM",
  authDomain: "pantry-tracker-b860d.firebaseapp.com",
  projectId: "pantry-tracker-b860d",
  storageBucket: "pantry-tracker-b860d.appspot.com",
  messagingSenderId: "722161292893",
  appId: "1:722161292893:web:dcbc8aed5ecdd8426a9fb4",
  measurementId: "G-D4CCKX3QGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {firestore};
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACRM8fAxeLQ-aap4dNxiKCmIkCBQOZ6tU",
  authDomain: "pantry-tracker-bf6fe.firebaseapp.com",
  projectId: "pantry-tracker-bf6fe",
  storageBucket: "pantry-tracker-bf6fe.appspot.com",
  messagingSenderId: "281238878624",
  appId: "1:281238878624:web:edcc23fdb6e31f641a4cc5",
  measurementId: "G-XY294RW74K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};
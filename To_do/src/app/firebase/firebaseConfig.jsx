import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAvl10EUR5gj4yq8-fxY-CItycrlyhA6_U",
  authDomain: "to-do-list-afad3.firebaseapp.com",
  projectId: "to-do-list-afad3",
  storageBucket: "to-do-list-afad3.firebasestorage.app",
  messagingSenderId: "25963436575",
  appId: "1:25963436575:web:8920c1058d0ca4ed6fd32a",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

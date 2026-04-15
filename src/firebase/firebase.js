// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8KayE8oesjd8raRrAfrDWe35lzxw0rpE",
  authDomain: "reactuit.firebaseapp.com",
  projectId: "reactuit",
  storageBucket: "reactuit.firebasestorage.app",
  messagingSenderId: "878831818113",
  appId: "1:878831818113:web:91ea1ce1c901d97e268480",
  measurementId: "G-0GTEZWH7HE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

const analytics = getAnalytics(app);

export { db }
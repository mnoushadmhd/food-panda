// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsgVcx9YRsaAvKe3n-oGOywlppNMOdV4M",
  authDomain: "eateryrep.firebaseapp.com",
  projectId: "eateryrep",
  storageBucket: "eateryrep.appspot.com",
  messagingSenderId: "426715379672",
  appId: "1:426715379672:web:cfa2a48fc70ab71ad864ad",
  measurementId: "G-0X62LRQT7X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
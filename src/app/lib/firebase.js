// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBY423g5dqK_9uInMes9q-Ro2hpQ8MvkOw",
    authDomain: "zap-shift-6ffc1.firebaseapp.com",
    projectId: "zap-shift-6ffc1",
    storageBucket: "zap-shift-6ffc1.firebasestorage.app",
    messagingSenderId: "641409080291",
    appId: "1:641409080291:web:5325c08c879cbe4c169ed6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
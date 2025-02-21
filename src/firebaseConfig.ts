// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.API_KEY;

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: "fir-ecommerce-app-4b633.firebaseapp.com",
    projectId: "fir-ecommerce-app-4b633",
    storageBucket: "fir-ecommerce-app-4b633.firebasestorage.app",
    messagingSenderId: "695649952219",
    appId: "1:695649952219:web:4444e19db8d3b7e95207fe",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db = getFirestore(app);


export  { auth, db };
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDJC45bkju3DUARcefHKF7-9e-hUsLRets",
  authDomain: "takip-sistemi-jlej4.firebaseapp.com",
  projectId: "takip-sistemi-jlej4",
  storageBucket: "takip-sistemi-jlej4.firebasestorage.app",
  messagingSenderId: "250028828318",
  appId: "1:250028828318:web:965696395b5e9dbadb7d8f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
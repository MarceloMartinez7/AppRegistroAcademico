import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDPbzzeDlscEq2W4T1ViQO1AkjMvnG5SmM",
    authDomain: "proyectoregistro-15e7b.firebaseapp.com",
    projectId: "proyectoregistro-15e7b",
    storageBucket: "proyectoregistro-15e7b.firebasestorage.app",
    messagingSenderId: "548898697353",
    appId: "1:548898697353:web:8dce45d66e065511679658",
    measurementId: "G-1RKEDVH8DZ"
  };

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
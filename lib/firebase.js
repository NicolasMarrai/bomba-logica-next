import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAhOJiAeh23JuMmY-oMeFj34uPa36xF5oA",
  authDomain: "bomba-logica-e4fbf.firebaseapp.com",
  databaseURL: "https://bomba-logica-e4fbf-default-rtdb.firebaseio.com",
  projectId: "bomba-logica-e4fbf",
  storageBucket: "bomba-logica-e4fbf.firebasestorage.app",
  messagingSenderId: "1093204166249",
  appId: "1:1093204166249:web:b426e1cd0d8b76680bc4f8"
};

// Inicialize apenas o Database (não usaremos Analytics)
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
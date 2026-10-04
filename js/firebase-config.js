import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhm-T5p4l4-Tgg79apq8OATQkKrAoJ-e0",
  authDomain: "web-perpustakaan-e3ae8.firebaseapp.com",
  projectId: "web-perpustakaan-e3ae8",
  storageBucket: "web-perpustakaan-e3ae8.firebasestorage.app",
  messagingSenderId: "960845187515",
  appId: "1:960845187515:web:9333b70d1052fc66435c9e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhm-T5p4l4-Tgg79apq8OATQkKrAoJ-e0",
  authDomain: "web-perpustakaan-e3ae8.firebaseapp.com",
  projectId: "web-perpustakaan-e3ae8",
  storageBucket: "web-perpustakaan-e3ae8.firebasestorage.app",
  messagingSenderId: "960845187515",
  appId: "1:960845187515:web:9333b70d1052fc66435c9e"
};

// Mencegah inisialisasi ulang aplikasi Firebase jika berkas dimuat beberapa kali
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Endpoint Firebase Data Connect (Cloud SQL GraphQL)
export const GRAPHQL_ENDPOINT = "https://us-central1-web-perpustakaan-e3ae8.cloudfunctions.net/dataConnect";

/**
 * Mengirim permintaan GraphQL ke endpoint Firebase Data Connect
 * @param {string} query 
 * @param {object} variables 
 * @returns {Promise<object>}
 */
export async function fetchGraphQL(query, variables = {}) {
  try {
    const headers = {
      "Content-Type": "application/json"
    };

    // Menyertakan ID Token Firebase secara otomatis jika pengguna dalam status masuk (login)
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables })
    });

    // Memeriksa status HTTP sebelum membaca isi respons
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    // Menampilkan peringatan di konsol jika server GraphQL mengembalikan array galat
    if (result.errors) {
      console.warn("GraphQL Result Errors:", result.errors);
    }

    return result;
  } catch (error) {
    console.error("GraphQL Fetch Error:", error);
    throw error;
  }
}
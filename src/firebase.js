import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAq6xuAO6i2DFvqSCKv9O-3MXN7oH6eocw",
    authDomain: "projekt-6-ee0ec.firebaseapp.com",
    projectId: "projekt-6-ee0ec",
    storageBucket: "projekt-6-ee0ec.appspot.com",
    messagingSenderId: "48165191539",
    appId: "1:48165191539:web:d6a2907d08cea2cb12cf06",
    measurementId: "G-6G2F531HD4",
    databaseURL:
        "https://projekt-6-ee0ec-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

export { auth, provider, database };

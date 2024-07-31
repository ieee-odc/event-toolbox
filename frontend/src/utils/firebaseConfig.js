
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBx9EzZR9YrHe_t1LlcRpxm1BWgcxjdzE8",
    authDomain: "event-tool-box-1720171944535.firebaseapp.com",
    projectId: "event-tool-box-1720171944535",
    storageBucket: "event-tool-box-1720171944535.appspot.com",
    messagingSenderId: "755611250003",
    appId: "1:755611250003:web:a4eca7670cc0961b6ac5a6",
    measurementId: "G-EZD217CS9X"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, googleProvider, storage };

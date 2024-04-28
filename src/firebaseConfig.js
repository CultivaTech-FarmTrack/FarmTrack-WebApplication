import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBPfL4bzcymVX-2Sj1puDBEZAMg3h2wiI0",
    authDomain: "agripure-678b4.firebaseapp.com",
    projectId: "agripure-678b4",
    storageBucket: "agripure-678b4.appspot.com",
    messagingSenderId: "231712564171",
    appId: "1:231712564171:web:b0507723031a58eedb8c4e",
    measurementId: "G-CCCV7VB3E0"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
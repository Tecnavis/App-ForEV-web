import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyARf6Of6YPvTIvQLYECPGGHofzLYxJjN4k",
    authDomain: "forev-d153a.firebaseapp.com",
    projectId: "forev-d153a",
    storageBucket: "forev-d153a.appspot.com",
    messagingSenderId: "538253414648",
    appId: "1:538253414648:web:7086e9dc0158398b7aab0d",
    measurementId: "G-CHE78KHV79"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app }
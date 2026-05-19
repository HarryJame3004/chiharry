import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvoETeArv_-9_ja8yC_AaBAxgoAShrn94",
  authDomain: "chi-harry-german.firebaseapp.com",
  projectId: "chi-harry-german",
  storageBucket: "chi-harry-german.firebasestorage.app",
  messagingSenderId: "172444544554",
  appId: "1:172444544554:web:e97b62d86af3950a7bdd53",
  measurementId: "G-5L9ENH57NW"
};

// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo và export các dịch vụ để sử dụng ở các file khác
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
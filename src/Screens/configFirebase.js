import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore'; 
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBv4e9qwh1rbdVrrZq4vh9ysgpAggJgGMY",
  authDomain: "asmreact-126fe.firebaseapp.com",
  projectId: "asmreact-126fe",
  storageBucket: "asmreact-126fe.appspot.com",
  messagingSenderId: "231481421846",
  appId: "1:231481421846:web:0553a77c693ebff4d8c537",
  measurementId: "G-EFNZ26Z2VG",
  databaseURL: "https://asmreact-126fe-default-rtdb.firebaseio.com" 
};

// Khởi tạo Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export { auth,database, storage, firestore };


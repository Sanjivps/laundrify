import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcZsI-pR12kgc9fy1hB8y8l3abTdOEtMQ",
  authDomain: "laundrymachine-f9fdf.firebaseapp.com",
  databaseURL: "https://laundrymachine-f9fdf-default-rtdb.firebaseio.com",
  projectId: "laundrymachine-f9fdf",
  storageBucket: "laundrymachine-f9fdf.appspot.com",
  messagingSenderId: "817204874747",
  appId: "1:817204874747:ios:01cc45179da79874c7cf5e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { app, database }; 
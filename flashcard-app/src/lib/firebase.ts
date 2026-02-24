// Temporary Firebase configuration - will be replaced when Firebase installs properly
import * as FirebaseStub from './firebase-stub';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "fluentge.firebaseapp.com", 
  projectId: "fluentge",
  storageBucket: "fluentge.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (stubbed for now)
const app = FirebaseStub.initializeApp();

// Initialize Firebase Authentication and get a reference to the service
export const auth = FirebaseStub.getAuth();

// Initialize Cloud Firestore and get a reference to the service
export const db = FirebaseStub.getFirestore();

// Google Auth Provider
export const googleProvider = new FirebaseStub.GoogleAuthProvider();

export default app;
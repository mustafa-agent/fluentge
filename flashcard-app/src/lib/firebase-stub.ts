// Temporary stub for Firebase while it installs
// This will be replaced once Firebase is properly installed

export const auth = null;
export const db = null;
export const googleProvider = null;

// Stub functions
export const initializeApp = () => null;
export const getAuth = () => null;
export const getFirestore = () => null;
export const GoogleAuthProvider = class {};

export const signInWithEmailAndPassword = () => Promise.reject('Firebase not loaded');
export const createUserWithEmailAndPassword = () => Promise.reject('Firebase not loaded');
export const signInWithPopup = () => Promise.reject('Firebase not loaded');
export const signOut = () => Promise.reject('Firebase not loaded');
export const onAuthStateChanged = () => () => {};
export const updateProfile = () => Promise.reject('Firebase not loaded');

export const collection = () => null;
export const doc = () => null;
export const getDoc = () => Promise.reject('Firebase not loaded');
export const setDoc = () => Promise.reject('Firebase not loaded');
export const updateDoc = () => Promise.reject('Firebase not loaded');
export const getDocs = () => Promise.reject('Firebase not loaded');
export const query = () => null;
export const where = () => null;
export const orderBy = () => null;
export const Timestamp = { fromDate: (d: Date) => d, now: () => new Date() };

export type User = any;

export default null;
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: "fake-api-key",
  authDomain: "localhost",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  appId: "demo-app-id",
};

const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT;
const AUTH_PORT = import.meta.env.VITE_AUTH_PORT;
const FIRESTORE_PORT = import.meta.env.VITE_FIRESTORE_PORT;
const STORAGE_PORT = import.meta.env.VITE_STORAGE_PORT;
const FUNCTIONS_PORT = import.meta.env.VITE_FUNCTIONS_PORT;

const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

if (ENVIRONMENT === "production") {
  connectAuthEmulator(auth, import.meta.env.VITE_AUTH_URL);
  connectFirestoreEmulator(db, import.meta.env.VITE_FIRESTORE_URL, 80);
  connectStorageEmulator(storage, import.meta.env.VITE_STORAGE_URL, 80);
  connectFunctionsEmulator(functions, import.meta.env.VITE_FUNCTIONS_URL, 80);
} else {
  connectAuthEmulator(auth, `http://localhost:${AUTH_PORT}`);
  connectFirestoreEmulator(db, "localhost", Number(FIRESTORE_PORT));
  connectStorageEmulator(storage, "localhost", Number(STORAGE_PORT));
  connectFunctionsEmulator(functions, "localhost", Number(FUNCTIONS_PORT));
}

export { auth, db, storage, functions };

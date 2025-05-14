import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

export default defineNuxtPlugin(async () => {
  const firebaseConfig = {
    apiKey: "AIzaSyCbVoA60aHWA8atSBK9nJ0eerTxb_6_g2I",
    authDomain: "tvmaze-6671d.firebaseapp.com",
    projectId: "tvmaze-6671d",
    storageBucket: "tvmaze-6671d.appspot.com",
    messagingSenderId: "70397078832",
    appId: "1:70397078832:web:c1b8d804aaf97a15ac6cf5",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  await setPersistence(auth, browserLocalPersistence);

  return {
    provide: {
      auth: auth,
      googleProvider: googleProvider,
    },
  };
});

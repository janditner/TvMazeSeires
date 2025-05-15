import {
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
} from "firebase/auth";
import { useToast } from "vue-toastification";

const toast = useToast();
const TOAST_TIMER = 2000;

export const signinUser = async (auth, email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    localStorage.setItem(
      "user",
      JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split("@")[0],
        avatar: user.photoURL || "https://www.gravatar.com/avatar/?d=mp",
        joinedDate: new Date(user.metadata.creationTime).toLocaleDateString(),
      })
    );
    return user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async (auth, googleProvider) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (!user.email.endsWith("@inova.si")) {
      await user.delete();
      toast.error("Only @inova.si email addresses are allowed.", {
        position: "bottom-right",
        timeout: TOAST_TIMER,
      });
      throw new Error("Only @inova.si email addresses are allowed.");
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split("@")[0],
        avatar: user.photoURL || "https://www.gravatar.com/avatar/?d=mp",
        joinedDate: new Date(user.metadata.creationTime).toLocaleDateString(),
      })
    );

    return user;
  } catch (error) {
    throw error;
  }
};

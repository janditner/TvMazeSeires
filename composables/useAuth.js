import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";

export const useAuth = () => {
  const user = ref(null);
  const isAuthenticated = ref(false);

  onMounted(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        user.value = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
          avatar:
            firebaseUser.photoURL || "https://www.gravatar.com/avatar/?d=mp",
          joinedDate: new Date(
            firebaseUser.metadata.creationTime
          ).toLocaleDateString(),
        };
        isAuthenticated.value = true;
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(user.value));
      } else {
        user.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem("user");
      }
    });
  });
  const logout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      user.value = null;
      isAuthenticated.value = false;
      localStorage.removeItem("user");
      localStorage.removeItem("favorites");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { user, isAuthenticated, logout };
};

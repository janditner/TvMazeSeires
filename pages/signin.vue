<template>
  <NuxtLayout>
    <form @submit="handleSignin">
      <div class="flex justify-center">
        <div class="text-center mt-16 bg-gray-900 py-5 w-120 rounded-xl">
          <h1 class="text-2xl text-white">Sign in</h1>
          <USeparator />
          <div class="mt-4">
            <label for="email" class="text-white">Email:</label><br />
            <input
              v-model="email"
              type="text"
              placeholder="Email"
              class="mt-2 mb-4 pl-4 bg-gray-500 h-8 w-80 rounded-lg text-white outline-none"
            /><br />
            <label for="password" class="text-white">Password:</label><br />
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="mt-2 pl-4 bg-gray-500 h-8 w-80 rounded-lg text-white outline-none"
            />
            <br />
            <button
              type="submit"
              class="mt-4 text-white py-2 px-4 rounded-xl bg-blue-600 cursor-pointer hover:bg-red-400"
            >
              Sign in
            </button>
            <div class="flex justify-center">
              <button
                type="button"
                @click="handleGoogleSignIn"
                class="mt-4 flex items-center justify-center gap-2 text-white py-2 px-4 rounded-xl bg-blue-600 cursor-pointer hover:bg-red-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
            <p class="mt-4 text-white">
              Don't have an account yet?
              <a href="register" class="cursor-pointer hover:underline"
                >Create one here</a
              >
            </p>
          </div>
        </div>
      </div>
    </form>
  </NuxtLayout>
</template>

<script setup>
import USeparator from "~/components/USeparator.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signinUser, signInWithGoogle } from "~/utils/signin";
import { useToast } from "vue-toastification";
import { useNuxtApp } from "#app";

const email = ref("");
const password = ref("");
const router = useRouter();
const toast = useToast();
const { $auth, $googleProvider } = useNuxtApp();

const handleSignin = async (e) => {
  e.preventDefault();
  try {
    await signinUser(email.value, password.value);
    toast.success("User signed in successfully");
    router.push("/");
  } catch (err) {
    console.error(err.code, err.message);
    toast.error("Incorrect email or password");
  }
};

const handleGoogleSignIn = async () => {
  try {
    await signInWithGoogle($auth, $googleProvider);
    toast.success("Signed in with Google successfully");
    router.push("/");
  } catch (error) {
    console.error(error.code, error.message);
    toast.error("Failed to sign in with Google");
  }
};
</script>

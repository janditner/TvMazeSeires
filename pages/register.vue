<template>
  <NuxtLayout>
    <form @submit="handleRegister">
      <div class="flex justify-center">
        <div class="text-center mt-16 bg-gray-900 py-5 w-120 rounded-xl">
          <h1 class="text-xl text-white">Create account</h1>
          <USeparator />
          <div class="mt-4">
            <label for="email" class="text-white">Email:</label><br />
            <input
              v-model="email"
              type="text"
              placeholder="Email"
              class="mt-2 pl-4 bg-gray-500 h-8 w-80 rounded-lg text-white outline-none"
            /><br /><br />
            <label for="password" class="text-white">Password:</label><br />
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="mt-2 pl-4 bg-gray-500 h-8 w-80 rounded-lg text-white outline-none"
            /><br /><br />
            <button
              type="submit"
              class="text-white py-2 px-4 rounded-xl bg-blue-600 cursor-pointer hover:bg-red-400"
            >
              Register
            </button>
            <p class="mt-4 text-white">
              Already have an acount?
              <a href="signin" class="cursor-pointer hover:underline"
                >Sign in here</a
              >
            </p>
          </div>
        </div>
      </div>
    </form>
  </NuxtLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { registerUser } from "~/utils/register";
import USeparator from "~/components/USeparator.vue";
import { useToast } from "vue-toastification";

const email = ref("");
const password = ref("");
const router = useRouter();
const toast = useToast();
const REDIRECT_TO_LOGIN_TIME = 2000;

const handleRegister = async (e) => {
  e.preventDefault();
  if (!email.value.endsWith("inova.si")) {
    toast.error("Only @inova.si emails are allowed");
    return;
  }
  try {
    await registerUser(email.value, password.value);
    toast.success("Registered successfully! Redirecting to sign in...", {
      timeout: REDIRECT_TO_LOGIN_TIME,
      onClose: () => {
        router.push("signin");
      },
    });
  } catch (err) {
    toast.error(err.message);
  }
};
</script>

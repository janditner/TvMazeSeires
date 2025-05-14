<template>
  <div class="bg-gray-800 min-h-screen text-white p-8">
    <div v-if="errorMsg" class="text-red-500 text-center mt-10 text-xl">
      {{ errorMsg }}
    </div>
    <div v-if="user" class="max-w-6xl mx-auto pt-4">
      <h1 class="text-4xl font-bold mb-4">Account Information</h1>
      <div class="flex flex-col md:flex-row gap-8 items-center">
        <div class="md:w-1/3 flex flex-col items-center">
          <img
            :src="user.avatar"
            :alt="user.name"
            class="rounded-full w-32 h-32 object-cover mb-4"
          />
          <button
            @click="handleLogout"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full cursor-pointer"
          >
            Logout
          </button>
        </div>
        <div class="md:w-2/3">
          <h2 class="text-2xl font-semibold mb-4">{{ user.name }}</h2>
          <div class="space-y-4">
            <div>
              <p class="text-gray-400">Email:</p>
              <p class="text-lg">{{ user.email }}</p>
            </div>
            <div>
              <p class="text-gray-400">Member since:</p>
              <p class="text-lg">{{ user.joinedDate }}</p>
            </div>
            <div>
              <p class="text-gray-400">User ID:</p>
              <p class="text-sm text-gray-300">{{ user.uid }}</p>
            </div>
          </div>

          <div class="mt-8">
            <h3 class="text-xl font-semibold mb-4">Favorite Series</h3>
            <div
              v-if="favorites.length > 0"
              class="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              <NuxtLink
                v-for="series in favorites"
                :key="series.id"
                :to="`/series/${series.id}`"
                class="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition"
              >
                <img
                  :src="
                    series.image?.medium ||
                    'https://via.placeholder.com/210x295?text=No+Image'
                  "
                  alt="Series image"
                  class="w-16 h-20 object-cover rounded-md mb-2"
                />
                <h4 class="font-medium">{{ series.name }}</h4>
                <p class="text-sm text-gray-400">
                  {{ series.rating?.average || "N/A" }}/10
                </p>
              </NuxtLink>
            </div>
            <p v-else class="text-gray-400">
              You haven't added any favorites yet.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center mt-10">
      <p class="text-lg mb-4">Please sign in to view your account details.</p>
      <NuxtLink
        to="/signin"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full cursor-pointer inline-block"
      >
        Sign In
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuth } from "~/composables/useAuth";
import { useFavorites } from "~/composables/useFavorites";

const router = useRouter();
const toast = useToast();
const { user, isAuthenticated, logout } = useAuth();
const { favorites } = useFavorites();
const TOAST_DURATION = 2000;

const errorMsg = ref("");

onMounted(() => {
  if (!isAuthenticated.value) {
    //errorMsg.value = "Please sign in to view your account.";
  }
});

const handleLogout = () => {
  logout();
  router.push("/");
  toast.success("You have been logged out successfully!", {
    position: "bottom-right",
    timeout: TOAST_DURATION,
  });
};
</script>

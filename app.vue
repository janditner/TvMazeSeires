<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <NuxtLayout>
    <nav class="sticky top-0 z-50 relative">
      <header
        class="bg-gray-900 text-white p-4 flex justify-between items-center"
      >
        <a
          href="/"
          class="ml-2 hover:bg-gray-600 cursor-pointer rounded-full p-2"
        >
          <h1 class="text-base lg:text-xl">TvMaze series</h1>
        </a>
        <!-- Mobile menu toggle -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="sm:hidden p-2"
        >
          <svg
            class="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <!-- Mobile drawer -->
        <div
          v-if="isMobileMenuOpen"
          class="sm:hidden fixed top-0 left-0 h-full w-80 bg-gray-800 p-4 z-50"
        >
          <button @click="isMobileMenuOpen = false" class="text-white mb-4">
            Close ✖
          </button>
          <!-- Mobile search with submit -->
          <div class="flex gap-2 mb-7 mt-2">
            <div class="relative w-full">
              <input
                id="mobileSearch"
                autocomplete="off"
                v-model="search.query"
                @input="handleInput"
                placeholder="Search series"
                class="w-full bg-gray-600 rounded px-4 py-2 text-white rounded-full outline-none pr-8 focus:bg-gray-500"
              />
              <button
                v-if="search.query"
                @click="clearSearch"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-sm mr-1"
              >
                X
              </button>
            </div>

            <button
              @click="handleEnter"
              class="bg-blue-600 text-white px-4 py-2 rounded-full"
            >
              Go
            </button>
            <ul
              v-if="
                showSuggestions &&
                search.query.trim().length >= MIN_INPUT_LENGTH
              "
              class="absolute bg-gray-900 text-white rounded-lg shadow-md w-72 mt-12"
              @blur="handleBlur"
            >
              <li
                v-if="
                  !search.isSearching &&
                  hasFetchedSuggestions &&
                  suggestions.length === 0
                "
                class="px-4 py-2 text-gray-300"
              >
                No result found
              </li>
              <li
                v-for="s in suggestions.slice(
                  0,
                  AUTOCOMPLETE_NUMBER_OF_RESULTS
                )"
                :key="s.show?.id"
                @click="goToSeries(s.show?.id)"
                class="flex items-center gap-3 hover:bg-gray-600 cursor-pointer hover:rounded-lg"
              >
                <img
                  :src="s.show?.image?.medium"
                  alt="Poster"
                  class="w-10 h-14 object-cover rounded mx-4 my-4"
                />
                <p class="text-md">{{ s.show?.name }}</p>
              </li>
            </ul>
          </div>
          <!-- Mobile auth buttons -->
          <USeparator />
          <div class="mt-8">
            <div v-if="!isAuthenticated">
              <NuxtLink to="/signin" class="text-white px-8">Sign in</NuxtLink>
              <NuxtLink
                to="/register"
                class="text-white bg-blue-600 rounded-full px-4 py-3 ml-8"
                >Register</NuxtLink
              >
            </div>
            <div
              v-if="isAuthenticated"
              class="mt-8 flex content-center text-center"
            >
              <NuxtLink
                to="/account"
                class="w-full px-4 py-2 bg-blue-600 rounded-xl"
                >Account</NuxtLink
              >
            </div>
            <button
              class="mt-2 w-full px-4 py-2 bg-blue-600 rounded-xl"
              v-if="isAuthenticated"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </div>
        <!-- Desktop search -->
        <div class="hidden sm:block relative" ref="searchBoxRef">
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <svg
                class="w-4 h-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              v-model="search.query"
              autocomplete="off"
              name="searchseries"
              @input="handleInput"
              @keyup.enter="handleEnter"
              @focus="handleFocus"
              @blur="handleBlur"
              placeholder="Search series"
              class="bg-gray-600 rounded-full p-1.5 pl-9 transition-all duration-400 outline-none w-10 text-transparent placeholder-transparent focus:w-40 focus:text-white focus:placeholder-gray-200 md:w-40 sm:text-white sm:placeholder-gray-200 md:focus:w-96 focus:overflow-auto"
            />
            <ul
              v-if="
                showSuggestions &&
                search.query.trim().length >= MIN_INPUT_LENGTH
              "
              class="absolute bg-gray-800 text-white rounded-lg shadow-md z-50 w-full"
              @blur="handleBlur"
            >
              <li
                v-if="
                  !search.isSearching &&
                  hasFetchedSuggestions &&
                  suggestions.length === 0
                "
                class="px-4 py-2 text-gray-300"
              >
                No result found
              </li>
              <li
                v-for="s in suggestions.slice(
                  0,
                  AUTOCOMPLETE_NUMBER_OF_RESULTS
                )"
                :key="s.show?.id"
                @click="goToSeries(s.show?.id)"
                class="flex items-center gap-3 hover:bg-gray-600 cursor-pointer hover:rounded-lg"
              >
                <img
                  :src="s.show?.image?.medium"
                  alt="Poster"
                  class="w-10 h-14 object-cover rounded mx-4 my-4"
                />
                <p class="text-md">{{ s.show?.name }}</p>
              </li>
            </ul>
          </div>
        </div>
        <!-- Desktop auth buttons -->
        <div v-if="!isAuthenticated" class="hidden sm:inline">
          <NuxtLink
            to="/signin"
            class="px-4 py-2 transition-all hover:bg-gray-600 hover:rounded-full hover:underline mr-4"
            >Sign in</NuxtLink
          >
          <NuxtLink
            to="/register"
            class="px-4 py-3 transition-all bg-blue-600 rounded-full hover:bg-gray-600 hover:rounded-full hover:underline"
            >Register</NuxtLink
          >
        </div>
        <div v-else class="flex gap-x-2 hidden sm:flex">
          <div
            class="relative mr-4"
            ref="accountMenuRef"
            @click="toggleAccountMenu"
          >
            <div
              v-if="isAuthenticated"
              class="flex items-center gap-2 cursor-pointer"
            >
              <img
                :src="user.avatar"
                alt="User avatar"
                class="w-8 h-8 rounded-full"
              />
              <span class="text-white">{{ user.name }}</span>
            </div>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="32"
              height="32"
              class="cursor-pointer hover:scale-110"
            >
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
              />
            </svg>
            <div
              v-if="isAccountMenuOpen"
              class="absolute right-0 mt-2 w-40 bg-blue-900 text-white rounded-lg shadow-lg z-50"
            >
              <NuxtLink
                to="/account"
                class="block px-4 py-2 transition-all hover:bg-gray-600 hover:rounded-lg hover:underline"
                >Account</NuxtLink
              >
              <button
                v-if="isAuthenticated"
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 transition-all hover:bg-gray-600 hover:rounded-lg hover:underline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
    </nav>
    <!-- Error and loading -->
    <div v-if="errorMsg" class="text-red-400 text-center mt-4">
      {{ errorMsg }}
    </div>
    <div
      v-if="search.isSearching"
      class="flex justify-center items-center h-64"
    >
      <div class="text-white text-xl">Loading...</div>
    </div>

    <NuxtPage class="min-h-screen" />
  </NuxtLayout>
</template>

<script setup>
import { ref, provide, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useDebounceFn } from "@vueuse/core";
import { useToast } from "vue-toastification";
import USeparator from "./components/USeparator.vue";
import { useAuth } from "~/composables/useAuth";

const { user, isAuthenticated, logout } = useAuth();
const DEBOUNCE_MILISECONDS = 300;
const LOADING_SCREEN_TIME = 300;
const MIN_INPUT_LENGTH = 2;
const AUTOCOMPLETE_NUMBER_OF_RESULTS = 3;
const BLUR_TIME = 100;
const TOAST_DURATION = 2000;

const toast = useToast();
const router = useRouter();

const accountMenuRef = ref(null);
const errorMsg = ref("");
const suggestions = ref([]);
const searchResults = ref([]);
const hasFetchedSuggestions = ref(false);
const isFromTyping = ref(false);
const showSuggestions = ref(false);
const isMobileMenuOpen = ref(false);
const searchBoxRef = ref(null);
const isSearchFocused = ref(false);

const search = ref({
  query: "",
  hasPerformedSearch: false,
  isSearching: false,
  selectedSeries: [],
});

provide("search", search);

watch(
  () => search.value.query,
  (newQuery) => {
    if (newQuery.trim().length >= MIN_INPUT_LENGTH) {
      isFromTyping.value = true;
      debouncedSearch();
    }
  }
);

const fetchSeries = async () => {
  if (!isFromTyping.value) search.value.isSearching = true;
  try {
    const res = await fetch(
      `https://api.tvmaze.com/search/shows?q=${search.value.query}`
    );
    if (!res.ok) throw new Error("UPS something went wrong");
    const data = await res.json();
    await new Promise((resolve) => setTimeout(resolve, LOADING_SCREEN_TIME));

    if (isFromTyping.value) {
      suggestions.value = data.slice(0, AUTOCOMPLETE_NUMBER_OF_RESULTS);
      hasFetchedSuggestions.value = true;
    } else {
      suggestions.value = [];
      searchResults.value = data || [];
    }
    search.value.selectedSeries = data || [];
  } catch (err) {
    toast.error("Failed to load results. Please try again.", {
      position: "bottom-right",
      timeout: TOAST_DURATION,
    });
    console.error("Search failed:", err);
  } finally {
    search.value.isSearching = false;
  }
};

const debouncedSearch = useDebounceFn(fetchSeries, DEBOUNCE_MILISECONDS);

const goToSeries = (id) => {
  suggestions.value = [];
  router.push(`/series/${id}`);
};

const handleEnter = async () => {
  isMobileMenuOpen.value = false;
  isFromTyping.value = false;
  suggestions.value = [];
  if (router.currentRoute.value.path !== "/") {
    await router.push("/");
  }
  if (search.value.query.trim().length >= MIN_INPUT_LENGTH) {
    search.value.hasPerformedSearch = true;
    await fetchSeries();
  } else {
    search.value.hasPerformedSearch = false;
    searchResults.value = [];
  }
};

const handleInput = () => {
  isFromTyping.value = true;
  if (search.value.query.trim().length >= MIN_INPUT_LENGTH) {
    showSuggestions.value = true;
    hasFetchedSuggestions.value = false;
    debouncedSearch();
  } else {
    showSuggestions.value = false;
    suggestions.value = [];
    searchResults.value = [];
  }
};

const handleFocus = () => {
  isSearchFocused.value = true;
  showSuggestions.value = true;
};

const handleBlur = () => {
  setTimeout(() => {
    isSearchFocused.value = false;
    suggestions.value = [];
    showSuggestions.value = false;
  }, BLUR_TIME);
};

const handleClickOutside = (event) => {
  if (searchBoxRef.value && !searchBoxRef.value.contains(event.target)) {
    showSuggestions.value = false;
    isSearchFocused.value = false;
  }

  if (accountMenuRef.value && !accountMenuRef.value.contains(event.target)) {
    isAccountMenuOpen.value = false;
  }
};

const clearSearch = () => {
  search.value.query = "";
  suggestions.value = [];
  searchResults.value = [];
  showSuggestions.value = false;
};

const isAccountMenuOpen = ref(false);
const toggleAccountMenu = () => {
  isAccountMenuOpen.value = !isAccountMenuOpen.value;
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const favorites = ref([]);

onMounted(() => {
  if (!isAuthenticated.value) {
    //errorMsg.value = "Please sign in to view your account.";
  }
  const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.value = savedFavorites;
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

<template>
  <div class="bg-gray-800 min-h-screen text-white p-8">
    <div v-if="errorMsg" class="text-red-500 text-center mt-10 text-xl">
      <div class="mt-4">
        <button
          @click="resetSearch"
          class="p-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full cursor-pointer"
        >
          Back to home page
        </button>
      </div>
    </div>
    <div v-if="series" class="max-w-6xl mx-auto pt-4">
      <div v-if="errorMsg" class="text-red-500 text-center text-lg mt-4">
        {{ errorMsg }}
      </div>
      <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
          <img
            :src="series.image?.original || series.image?.original"
            :alt="series.name"
            class="rounded-xl shadow-xl w-full h-auto"
          />
        </div>
        <div class="md:w-3/4">
          <h1 class="text-4xl font-bold mb-4">{{ series.name }}</h1>
          <div class="flex items-center mb-4">
            <span
              class="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibol"
            >
              {{ series.rating?.average || "N/A" }}/10 ★
            </span>
            <span class="ml-4 text-gray-200">
              {{ series.premiered }} • {{ series.runtime }} minutes
            </span>
          </div>
          <div
            class="mb-6 text-center md:text-justify"
            v-html="series.summary"
          ></div>
          <div v-if="series.genres" class="flex flex-wrap gap-2">
            <span
              v-for="genre in series.genres"
              :key="genre"
              class="bg-gray-600 px-3 py-1 rounded-full text-sm"
            >
              {{ genre }}
            </span>
          </div>
          <div v-if="series.officialSite || series.url" class="flex mt-8">
            <a
              :href="series.officialSite || series.url"
              target="_blank"
              class="bg-blue-600 hover:bg-blue-900 text-white px-4 py-2 cursor-pointer rounded-full transition"
            >
              Watch Now
            </a>

            <button
              v-if="isAuthenticated"
              @click="toggleFavorite"
              class="ml-8 py-2 px-4 rounded-full cursor-pointer transition-all"
              :class="{
                'bg-red-600 hover:bg-red-700': isInFavorites,
                'bg-blue-600 hover:bg-blue-700': !isInFavorites,
              }"
            >
              {{ isInFavorites ? "Remove from Favorites" : "Add to Favorites" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuth } from "~/composables/useAuth";
import { useFavorites } from "~/composables/useFavorites";

const route = useRoute();
const toast = useToast();
const { isAuthenticated } = useAuth();
const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

const series = ref(null);
const loading = ref(true);
const errorMsg = ref("");

const isInFavorites = computed(() => {
  return series.value ? isFavorite(series.value.id) : false;
});

const fetchSeries = async () => {
  try {
    loading.value = true;
    const res = await fetch(`https://api.tvmaze.com/shows/${route.params.id}`);
    if (!res.ok) throw new Error("Series not found");
    series.value = await res.json();
  } catch (err) {
    errorMsg.value = err.message || "Failed to load series";
  } finally {
    loading.value = false;
  }
};

const toggleFavorite = () => {
  if (!series.value) return;

  if (isInFavorites.value) {
    removeFromFavorites(series.value.id);
    toast.success("Removed from favorites");
  } else {
    const success = addToFavorites({
      id: series.value.id,
      name: series.value.name,
      image: series.value.image?.medium,
      rating: series.value.rating,
    });

    if (success) {
      toast.success("Added to favorites");
    } else {
      toast.warning("Already in favorites");
    }
  }
};

onMounted(() => {
  fetchSeries();
});
</script>

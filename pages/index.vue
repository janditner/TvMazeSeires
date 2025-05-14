<template>
  <div class="pt-1 pb-1 bg-gray-800">
    <ClientOnly>
      <div v-if="search.hasPerformedSearch && !search.isSearching" class="mt-4">
        <h2 class="text-2xl mb-4 text-white ml-4">Search Results</h2>
        <div
          v-if="search.selectedSeries.length === 0"
          class="text-center py-10 text-white"
        >
          No results found for "{{ search.query }}"
        </div>
        <div
          class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mx-8"
        >
          <div
            v-for="s in search.selectedSeries.slice(0, 3)"
            :key="s.id"
            class="p-4"
          >
            <SeriesCard :series="s.show || s" />
          </div>
        </div>
      </div>

      <div v-else class="mt-4 ml-4 mr-4">
        <div v-if="carouselError" class="text-red-500 text-center mb-4">
          {{ carouselError }}
        </div>
        <div v-if="recentSeriesError" class="text-red-500 text-center mb-4">
          {{ recentSeriesError }}
        </div>
        <Carousel
          :items="carouselSeries"
          :autoplay="{ delay: CAROUSEL_DELAY, disableOnInteraction: false }"
          :loop="true"
          :allow-touch-move="true"
          :breakpoints="{
            0: { slidesPerView: 1 },
            440: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }"
        />
        <Carousel
          :items="recentSeries"
          title="Recent shows"
          :modules="[Navigation]"
          :show-navigation="true"
          :loop="true"
          class=""
          :breakpoints="{
            0: { slidesPerView: 2 },
            440: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }"
        />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import "swiper/css";
import "swiper/css/navigation";
import { ref, onMounted, inject } from "vue";
import SwiperCore from "swiper";
import { Autoplay, Navigation } from "swiper/modules";
import SeriesCard from "~/components/seriescard.vue";

SwiperCore.use([Autoplay, Navigation]);

const MAX_NUMBER_OF_ITEMS = 40;
const NUMBER_OF_RECENT_SERIES = 24;
const CAROUSEL_DELAY = 3000;

const search = inject("search");

const carouselSeries = ref([]);
const recentSeries = ref([]);
const carouselError = ref("");
const recentSeriesError = ref("");

const loadCarouselSeries = async () => {
  try {
    const res = await fetch(`https://api.tvmaze.com/shows`);
    if (!res.ok) throw new Error(`UPS something went wrong}`);
    const data = await res.json();
    carouselSeries.value = data.slice(0, MAX_NUMBER_OF_ITEMS);
  } catch (err) {
    carouselError.value = "Failed to load featured shows.";
    console.error("Failed to load carousel series:", err);
    carouselSeries.value = [];
  }
};

const loadRecentSeries = async () => {
  try {
    const res = await fetch(`https://api.tvmaze.com/shows`);
    if (!res.ok) throw new Error(`UPS something went wrong}`);
    const data = await res.json();
    recentSeries.value = data.reverse().slice(0, NUMBER_OF_RECENT_SERIES);
  } catch (err) {
    recentSeriesError.value = "Failed to load recent shows.";
    console.error("Failed to load recent series:", err);
    recentSeries.value = [];
  }
};

onMounted(async () => {
  await Promise.all([loadCarouselSeries(), loadRecentSeries()]);
});

definePageMeta({
  layout: "default",
});
</script>

<template>
  <NuxtLink :to="`/series/${series.id}`" class="block">
    <div
      class="bg-gray-700 rounded-lg w-auto shadow-lg p-8 hover:bg-gray-600 transition-all hover:scale-102 duration-400"
    >
      <img
        :src="series.image?.original || '/placeholder.jpg'"
        alt="Poster"
        class="mx-auto block w-auto h-80 object-cover rounded-lg"
      />
      <h2 class="text-lg font-bold p-2 text-white mx-auto block mt-2">
        {{ series.name }}
      </h2>
      <p class="text-yellow-600 font-arial pl-2">
        Rating:
        {{
          series.rating?.average ? series.rating.average + "/10" : "No rating"
        }}
      </p>
      <p class="text-white p-2" v-html="shortSummary"></p>
      <button
        v-if="shouldTruncate"
        @click.prevent="toggleExpand"
        class="text-blue-500 pb-2 pl-2 cursor-pointer hover:font-bold hover:underline"
      >
        {{ showFull ? "See less" : "See more" }}
      </button>
    </div>
  </NuxtLink>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps(["series"]);
const showFull = ref(false);
const MAX_TEXT_LENGTH = 80;

const toggleExpand = (e) => {
  e.stopPropagation();
  showFull.value = !showFull.value;
};

const plainText = computed(() =>
  props.series.summary ? props.series.summary.replace(/<[^>]*>/g, "") : ""
);

const shortSummary = computed(() => {
  if (showFull.value || plainText.value.length <= MAX_TEXT_LENGTH)
    return props.series.summary;
  return plainText.value.slice(0, MAX_TEXT_LENGTH) + "...";
});

const shouldTruncate = computed(() => plainText.value.length > MAX_TEXT_LENGTH);
definePageMeta({
  layout: "default",
});
</script>

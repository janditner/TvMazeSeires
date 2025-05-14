<template>
  <div>
    <h1 v-if="title" class="text-3xl text-white">{{ title }}</h1>
    <Swiper
      :modules="modules"
      :navigation="showNavigation"
      :autoplay="autoplay"
      :space-between="spaceBetween"
      :allow-touch-move="allowTouchMove"
      :loop="loop"
      class="my-4 text-white"
      :breakpoints="breakpoints"
    >
      <SwiperSlide v-for="item in items" :key="item.id">
        <NuxtLink :to="`/series/${item.id}`" class="block group">
          <div class="overflow-hidden rounded-lg w-full h-auto mx-auto">
            <img
              :src="item.image?.medium"
              :alt="item.name"
              class="rounded-lg shadow-lg w-full h-full object-cover hover:opacity-50 transition-all duration-200 group-hover:scale-105"
              @error="$emit('image-error', item.id)"
            />
          </div>
          <div class="text-center mt-2">
            <p
              class="text-lg font-semibold text-white hover:text-blue-400 transition-colors"
            >
              {{ item.name }}
            </p>
          </div>
        </NuxtLink>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay } from "swiper/modules";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  slidesPerView: {
    type: Number,
    default: 3,
  },
  spaceBetween: {
    type: Number,
    default: 20,
  },
  autoplay: {
    type: [Boolean, Object],
    default: false,
  },
  showNavigation: {
    type: Boolean,
    default: false,
  },
  allowTouchMove: {
    type: Boolean,
    default: true,
  },
  loop: {
    type: Boolean,
    default: false,
  },
  breakpoints: {
    type: Object,
    required: false,
    default: () => ({
      640: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
      1280: { slidesPerView: 5 },
    }),
  },
});

const modules = computed(() => {
  return props.showNavigation ? [Navigation, Autoplay] : [Autoplay];
});

defineEmits(["image-error"]);
</script>

<template>
   <div class="bg-gray-800 min-h-screen text-white p-8">
    <div v-if="errorMsg" class="text-red-500 text-center mt-10 text-xl">
      <div class="mt-4">
        <button @click="resetSearch" class="p-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full cursor-pointer">
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
            <span class="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibol">
              {{ series.rating?.average || 'N/A' }}/10 ★
            </span>
            <span class="ml-4 text-gray-200 ">
              {{ series.premiered }} • {{ series.runtime }} minutes
            </span>
          </div>
          <div class="mb-6 text-center md:text-justify" v-html="series.summary"></div>
          <div v-if="series.genres" class="flex flex-wrap gap-2">
            <span 
              v-for="genre in series.genres" 
              :key="genre"
              class="bg-gray-600 px-3 py-1 rounded-full text-sm"
            >
              {{ genre }}
            </span>
          </div>
          <div v-if="series.officialSite || series.url" class="mt-8">
            <a 
              :href="series.officialSite || series.url" 
              target="_blank" 
              class="bg-blue-600 hover:bg-blue-900 text-white px-4 py-2 cursor-pointer rounded-full transition "
            >
              Watch Now
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const series = ref(null)
const errorMsg = ref('')
const toast = useToast()
const RETURN_TO_HOMEPAGE_TIME = 4000

const loadSeries = async (id) => {
  try {
    errorMsg.value = ''
    series.value = null
    const res = await fetch(`https://api.tvmaze.com/shows/${id}`)
    if (!res.ok) throw new Error('Series not found')
    series.value = await res.json()
  } catch (error) {
  errorMsg.value = 'Series not found or invalid ID'
  toast.error('Series not found or invalid ID.', 
  {
  timeout: RETURN_TO_HOMEPAGE_TIME, 
  onClose: () => {
    router.push('/')
  }
})
}}

onMounted(() => {
  loadSeries(route.params.id)
})

watch(() => route.params.id, (newId) => {
  loadSeries(newId)
})

const resetSearch = () => {
  router.push('/')
}

</script>

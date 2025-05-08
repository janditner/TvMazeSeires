<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <NuxtLayout>
      <nav class="sticky top-0 z-50 relative">
        <header class="bg-gray-900 text-white p-4 flex justify-between items-center">
            <a href="/" class="ml-2 hover:bg-gray-600 cursor-pointer rounded-full p-2"><h1 class="text-base lg:text-xl">TvMaze series</h1></a>
          <div class="relative">
            <div class="relative" ref="searchBoxRef">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                  v-model="search.query"
                  name="searchseries"
                  autocomplete="off"
                  @input="handleInput"
                  @keyup.enter="handleEnter"
                  @focus="handleInput"
                  @blur="handleBlur"
                  placeholder="Search series"
                  class="bg-gray-600 rounded-full p-1.5 pl-9 transition-all duration-400 outline-none
                        w-10 text-transparent placeholder-transparent mr-2
                        focus:w-40 focus:text-white focus:placeholder-gray-200
                        md:w-40 sm:text-white sm:placeholder-gray-200 md:focus:w-144"
                />
            </div>
            <ul v-if="suggestions.length" class="absolute bg-gray-800 text-white rounded-lg shadow-md z-50 w-full">
              <li
                v-for="s in suggestions.slice(0, AUTOCOMPLETE_NUMBER_OF_RESULTS)"
                :key="s.show?.id"
                @click="goToSeries(s.show?.id)"
                class="flex items-center gap-3 hover:bg-gray-600 cursor-pointer hover:rounded-lg"
              >
                <img
                  :src="s.show?.image?.medium"
                  alt="Poster"
                  class="w-10 h-14 object-cover rounded mx-4 my-4"
                />
                <p class="text-md ">{{ s.show?.name }}</p>
              </li>
            </ul>
          </div> 
      </header>
      </nav> 
          <div v-if="errorMsg" class="text-red-400 text-center mt-4">{{ errorMsg }}</div>
      <div v-if="search.isSearching" class="flex justify-center items-center h-64">
        <div class="text-white text-xl">Loading...</div>
      </div>
      <NuxtPage class="min-h-screen" />
    </NuxtLayout>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { watch } from 'vue'
import { useToast } from 'vue-toastification'

const DEBOUNCE_MILISECONDS = 300
const LOADING_SCREEN_TIME = 300
const MIN_INPUT_LENGTH = 2
const AUTOCOMPLETE_NUMBER_OF_RESULTS = 3
const BLUR_TIME = 100
const errorMsg = ref('')
const suggestions = ref([])
const isFromTyping = ref(false)
const searchBoxRef = ref(null)
const searchResults = ref([])
const toast = useToast()

const search = ref({
  query: '',
  hasPerformedSearch: false,
  isSearching: false
})

provide('search', search)

watch(() => search.value.query, (newQuery) => {
  if (newQuery.trim().length >= MIN_INPUT_LENGTH) {
    isFromTyping.value = true
    debouncedSearch()
  }
})

const fetchSeries = async () => {
if (!isFromTyping.value) search.value.isSearching = true
  try {
    const res = await fetch(`https://api.tvmaze.com/search/shows?q=${search.value.query}`)
    if (!res.ok) throw new Error('UPS something went wrong')
    const data = await res.json()
    await new Promise(resolve => setTimeout(resolve, LOADING_SCREEN_TIME))

    if (isFromTyping.value) {
      suggestions.value = data.slice(0, AUTOCOMPLETE_NUMBER_OF_RESULTS)
    } else {
      suggestions.value = []
      searchResults.value = data || []
    }

    search.value.selectedSeries = data || []
  } catch (err) {
    toast.error = 'Failed to load results. Please try again.'
    console.error('Search failed:', err)
  } finally {
    search.value.isSearching = false
  }
}

const debouncedSearch = useDebounceFn(fetchSeries, DEBOUNCE_MILISECONDS)

const router = useRouter()
const goToSeries = id => {
  suggestions.value = []
  router.push(`/series/${id}`)
}

const handleEnter = async () => {
  isFromTyping.value = false
  suggestions.value = []
  if (search.value.query.trim().length >= MIN_INPUT_LENGTH) {
    search.value.hasPerformedSearch = true
    await fetchSeries()
  } else {
    search.value.hasPerformedSearch = false
    searchResults.value = []
  }
}

const handleInput = () => {
  isFromTyping.value = true
  if (search.value.query.trim().length >= MIN_INPUT_LENGTH) {
    debouncedSearch()
  } else {
    suggestions.value = []
    searchResults.value = []
  }
}

const handleClickOutside = (event) => {
  if (searchBoxRef.value && !searchBoxRef.value.contains(event.target)) {
    suggestions.value = []
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
const handleBlur = () => {
  setTimeout(() => {
    suggestions.value = []
  }, BLUR_TIME)
}

</script>
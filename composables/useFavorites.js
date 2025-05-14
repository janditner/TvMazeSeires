import { ref } from "vue";

export const useFavorites = () => {
  // Initialize with empty array if on server-side
  const favorites = ref([]);

  // Only access localStorage on client-side
  if (process.client) {
    favorites.value = JSON.parse(localStorage.getItem("favorites")) || [];
  }

  const addToFavorites = (series) => {
    if (!favorites.value.some((fav) => fav.id === series.id)) {
      favorites.value.push(series);
      if (process.client) {
        localStorage.setItem("favorites", JSON.stringify(favorites.value));
      }
      return true;
    }
    return false;
  };

  const removeFromFavorites = (seriesId) => {
    favorites.value = favorites.value.filter((fav) => fav.id !== seriesId);
    if (process.client) {
      localStorage.setItem("favorites", JSON.stringify(favorites.value));
    }
  };

  const isFavorite = (seriesId) => {
    return favorites.value.some((fav) => fav.id === seriesId);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };
};

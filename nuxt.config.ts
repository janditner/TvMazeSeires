import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "vue-toastification/dist/index.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      title: "TVMAZE series",
      htmlAttrs: {
        lang: "en",
      },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  modules: ["vue3-carousel-nuxt", "nuxt-auth-utils"],

  plugins: ["~/plugins/toast.client.ts", "@/plugins/firebase"],
});

<template>
  <div>
    <main class="min-h-screen bg-gray-800 font-semibold">
      <slot :key="$route.fullPath" />
    </main>
  </div>
</template>

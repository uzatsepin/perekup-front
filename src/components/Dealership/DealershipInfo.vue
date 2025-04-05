<template>
  <div class="relative">
    <img :src="dealership.photoUrl" alt="Dealership" class="w-full h-48 object-cover" />
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
    ></div>
    <div class="absolute bottom-0 left-0 right-0 p-4">
      <h1 class="text-white text-xl font-bold">{{ dealership.name }}</h1>
      <div class="flex items-center text-white/90 mt-1">
        <Icon icon="mdi:map-marker" class="h-4 w-4 mr-1" />
        <span class="text-sm">{{ dealership.location }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  dealership: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped></style>

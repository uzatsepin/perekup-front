<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden fade-in"
    @click="emit('goToCarDetails', car.id)"
  >
    <div class="relative">
      <img
        :src="car.photoUrl"
        :alt="`${car.brand} ${car.model}`"
        class="w-full h-32 object-cover"
      />
      <div
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-1 px-2"
      >
        <div class="text-white text-xs font-medium truncate">
          {{ car.brand }} {{ car.model }}
        </div>
      </div>
      <div
        class="absolute top-2 right-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full"
      >
        ${{ car.price.toLocaleString() }}
      </div>
    </div>
    <div class="p-2">
      <div class="flex justify-between items-start">
        <div class="text-xs text-slate-500">{{ car.year }} г.</div>
        <div
          v-if="car.isNew"
          class="text-xs font-medium px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded"
        >
          Новый
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  car: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["goToCarDetails"]);
</script>

<style scoped></style>

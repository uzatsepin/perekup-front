<template>
  <div class="grid grid-cols-2 gap-3 mb-4">
    <div
      class="bg-white rounded-xl shadow-md p-3 flex items-center scale-in"
      style="animation-delay: 0.1s"
    >
      <div
        class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mr-3 shadow-sm"
      >
        <Icon icon="mdi:currency-usd" class="w-6 h-6" />
      </div>
      <div>
        <div class="text-xs text-slate-500">Рыночная стоимость</div>
        <div class="text-lg font-bold">${{ totalMarketValue.toLocaleString() }}</div>
      </div>
    </div>

    <div
      class="bg-white rounded-xl shadow-md p-3 flex items-center scale-in"
      style="animation-delay: 0.2s"
    >
      <div
        class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white mr-3 shadow-sm"
      >
        <Icon icon="mdi:car-multiple" class="w-6 h-6" />
      </div>
      <div>
        <div class="text-xs text-slate-500">Автомобилей</div>
        <div class="text-lg font-bold">{{ cars.length }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
const props = defineProps({
  cars: {
    type: Array,
    required: true,
  },
  totalMarketValue: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped></style>

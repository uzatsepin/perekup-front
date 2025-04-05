<template>
  <div class="mb-6">
    <div class="flex justify-between items-center mb-1">
      <div class="text-sm font-medium">Состояние автомобиля</div>
      <div class="text-sm text-slate-500">{{ condition }}%</div>
    </div>
    <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full"
        :class="{
          'bg-emerald-500': condition >= 80,
          'bg-blue-500': condition >= 60 && condition < 80,
          'bg-amber-500': condition >= 40 && condition < 60,
          'bg-red-500': condition < 40,
        }"
        :style="`width: ${condition}%`"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  condition: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped></style>

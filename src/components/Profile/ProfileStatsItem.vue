<template>
  <div
    class="bg-white p-3 rounded-lg shadow-md flex"
    :style="`animation-delay: ${0.1 * index}s`"
  >
    <div
      class="w-12 h-12 rounded-full flex items-center justify-center mr-3"
      :class="stat.bgColor"
    >
      <Icon :icon="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
    </div>
    <div>
      <div class="font-bold text-lg">{{ stat.value }}</div>
      <div class="text-xs text-slate-500">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
const props = defineProps({
  stat: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped></style>

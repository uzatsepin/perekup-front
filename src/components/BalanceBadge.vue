<template>
  <div
    class="flex items-center rounded-full bg-white px-4 py-2 shadow-md border border-slate-200"
  >
    <div class="text-blue-500 mr-2">
      <Icon icon="mdi:currency-usd" class="h-5 w-5" />
    </div>
    <span class="font-bold text-blue-600">${{ balance }}</span>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps({
  balance: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <li class="bg-red-50 p-3 rounded-lg flex items-start">
    <Icon
      icon="mdi:alert-circle"
      class="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5"
    />
    <span class="text-sm">{{ issue }}</span>
  </li>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
const props = defineProps({
  issue: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>

<template>
  <div
    class="flex items-start pb-3"
    :class="{ 'border-b border-slate-100': index < historyLimit - 1 }"
  >
    <div
      class="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5"
      :class="activity.bgColor"
    >
      <Icon :icon="activity.icon" class="w-4 h-4" :class="activity.iconColor" />
    </div>
    <div>
      <div class="font-medium text-sm">{{ activity.title }}</div>
      <div class="text-xs text-slate-500 mb-1">{{ activity.description }}</div>
      <div class="text-xs text-slate-400">{{ formatDate(activity.date) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "@/utils/formatDate";
import { Icon } from "@iconify/vue";

const props = defineProps({
  activity: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  historyLimit: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped></style>

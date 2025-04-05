<template>
  <div
    class="bg-white rounded-xl shadow-md mb-5 overflow-hidden fade-in"
    style="animation-delay: 0.2s"
  >
    <div class="flex border-b border-slate-100">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="$emit('changeTab', index)"
        class="flex-1 py-3.5 px-2 text-center font-medium transition-colors relative"
        :class="
          activeTab === index ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
        "
      >
        <div class="flex items-center justify-center">
          <Icon :icon="tab.icon" class="w-5 h-5 mr-1.5" />
          {{ tab.name }}
        </div>
        <div
          v-if="activeTab === index"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        ></div>
      </button>
    </div>

    <!-- Описание выбранного рейтинга -->
    <div class="px-4 py-3 border-b border-slate-100 bg-slate-50">
      <p class="text-sm text-slate-600">{{ tabs[activeTab].description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { Tab } from "@/types/rating";

defineProps({
  tabs: {
    type: Array as () => Tab[],
    required: true,
  },
  activeTab: {
    type: Number,
    required: true,
  },
});

defineEmits(["changeTab"]);
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-12 text-center">
    <div
      class="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4"
    >
      <Icon icon="mdi:trophy-outline" class="w-10 h-10 text-slate-400" />
    </div>
    <h3 class="text-lg font-medium mb-2">Рейтинг пуст</h3>
    <p class="text-slate-500 mb-6">Станьте первым в этом рейтинге!</p>
    <button
      class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
    >
      Начать игру
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

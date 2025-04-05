<template>
  <div class="bg-white rounded-lg shadow-md p-8 text-center">
    <div
      class="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3"
    >
      <Icon icon="mdi:car-off" class="w-8 h-8 text-slate-400" />
    </div>
    <h3 class="font-medium mb-1">Нет доступных автомобилей</h3>
    <p class="text-slate-500 text-sm mb-4">
      В данный момент в салоне нет автомобилей на продажу
    </p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<style scoped></style>

<template>
  <div class="bg-white rounded-xl shadow-md p-8 text-center fade-in">
    <div class="mb-4">
      <div
        class="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400"
      >
        <Icon icon="mdi:file-document-outline" class="w-8 h-8" />
      </div>
    </div>
    <h3 class="font-medium mb-1">Нет операций за выбранный период</h3>
    <p class="text-slate-500 text-sm mb-4">Выберите другой период или пополните баланс</p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<style scoped></style>

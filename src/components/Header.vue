<template>
  <div class="relative mb-6">
    <div
      class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 h-32 -mx-4"
    ></div>

    <div class="relative pt-6 px-1">
      <!-- Верхняя строка с заголовком и кнопкой назад -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center">
          <button @click="router.back()" class="mr-3 text-white p-1 rounded-full">
            <Icon icon="mdi:arrow-left" class="h-6 w-6" />
          </button>
          <div class="fade-in text-white">
            <h1 class="text-2xl font-bold"><slot name="title" /></h1>
            <p class="text-blue-100 text-sm"><slot name="descr" /></p>
          </div>
        </div>
      </div>

      <!-- Общий баланс -->
      <slot name="info" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style scoped></style>

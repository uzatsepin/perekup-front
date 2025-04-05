<template>
  <div class="bg-white rounded-lg shadow-md p-8 text-center fade-in">
    <div
      class="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3"
    >
      <Icon icon="mdi:store-off" class="w-8 h-8 text-slate-400" />
    </div>
    <h3 class="font-medium mb-1">Автосалон не найден</h3>
    <p class="text-slate-500 text-sm mb-4">
      Запрашиваемый автосалон не существует или временно недоступен
    </p>
    <button
      @click="router.push('/market')"
      class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
    >
      <Icon icon="mdi:arrow-left" class="h-5 w-5 mr-2" />
      Вернуться на авторынок
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";

const router = useRouter();
</script>

<style scoped></style>

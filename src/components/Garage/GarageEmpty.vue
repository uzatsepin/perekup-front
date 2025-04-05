<template>
  <div class="bg-white rounded-xl shadow-md p-8 text-center fade-in">
    <div class="mb-4">
      <div
        class="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400"
      >
        <Icon icon="mdi:car-off" class="w-10 h-10" />
      </div>
    </div>
    <h3 class="text-lg font-medium mb-2">
      {{
        cars.length > 0
          ? `В категории "${getActiveTabLabel()}" нет автомобилей`
          : "Ваш гараж пуст"
      }}
    </h3>
    <p class="text-slate-500 mb-6">
      {{
        cars.length > 0
          ? "Выберите другую категорию или добавьте автомобили в эту категорию"
          : "Посетите авторынок, чтобы приобрести ваш первый автомобиль"
      }}
    </p>
    <div class="flex flex-wrap justify-center gap-3">
      <button
        v-if="cars.length > 0 && activeTab !== 'all'"
        @click="emit('changeTab', 'all')"
        class="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center"
      >
        <Icon icon="mdi:view-dashboard" class="w-5 h-5 mr-2" />
        Все автомобили
      </button>

      <router-link
        to="/market"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg inline-flex items-center transition-colors"
      >
        <Icon icon="mdi:cart" class="w-5 h-5 mr-2" />
        На авторынок
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

const props = defineProps({
  cars: {
    type: Array,
    required: true,
  },
  activeTab: {
    type: String,
    default: "all",
  },
  getActiveTabLabel: {
    type: Function,
    required: true,
  },
});
const emit = defineEmits(["changeTab"]);
</script>

<style scoped></style>

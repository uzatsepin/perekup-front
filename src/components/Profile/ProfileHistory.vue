<template>
  <div class="bg-white rounded-lg shadow-md p-4 slide-up" style="animation-delay: 0.3s">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold">История действий</h3>
      <div class="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
        {{ activityHistory.length }} действий
      </div>
    </div>

    <div class="space-y-3">
      <ProfileHistoryItem
        v-for="(activity, index) in activityHistory.slice(0, historyLimit)"
        :key="index"
        :activity="activity"
        :index="index"
        :historyLimit="historyLimit"
      />
    </div>

    <button
      v-if="activityHistory.length > historyLimit"
      @click="historyLimit = activityHistory.length"
      class="w-full mt-3 py-2 text-sm text-blue-500 bg-blue-50 rounded-lg"
    >
      Показать больше
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ProfileHistoryItem from "./ProfileHistoryItem.vue";

const activityHistory = [
  {
    title: "Продажа автомобиля",
    description: "Продан Toyota Camry 2015 за $15,200",
    date: new Date(2023, 6, 12),
    icon: "mdi:tag-check",
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-500",
  },
  {
    title: "Ремонт автомобиля",
    description: "Отремонтирован Honda Civic 2017, потрачено $1,200",
    date: new Date(2023, 6, 10),
    icon: "mdi:wrench",
    bgColor: "bg-amber-100",
    iconColor: "text-amber-500",
  },
  {
    title: "Покупка автомобиля",
    description: "Куплен BMW X5 2016 за $22,000",
    date: new Date(2023, 6, 8),
    icon: "mdi:cart",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    title: "Получен ежедневный бонус",
    description: "Ежедневный бонус $500",
    date: new Date(2023, 6, 7),
    icon: "mdi:gift",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-500",
  },
  {
    title: "Достижение разблокировано",
    description: "Разблокировано достижение 'Первая продажа'",
    date: new Date(2023, 6, 5),
    icon: "mdi:trophy",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-500",
  },
];
const historyLimit = ref(3);
</script>

<style scoped></style>

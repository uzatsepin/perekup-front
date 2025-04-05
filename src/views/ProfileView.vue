<template>
  <div class="py-4">
    <!-- Верхняя панель с балансом и кнопкой настроек -->
    <div class="flex justify-between items-center mb-6">
      <BalanceBadge :balance="userBalance" class="scale-in" />
      <button
        @click="showSettings = true"
        class="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
      >
        <Icon icon="mdi:cog" class="h-6 w-6" />
      </button>
    </div>

    <!-- Профиль пользователя -->
    <ProfilePlayerInfo
      :playerName="playerName"
      :playerTitle="playerTitle"
      :userAvatar="userAvatar"
      :userLevel="userLevel"
      :xpProgress="xpProgress"
      @claimDailyBonus="claimDailyBonus"
    />

    <!-- Статистика профиля -->
    <div class="grid grid-cols-2 gap-3 mb-6 slide-up">
      <ProfileStatsItem
        v-for="(stat, index) in userStats"
        :key="index"
        :stat="stat"
        :index="index"
      />
    </div>

    <!-- История действий -->
    <ProfileHistory />

    <!-- Модальное окно настроек -->
    <ProfileSettingsPopup
      v-model="showSettings"
      v-model:playerName="playerName"
      v-model:currentTheme="currentTheme"
      v-model:notifications="notifications"
      @save="saveUserSettings"
    />

    <!-- Всплывающее уведомление о бонусе -->
    <div
      v-if="showBonusNotification"
      class="fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-emerald-500 text-white rounded-lg shadow-lg flex items-center bounce-in"
    >
      <Icon icon="mdi:check-circle" class="h-5 w-5 mr-2" />
      <span>Ежедневный бонус $500 получен!</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import BalanceBadge from "../components/BalanceBadge.vue";
import { Icon } from "@iconify/vue";
import ProfileHistory from "@/components/Profile/ProfileHistory.vue";
import ProfilePlayerInfo from "@/components/Profile/ProfilePlayerInfo.vue";
import ProfileSettingsPopup from "@/components/Profile/ProfileSettingsPopup.vue";
import ProfileStatsItem from "@/components/Profile/ProfileStatsItem.vue";

const router = useRouter();

// Профиль пользователя
const playerName = ref("Игрок #1254");
const playerTitle = ref("Начинающий перекупщик");
const userAvatar = ref("");
const userLevel = ref(5);
const userBalance = ref(5000);
const xpProgress = ref({
  current: 430,
  max: 1000,
});

// Статистика пользователя
const userStats = [
  {
    label: "Автомобилей",
    value: "4",
    icon: "mdi:car-multiple",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    label: "Продаж",
    value: "8",
    icon: "mdi:tag-multiple",
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-500",
  },
  {
    label: "Общая прибыль",
    value: "$6,850",
    icon: "mdi:cash-multiple",
    bgColor: "bg-amber-100",
    iconColor: "text-amber-500",
  },
  {
    label: "Рейтинг",
    value: "#42",
    icon: "mdi:trophy",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-500",
  },
];

// Достижения
const achievements = [
  {
    name: "Первая покупка",
    description: "Купить свой первый автомобиль",
    icon: "mdi:car",
    bgColor: "bg-emerald-100 text-emerald-500",
    unlocked: true,
  },
  {
    name: "Первая продажа",
    description: "Продать свой первый автомобиль",
    icon: "mdi:currency-usd",
    bgColor: "bg-blue-100 text-blue-500",
    unlocked: true,
  },
  {
    name: "Быстрая прибыль",
    description: "Продать автомобиль с прибылью более 30%",
    icon: "mdi:rocket",
    bgColor: "bg-amber-100 text-amber-500",
    unlocked: false,
  },
];

// Настройки
const showSettings = ref(false);
const currentTheme = ref("light");
const notifications = ref({
  dailyBonus: true,
});

// Ежедневный бонус
const dailyBonusAvailable = ref(true);
const showBonusNotification = ref(false);

const claimDailyBonus = () => {
  if (dailyBonusAvailable.value) {
    userBalance.value += 500;
    dailyBonusAvailable.value = false;

    // Показываем уведомление
    showBonusNotification.value = true;
    setTimeout(() => {
      showBonusNotification.value = false;
    }, 3000);
  }
};

const setTheme = (theme: string) => {
  currentTheme.value = theme;
  // В реальном приложении здесь бы применялась тема
};

const saveUserSettings = () => {
  // Здесь можно добавить сохранение настроек на сервер
  console.log("Настройки сохранены", {
    playerName: playerName.value,
    theme: currentTheme.value,
    notifications: notifications.value,
  });
};
</script>

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
    <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6 fade-in">
      <!-- Шапка профиля с обложкой -->
      <div class="relative">
        <div class="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div class="absolute top-14 left-1/2 transform -translate-x-1/2">
          <div class="relative">
            <div
              class="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden"
            >
              <img
                :src="
                  userAvatar ||
                  'https://ui-avatars.com/api/?name=' + encodeURIComponent(playerName)
                "
                alt="Аватар"
                class="w-full h-full object-cover"
              />
            </div>
            <button
              class="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center border-2 border-white"
            >
              <Icon icon="mdi:camera" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Информация о пользователе -->
      <div class="pt-14 px-4 pb-4 text-center">
        <h1 class="text-xl font-bold">{{ playerName }}</h1>
        <div class="flex items-center justify-center">
          <span class="text-sm text-slate-500">{{ playerTitle }}</span>
          <div class="w-2 h-2 rounded-full bg-slate-300 mx-2"></div>
          <div class="flex items-center text-sm text-blue-500">
            <Icon icon="mdi:star" class="h-4 w-4 mr-0.5 text-amber-400" />
            <span>Уровень {{ userLevel }}</span>
          </div>
        </div>

        <!-- Прогресс уровня -->
        <div class="mt-3 mb-4">
          <div class="flex justify-between text-xs text-slate-500 mb-1">
            <span>{{ xpProgress.current }} XP</span>
            <span>{{ xpProgress.max }} XP</span>
          </div>
          <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              :style="`width: ${(xpProgress.current / xpProgress.max) * 100}%`"
            ></div>
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="flex space-x-3">
          <button
            @click="claimDailyBonus"
            class="flex-1 flex items-center justify-center py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg"
            :class="dailyBonusAvailable ? 'pulse' : 'opacity-50'"
            :disabled="!dailyBonusAvailable"
          >
            <Icon icon="mdi:gift" class="h-5 w-5 mr-1.5" />
            <span class="text-sm">Ежедневный бонус</span>
          </button>
          <button
            @click="router.push('/rating')"
            class="flex-1 flex items-center justify-center py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg"
          >
            <Icon icon="mdi:trophy" class="h-5 w-5 mr-1.5" />
            <span class="text-sm">Рейтинг</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Статистика профиля -->
    <div class="grid grid-cols-2 gap-3 mb-6 slide-up">
      <div
        v-for="(stat, index) in userStats"
        :key="index"
        class="bg-white p-3 rounded-lg shadow-md flex"
        :style="`animation-delay: ${0.1 * index}s`"
      >
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center mr-3"
          :class="stat.bgColor"
        >
          <Icon :icon="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
        </div>
        <div>
          <div class="font-bold text-lg">{{ stat.value }}</div>
          <div class="text-xs text-slate-500">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Достижения -->
    <div
      class="bg-white rounded-lg shadow-md p-4 mb-6 slide-up"
      style="animation-delay: 0.2s"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold">Достижения</h3>
        <button class="text-blue-500 text-sm">Показать все</button>
      </div>

      <div class="space-y-3">
        <div
          v-for="(achievement, index) in achievements"
          :key="index"
          class="flex items-center p-3 rounded-lg"
          :class="
            achievement.unlocked ? 'bg-slate-50' : 'bg-white border border-slate-200'
          "
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
            :class="
              achievement.unlocked ? achievement.bgColor : 'bg-slate-100 text-slate-400'
            "
          >
            <Icon :icon="achievement.icon" class="w-5 h-5" />
          </div>
          <div class="flex-grow mr-2">
            <div
              class="font-medium"
              :class="achievement.unlocked ? '' : 'text-slate-400'"
            >
              {{ achievement.name }}
            </div>
            <div class="text-xs text-slate-500">{{ achievement.description }}</div>
          </div>
          <div>
            <div
              class="text-xs font-medium px-2 py-1 rounded-full"
              :class="
                achievement.unlocked
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-slate-100 text-slate-500'
              "
            >
              {{ achievement.unlocked ? "Получено" : "Не получено" }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- История действий -->
    <div class="bg-white rounded-lg shadow-md p-4 slide-up" style="animation-delay: 0.3s">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold">История действий</h3>
        <div class="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
          {{ activityHistory.length }} действий
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="(activity, index) in activityHistory.slice(0, historyLimit)"
          :key="index"
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
      </div>

      <button
        v-if="activityHistory.length > historyLimit"
        @click="historyLimit = activityHistory.length"
        class="w-full mt-3 py-2 text-sm text-blue-500 bg-blue-50 rounded-lg"
      >
        Показать больше
      </button>
    </div>

    <!-- Модальное окно настроек -->
    <div
      v-if="showSettings"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click.self="showSettings = false"
    >
      <div class="bg-white rounded-lg w-full max-w-sm p-5 scale-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg">Настройки</h3>
          <button
            @click="showSettings = false"
            class="text-slate-400 hover:text-slate-600"
          >
            <Icon icon="mdi:close" class="h-5 w-5" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Имя игрока</label
            >
            <input
              v-model="playerName"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Тема</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                class="py-2 border rounded-md flex justify-center items-center"
                :class="
                  currentTheme === 'light'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-slate-300 text-slate-700'
                "
                @click="setTheme('light')"
              >
                <Icon icon="mdi:white-balance-sunny" class="h-4 w-4 mr-1" />
                Светлая
              </button>
              <button
                class="py-2 border rounded-md flex justify-center items-center"
                :class="
                  currentTheme === 'dark'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-slate-300 text-slate-700'
                "
                @click="setTheme('dark')"
              >
                <Icon icon="mdi:moon-waning-crescent" class="h-4 w-4 mr-1" />
                Тёмная
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1"
              >Уведомления</label
            >
            <div class="flex items-center">
              <div class="flex-grow">
                <div class="font-medium text-sm">Ежедневный бонус</div>
                <div class="text-xs text-slate-500">Уведомлять, когда доступен бонус</div>
              </div>
              <div>
                <button
                  class="w-12 h-6 rounded-full transition-colors duration-200"
                  :class="notifications.dailyBonus ? 'bg-blue-500' : 'bg-slate-300'"
                  @click="notifications.dailyBonus = !notifications.dailyBonus"
                >
                  <div
                    class="w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200"
                    :class="notifications.dailyBonus ? 'translate-x-6' : 'translate-x-1'"
                  ></div>
                </button>
              </div>
            </div>
          </div>

          <button class="w-full py-2 bg-blue-500 text-white rounded-lg">
            Сохранить настройки
          </button>
        </div>
      </div>
    </div>

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

// История действий
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

// Настройки
const showSettings = ref(false);
const currentTheme = ref("light");
const notifications = ref({
  dailyBonus: true,
});

// Ежедневный бонус
const dailyBonusAvailable = ref(true);
const showBonusNotification = ref(false);

// Методы
const formatDate = (date: Date) => {
  // Возвращает дату в формате "12 июл. 2023"
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const claimDailyBonus = () => {
  if (dailyBonusAvailable.value) {
    userBalance.value += 500;
    dailyBonusAvailable.value = false;

    // Добавляем в историю
    activityHistory.unshift({
      title: "Получен ежедневный бонус",
      description: "Ежедневный бонус $500",
      date: new Date(),
      icon: "mdi:gift",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-500",
    });

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
</script>

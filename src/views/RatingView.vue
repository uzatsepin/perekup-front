<template>
  <div class="py-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Рейтинг игроков</h1>
      <BalanceBadge :balance="5000" />
    </div>

    <!-- Табы рейтинга -->
    <div class="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
      <div class="flex border-b">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="activeTab = index"
          class="flex-1 py-3 px-2 text-center text-sm font-medium transition-colors duration-200"
          :class="
            activeTab === index
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-slate-500 hover:text-slate-700'
          "
        >
          <div class="flex items-center justify-center">
            <Icon :icon="tab.icon" class="w-4 h-4 mr-1.5" />
            {{ tab.name }}
          </div>
        </button>
      </div>
    </div>

    <!-- Показатели топ игроков (карточка с моим местом) -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <div class="relative">
            <div
              class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 border-2 border-blue-200"
            >
              <Icon icon="mdi:account-circle" class="w-8 h-8" />
            </div>
            <div
              class="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-500 border border-blue-200"
            >
              42
            </div>
          </div>
          <div class="ml-3">
            <div class="font-bold">Вы</div>
            <div class="text-xs text-slate-500">Ваше место в рейтинге</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg font-bold text-blue-500">
            {{ formatValue(myStats[activeTab].value) }}
          </div>
          <div
            class="flex items-center text-xs font-medium"
            :class="getTrendClass(myStats[activeTab].trend)"
          >
            <Icon :icon="getTrendIcon(myStats[activeTab].trend)" class="w-3 h-3 mr-0.5" />
            {{ Math.abs(myStats[activeTab].trend) }}%
          </div>
        </div>
      </div>
    </div>

    <!-- Список рейтинга -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Заголовок списка -->
      <div class="bg-gray-50 px-4 py-3 border-b">
        <h3 class="font-medium">Топ игроков</h3>
        <p class="text-xs text-gray-500">{{ tabs[activeTab].description }}</p>
      </div>

      <!-- Список игроков -->
      <transition-group name="list" tag="div">
        <div
          v-for="(player, index) in getFilteredPlayers()"
          :key="player.id"
          class="flex items-center px-4 py-3 border-b relative"
          :class="{ 'bg-blue-50': player.isMe }"
        >
          <!-- Номер в рейтинге (с медалями) -->
          <div class="flex-none w-8 text-center">
            <div
              v-if="index === 0"
              class="w-7 h-7 mx-auto bg-yellow-100 rounded-full flex items-center justify-center"
            >
              <Icon icon="mdi:trophy" class="w-4 h-4 text-yellow-500" />
            </div>
            <div
              v-else-if="index === 1"
              class="w-7 h-7 mx-auto bg-gray-100 rounded-full flex items-center justify-center"
            >
              <Icon icon="mdi:trophy" class="w-4 h-4 text-gray-500" />
            </div>
            <div
              v-else-if="index === 2"
              class="w-7 h-7 mx-auto bg-amber-100 rounded-full flex items-center justify-center"
            >
              <Icon icon="mdi:trophy" class="w-4 h-4 text-amber-600" />
            </div>
            <div v-else class="text-sm font-bold text-gray-500">{{ index + 1 }}</div>
          </div>

          <!-- Аватар игрока -->
          <div class="ml-2 relative">
            <div
              class="w-10 h-10 rounded-full bg-cover bg-center"
              :style="`background-image: url(${player.avatar})`"
            ></div>
            <div
              v-if="player.online"
              class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
            ></div>
          </div>

          <!-- Информация об игроке -->
          <div class="ml-3 flex-grow min-w-0">
            <div class="flex items-center">
              <div class="font-medium truncate">{{ player.name }}</div>
              <div
                v-if="player.isMe"
                class="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-500 text-xs rounded"
              >
                Вы
              </div>
              <div v-if="player.badge" class="ml-1 text-xs text-gray-500">
                ({{ player.badge }})
              </div>
            </div>
            <div class="text-xs text-gray-500 truncate">
              {{ player.stats[activeTab].details }}
            </div>
          </div>

          <!-- Значение рейтинга и тренд -->
          <div class="flex-none text-right">
            <div class="font-bold" :class="{ 'text-blue-500': player.isMe }">
              {{ formatValue(player.stats[activeTab].value) }}
            </div>
            <div
              class="flex items-center justify-end text-xs font-medium"
              :class="getTrendClass(player.stats[activeTab].trend)"
            >
              <Icon
                :icon="getTrendIcon(player.stats[activeTab].trend)"
                class="w-3 h-3 mr-0.5"
              />
              {{ Math.abs(player.stats[activeTab].trend) }}%
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Пустой рейтинг (если нет данных) -->
      <div v-if="getFilteredPlayers().length === 0" class="py-12 px-4 text-center">
        <div
          class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3"
        >
          <Icon icon="mdi:trophy" class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="font-medium mb-1">Рейтинг пуст</h3>
        <p class="text-gray-500 text-sm mb-4">Станьте первым в этом рейтинге!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BalanceBadge from "../components/BalanceBadge.vue";
import { Icon } from "@iconify/vue";

// Определение табов
const tabs = [
  {
    name: "Продажи",
    icon: "mdi:truck",
    description: "Рейтинг по количеству проданных автомобилей",
  },
  {
    name: "Прибыль",
    icon: "mdi:chart-bar",
    description: "Рейтинг по размеру полученной прибыли",
  },
  {
    name: "Капитал",
    icon: "mdi:currency-usd",
    description: "Рейтинг по общему размеру капитала",
  },
];

// Активный таб
const activeTab = ref(0);

// Мои статистические данные
const myStats = [
  { value: 42, trend: 5 }, // Продажи
  { value: 15650, trend: -3 }, // Прибыль
  { value: 76240, trend: 12 }, // Капитал
];

// Данные игроков
const players = ref([
  {
    id: 1,
    name: "Алексей Перекупов",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    online: true,
    badge: "Мастер-перекуп",
    isMe: false,
    stats: [
      { value: 128, trend: 8, details: "128 автомобилей продано" },
      { value: 87620, trend: 15, details: "$87,620 прибыли" },
      { value: 236500, trend: 7, details: "$236,500 общий капитал" },
    ],
  },
  {
    id: 2,
    name: "Мария Автодилер",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    online: false,
    badge: "",
    isMe: false,
    stats: [
      { value: 95, trend: 3, details: "95 автомобилей продано" },
      { value: 64180, trend: -2, details: "$64,180 прибыли" },
      { value: 178000, trend: 4, details: "$178,000 общий капитал" },
    ],
  },
  {
    id: 3,
    name: "Иван Моторс",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    online: true,
    badge: "Новичок",
    isMe: false,
    stats: [
      { value: 87, trend: -5, details: "87 автомобилей продано" },
      { value: 56420, trend: 0, details: "$56,420 прибыли" },
      { value: 124750, trend: 2, details: "$124,750 общий капитал" },
    ],
  },
  {
    id: 4,
    name: "Анна Колёсико",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    online: false,
    badge: "",
    isMe: false,
    stats: [
      { value: 76, trend: 12, details: "76 автомобилей продано" },
      { value: 41820, trend: 6, details: "$41,820 прибыли" },
      { value: 92300, trend: 8, details: "$92,300 общий капитал" },
    ],
  },
  {
    id: 5,
    name: "Игорь Драйвер",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    online: true,
    badge: "",
    isMe: true, // это я
    stats: [
      { value: 42, trend: 5, details: "42 автомобиля продано" },
      { value: 15650, trend: -3, details: "$15,650 прибыли" },
      { value: 76240, trend: 12, details: "$76,240 общий капитал" },
    ],
  },
  {
    id: 6,
    name: "Ольга Форсаж",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    online: false,
    badge: "",
    isMe: false,
    stats: [
      { value: 39, trend: -2, details: "39 автомобилей продано" },
      { value: 13420, trend: 4, details: "$13,420 прибыли" },
      { value: 62150, trend: -1, details: "$62,150 общий капитал" },
    ],
  },
  {
    id: 7,
    name: "Дмитрий Автомобилист",
    avatar: "https://randomuser.me/api/portraits/men/57.jpg",
    online: true,
    badge: "",
    isMe: false,
    stats: [
      { value: 31, trend: 2, details: "31 автомобиль продан" },
      { value: 10250, trend: 7, details: "$10,250 прибыли" },
      { value: 45680, trend: 3, details: "$45,680 общий капитал" },
    ],
  },
]);

// Получение отсортированных игроков по активному табу
const getFilteredPlayers = () => {
  return [...players.value].sort((a, b) => {
    return b.stats[activeTab.value].value - a.stats[activeTab.value].value;
  });
};

// Форматирование значения в зависимости от типа рейтинга
const formatValue = (value: number) => {
  if (activeTab.value === 0) {
    return value; // Количество продаж
  } else {
    return `$${value.toLocaleString()}`; // Денежные значения
  }
};

// Получение класса для тренда (положительный/отрицательный/нейтральный)
const getTrendClass = (trend: number) => {
  if (trend > 0) return "text-emerald-500";
  if (trend < 0) return "text-red-500";
  return "text-slate-500";
};

// Получение иконки для тренда
const getTrendIcon = (trend: number) => {
  if (trend > 0) return "mdi:arrow-up-bold";
  if (trend < 0) return "mdi:arrow-down-bold";
  return "mdi:minus";
};
</script>

<style scoped>
/* Анимация для списка */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

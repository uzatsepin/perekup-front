<template>
  <div class="pb-4">
    <!-- Шапка страницы -->
    <div class="relative mb-6">
      <div
        class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 h-32 -mx-4"
      ></div>

      <div class="relative pt-6 px-1">
        <!-- Верхняя строка с заголовком и балансом -->
        <div class="flex justify-between items-center mb-6">
          <div class="fade-in text-white">
            <h1 class="text-2xl font-bold">Рейтинг игроков</h1>
            <p class="text-blue-100 text-sm">Соревнуйтесь с другими игроками</p>
          </div>
          <BalanceBadge :balance="5000" />
        </div>

        <!-- Моя позиция в рейтинге -->
        <div
          class="bg-white rounded-xl shadow-md p-4 mb-4 scale-in"
          style="animation-delay: 0.1s"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="relative">
                <div
                  class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-md"
                >
                  <Icon icon="mdi:account" class="w-8 h-8" />
                </div>
                <div
                  class="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-600 border-2 border-blue-100 shadow-sm"
                >
                  {{ getMyRank() }}
                </div>
              </div>
              <div class="ml-3">
                <div class="font-bold text-slate-800">Вы</div>
                <div class="text-xs text-slate-500">Ваше место в рейтинге</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-blue-600">
                {{ formatValue(myStats[activeTab].value) }}
              </div>
              <div
                class="flex items-center text-xs font-medium"
                :class="getTrendClass(myStats[activeTab].trend)"
              >
                <Icon
                  :icon="getTrendIcon(myStats[activeTab].trend)"
                  class="w-3.5 h-3.5 mr-0.5"
                />
                {{ Math.abs(myStats[activeTab].trend) }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Табы рейтинга -->
    <div
      class="bg-white rounded-xl shadow-md mb-5 overflow-hidden fade-in"
      style="animation-delay: 0.2s"
    >
      <div class="flex border-b border-slate-100">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="activeTab = index"
          class="flex-1 py-3.5 px-2 text-center font-medium transition-colors relative"
          :class="
            activeTab === index ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
          "
        >
          <div class="flex items-center justify-center">
            <Icon :icon="tab.icon" class="w-5 h-5 mr-1.5" />
            {{ tab.name }}
          </div>
          <div
            v-if="activeTab === index"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          ></div>
        </button>
      </div>

      <!-- Описание выбранного рейтинга -->
      <div class="px-4 py-3 border-b border-slate-100 bg-slate-50">
        <p class="text-sm text-slate-600">{{ tabs[activeTab].description }}</p>
      </div>
    </div>

    <!-- Список рейтинга -->
    <div class="space-y-3 slide-up" style="animation-delay: 0.3s">
      <!-- Первое место (Особое оформление) -->
      <div
        v-if="getFilteredPlayers().length > 0"
        class="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl shadow-md overflow-hidden border border-yellow-200"
      >
        <div class="p-5">
          <div class="flex items-center">
            <!-- Медаль первого места -->
            <div class="flex-none relative">
              <div
                class="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-amber-300 flex items-center justify-center shadow-md"
              >
                <Icon icon="mdi:trophy" class="w-9 h-9 text-white" />
              </div>
              <div
                class="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-sm font-bold text-amber-600 border-2 border-amber-200"
              >
                1
              </div>
            </div>

            <!-- Информация о игроке -->
            <div class="ml-4 flex-grow">
              <div class="flex items-center">
                <div class="font-bold text-lg">{{ getFilteredPlayers()[0].name }}</div>
                <div
                  v-if="getFilteredPlayers()[0].isMe"
                  class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-500 text-xs rounded-full"
                >
                  Вы
                </div>
                <div
                  v-if="getFilteredPlayers()[0].badge"
                  class="ml-2 px-2 py-0.5 bg-amber-100 text-amber-600 text-xs rounded-full"
                >
                  {{ getFilteredPlayers()[0].badge }}
                </div>
                <div
                  v-if="getFilteredPlayers()[0].online"
                  class="ml-2 flex items-center text-emerald-500 text-xs"
                >
                  <div class="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div>
                  Онлайн
                </div>
              </div>
              <div class="text-sm text-slate-600 mt-1">
                {{ getFilteredPlayers()[0].stats[activeTab].details }}
              </div>
            </div>

            <!-- Значение рейтинга и тренд -->
            <div class="flex-none text-right">
              <div
                class="text-xl font-bold"
                :class="{
                  'text-blue-500': getFilteredPlayers()[0].isMe,
                  'text-amber-600': !getFilteredPlayers()[0].isMe,
                }"
              >
                {{ formatValue(getFilteredPlayers()[0].stats[activeTab].value) }}
              </div>
              <div
                class="flex items-center justify-end text-sm font-medium"
                :class="getTrendClass(getFilteredPlayers()[0].stats[activeTab].trend)"
              >
                <Icon
                  :icon="getTrendIcon(getFilteredPlayers()[0].stats[activeTab].trend)"
                  class="w-4 h-4 mr-0.5"
                />
                {{ Math.abs(getFilteredPlayers()[0].stats[activeTab].trend) }}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Остальные игроки -->
      <transition-group name="list" tag="div" class="space-y-3">
        <div
          v-for="(player, index) in getFilteredPlayers().slice(1)"
          :key="player.id"
          class="bg-white rounded-xl shadow-sm overflow-hidden border"
          :class="player.isMe ? 'border-blue-200 bg-blue-50/50' : 'border-slate-200'"
        >
          <div class="p-4">
            <div class="flex items-center">
              <!-- Место в рейтинге -->
              <div class="flex-none relative">
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
                  :class="{
                    'bg-gradient-to-br from-gray-300 to-gray-400 text-white': index === 0,
                    'bg-gradient-to-br from-amber-200 to-amber-300 text-white':
                      index === 1,
                    'bg-slate-100 text-slate-500': index > 1,
                  }"
                >
                  <Icon v-if="index <= 1" icon="mdi:trophy" class="w-6 h-6" />
                  <span v-else class="font-bold">{{ index + 2 }}</span>
                </div>
                <div
                  v-if="player.online"
                  class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
                ></div>
              </div>

              <!-- Информация о игроке -->
              <div class="ml-3 flex-grow min-w-0">
                <div class="flex items-center flex-wrap">
                  <div class="font-medium">{{ player.name }}</div>
                  <div
                    v-if="player.isMe"
                    class="ml-1.5 px-1.5 py-0.5 bg-blue-100 text-blue-500 text-xs rounded-full"
                  >
                    Вы
                  </div>
                  <div
                    v-if="player.badge"
                    class="ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full"
                  >
                    {{ player.badge }}
                  </div>
                </div>
                <div class="text-xs text-slate-500 mt-0.5">
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
                    class="w-3.5 h-3.5 mr-0.5"
                  />
                  {{ Math.abs(player.stats[activeTab].trend) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Пустой рейтинг (если нет данных) -->
      <div
        v-if="getFilteredPlayers().length === 0"
        class="bg-white rounded-xl shadow-md p-12 text-center"
      >
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BalanceBadge from "../components/BalanceBadge.vue";
import { Icon } from "@iconify/vue";

// Определение табов
const tabs = [
  {
    name: "Продажи",
    icon: "mdi:car-multiple",
    description: "Рейтинг по количеству проданных автомобилей за всё время",
  },
  {
    name: "Прибыль",
    icon: "mdi:currency-usd",
    description: "Рейтинг по размеру полученной прибыли от сделок",
  },
  {
    name: "Капитал",
    icon: "mdi:wallet",
    description: "Рейтинг по общему размеру капитала включая стоимость автомобилей",
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

// Получение моего места в рейтинге
const getMyRank = () => {
  const sortedPlayers = getFilteredPlayers();
  for (let i = 0; i < sortedPlayers.length; i++) {
    if (sortedPlayers[i].isMe) {
      return i + 1;
    }
  }
  return "-";
};

// Форматирование значения в зависимости от типа рейтинга
const formatValue = (value: number) => {
  if (activeTab.value === 0) {
    return value.toLocaleString(); // Количество продаж
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
  transform: translateY(20px);
}

/* Дополнительные анимации для элементов списка */
@keyframes pulse-light {
  0%,
  100% {
    background-color: transparent;
  }
  50% {
    background-color: rgba(59, 130, 246, 0.05);
  }
}

.highlight-new {
  animation: pulse-light 2s ease;
}
</style>

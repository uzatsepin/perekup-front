<template>
  <div class="pb-4">
    <!-- Шапка страницы -->
    <RatingViewHeader
      :my-stats="myStats"
      :active-tab="activeTab"
      :my-rank="getMyRank()"
    />

    <!-- Табы рейтинга -->
    <RatingTabs :tabs="tabs" :active-tab="activeTab" @change-tab="activeTab = $event" />

    <!-- Список рейтинга -->
    <div class="space-y-3 slide-up" style="animation-delay: 0.3s">
      <!-- Первое место (Особое оформление) -->
      <RatingTopPlayerCard
        v-if="getFilteredPlayers().length > 0"
        :player="getFilteredPlayers()[0]"
        :active-tab="activeTab"
      />

      <!-- Остальные игроки -->
      <transition-group name="list" tag="div" class="space-y-3">
        <RatingPlayerCard
          v-for="(player, index) in getFilteredPlayers().slice(1)"
          :key="player.id"
          :player="player"
          :index="index"
          :active-tab="activeTab"
          :position="index + 2"
        />
      </transition-group>

      <!-- Пустой рейтинг (если нет данных) -->
      <RatingEmptyState v-if="getFilteredPlayers().length === 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RatingViewHeader from "@/components/Rating/RatingViewHeader.vue";
import RatingTabs from "@/components/Rating/RatingTabs.vue";
import RatingTopPlayerCard from "@/components/Rating/RatingTopPlayerCard.vue";
import RatingPlayerCard from "@/components/Rating/RatingPlayerCard.vue";
import RatingEmptyState from "@/components/Rating/RatingEmptyState.vue";
import type { Player, PlayerStats, Tab } from "@/types/rating";

// Определение табов
const tabs: Tab[] = [
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
const myStats: PlayerStats[] = [
  { value: 42, trend: 5 }, // Продажи
  { value: 15650, trend: -3 }, // Прибыль
  { value: 76240, trend: 12 }, // Капитал
];

// Данные игроков
const players = ref<Player[]>([
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
</style>

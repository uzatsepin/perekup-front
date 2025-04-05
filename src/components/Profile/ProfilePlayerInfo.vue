<template>
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
          @click="emit('claimDailyBonus')"
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
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  playerName: {
    type: String,
    required: true,
  },
  playerTitle: {
    type: String,
    default: "Игрок",
  },
  userAvatar: {
    type: String,
    default: "",
  },
  userLevel: {
    type: Number,
    default: 1,
  },
  xpProgress: {
    type: Object,
    default: () => ({
      current: 0,
      max: 1000,
    }),
  },
  dailyBonusAvailable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["claimDailyBonus"]);
</script>

<style scoped></style>

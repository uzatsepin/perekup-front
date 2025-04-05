<template>
  <div
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
            <div class="font-bold text-lg">{{ player.name }}</div>
            <div
              v-if="player.isMe"
              class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-500 text-xs rounded-full"
            >
              Вы
            </div>
            <div
              v-if="player.badge"
              class="ml-2 px-2 py-0.5 bg-amber-100 text-amber-600 text-xs rounded-full"
            >
              {{ player.badge }}
            </div>
            <div
              v-if="player.online"
              class="ml-2 flex items-center text-emerald-500 text-xs"
            >
              <div class="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div>
              Онлайн
            </div>
          </div>
          <div class="text-sm text-slate-600 mt-1">
            {{ player.stats[activeTab].details }}
          </div>
        </div>

        <!-- Значение рейтинга и тренд -->
        <div class="flex-none text-right">
          <div
            class="text-xl font-bold"
            :class="{ 'text-blue-500': player.isMe, 'text-amber-600': !player.isMe }"
          >
            {{ formatValue(player.stats[activeTab].value) }}
          </div>
          <div
            class="flex items-center justify-end text-sm font-medium"
            :class="getTrendClass(player.stats[activeTab].trend)"
          >
            <Icon
              :icon="getTrendIcon(player.stats[activeTab].trend)"
              class="w-4 h-4 mr-0.5"
            />
            {{ Math.abs(player.stats[activeTab].trend) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { Player } from "@/types/rating";
import { formatValue, getTrendClass, getTrendIcon } from "@/utils/ratingUtils";

defineProps({
  player: {
    type: Object as () => Player,
    required: true,
  },
  activeTab: {
    type: Number,
    required: true,
  },
});
</script>

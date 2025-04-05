<template>
  <div
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
              'bg-gradient-to-br from-amber-200 to-amber-300 text-white': index === 1,
              'bg-slate-100 text-slate-500': index > 1,
            }"
          >
            <Icon v-if="index <= 1" icon="mdi:trophy" class="w-6 h-6" />
            <span v-else class="font-bold">{{ position }}</span>
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
  index: {
    type: Number,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  activeTab: {
    type: Number,
    required: true,
  },
});
</script>

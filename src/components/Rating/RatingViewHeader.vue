<template>
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
        <BalanceBadge />
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
                {{ myRank }}
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
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import BalanceBadge from "@/components/BalanceBadge.vue";
import type { PlayerStats } from "@/types/rating";
import { formatValue, getTrendClass, getTrendIcon } from "@/utils/ratingUtils";

defineProps({
  myStats: {
    type: Array as () => PlayerStats[],
    required: true,
  },
  activeTab: {
    type: Number,
    required: true,
  },
  myRank: {
    type: [Number, String],
    required: true,
  },
});
</script>

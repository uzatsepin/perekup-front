<template>
  <div
    v-if="showTopUpModal"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-lg w-full max-w-sm p-5 scale-in">
      <h3 class="font-bold text-lg mb-4">Пополнение баланса</h3>

      <div class="space-y-4 mb-5">
        <div
          @click="topUpMethod = 'stars'"
          class="border rounded-lg p-4 flex items-center cursor-pointer transition-colors"
          :class="
            topUpMethod === 'stars'
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 hover:border-blue-300'
          "
        >
          <div
            class="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mr-3"
          >
            <Icon icon="mdi:star" class="h-5 w-5" />
          </div>
          <div class="flex-1">
            <div class="font-medium">Telegram Stars</div>
            <div class="text-xs text-slate-500">1 Star = $10</div>
          </div>
          <div
            class="h-5 w-5 rounded-full border border-slate-300 flex items-center justify-center"
          >
            <div
              v-if="topUpMethod === 'stars'"
              class="h-3 w-3 rounded-full bg-blue-500"
            ></div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-slate-700 mb-1"
            >Сумма пополнения</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <span class="text-slate-500">$</span>
            </div>
            <input
              v-model="topUpAmount"
              type="number"
              class="block w-full pl-7 py-2 border border-slate-300 rounded-md"
              placeholder="0"
              :disabled="topUpMethod === 'stars'"
            />
          </div>
          <p v-if="topUpMethod === 'stars'" class="mt-1 text-xs text-slate-500">
            Количество Stars: {{ calculateStars() }}
          </p>
        </div>
      </div>

      <div class="flex space-x-3">
        <button
          @click.prevent="closeTopUpModal"
          class="flex-1 bg-slate-200 hover:bg-slate-300 py-2 rounded-md text-slate-800"
        >
          Отмена
        </button>
        <button
          @click="processTopUp"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
          :disabled="topUpAmount <= 0"
        >
          Подтвердить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useBalanceStore } from "@/stores/balance";
import { computed } from "vue";

const balanceStore = useBalanceStore();
const showTopUpModal = computed(() => balanceStore.showTopUpModal);
const closeTopUpModal = computed(() => balanceStore.closeTopUpModal);

const processTopUp = balanceStore.processTopUp;
const topUpMethod = balanceStore.topUpMethod;
const topUpAmount = balanceStore.topUpAmount;
const calculateStars = balanceStore.calculateStars;
</script>

<style scoped></style>

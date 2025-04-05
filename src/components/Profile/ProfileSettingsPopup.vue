<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    @click.self="$emit('update:modelValue', false)"
  >
    <div class="bg-white rounded-lg w-full max-w-sm p-5 scale-in">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-lg">Настройки</h3>
        <button
          @click="$emit('update:modelValue', false)"
          class="text-slate-400 hover:text-slate-600"
        >
          <Icon icon="mdi:close" class="h-5 w-5" />
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Имя игрока</label>
          <input
            v-model="playerNameModel"
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
                themeModel === 'light'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-slate-300 text-slate-700'
              "
              @click="themeModel = 'light'"
            >
              <Icon icon="mdi:white-balance-sunny" class="h-4 w-4 mr-1" />
              Светлая
            </button>
            <button
              class="py-2 border rounded-md flex justify-center items-center"
              :class="
                themeModel === 'dark'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-slate-300 text-slate-700'
              "
              @click="themeModel = 'dark'"
            >
              <Icon icon="mdi:moon-waning-crescent" class="h-4 w-4 mr-1" />
              Тёмная
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Уведомления</label>
          <div class="flex items-center">
            <div class="flex-grow">
              <div class="font-medium text-sm">Ежедневный бонус</div>
              <div class="text-xs text-slate-500">Уведомлять, когда доступен бонус</div>
            </div>
            <div>
              <button
                class="w-12 h-6 rounded-full transition-colors duration-200"
                :class="notificationsModel.dailyBonus ? 'bg-blue-500' : 'bg-slate-300'"
                @click="notificationsModel.dailyBonus = !notificationsModel.dailyBonus"
              >
                <div
                  class="w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200"
                  :class="
                    notificationsModel.dailyBonus ? 'translate-x-6' : 'translate-x-1'
                  "
                ></div>
              </button>
            </div>
          </div>
        </div>

        <button
          class="w-full py-2 bg-blue-500 text-white rounded-lg"
          @click="saveSettings"
        >
          Сохранить настройки
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  playerName: {
    type: String,
    required: true,
  },
  currentTheme: {
    type: String,
    required: true,
  },
  notifications: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "update:playerName",
  "update:currentTheme",
  "update:notifications",
  "save",
]);

// Создаем реактивные модели для двусторонней привязки данных
const playerNameModel = computed({
  get: () => props.playerName,
  set: (value) => emit("update:playerName", value),
});

const themeModel = computed({
  get: () => props.currentTheme,
  set: (value) => emit("update:currentTheme", value),
});

const notificationsModel = computed({
  get: () => props.notifications,
  set: (value) => emit("update:notifications", value),
});

const saveSettings = () => {
  emit("save");
  emit("update:modelValue", false);
};
</script>

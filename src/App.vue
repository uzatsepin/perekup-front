<!-- @ts-nocheck -->
<template>
  <div class="app-container min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col">
    <main class="flex-1 px-4 pb-20 overflow-y-auto">
      <RouterView v-slot="{ Component }">
        <transition
          name="page-transition"
          @enter="startPageTransition"
          @after-enter="endPageTransition"
        >
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <AppNavigation />

    <Transition name="fade">
      <LoadingCar v-if="isLoading" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted, ref } from "vue";
import AppNavigation from "./components/AppNavigation.vue";
import LoadingCar from "./components/LoadingCar.vue";

// Declare Telegram type for the window object
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        backgroundColor: string;
        headerColor: string;
        accentColor: string;
      };
    };
  }
}

// eslint-disable-next-line
const telegramWebApp = ref<any>(null);
const isLoading = ref(false);

const startPageTransition = () => {
  isLoading.value = true;
};

const endPageTransition = () => {
  setTimeout(() => {
    isLoading.value = false;
  }, 100);
};

onMounted(() => {
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
  }, 500);

  if (window.Telegram && window.Telegram.WebApp) {
    telegramWebApp.value = window.Telegram.WebApp;

    telegramWebApp.value.ready();

    // Always use light theme for this app
    document.documentElement.classList.remove("dark");

    // Set Telegram WebApp theme to light with updated colors
    telegramWebApp.value.backgroundColor = "#f8fafc"; // slate-50
    telegramWebApp.value.headerColor = "#f1f5f9"; // slate-100
    telegramWebApp.value.accentColor = "#3b82f6"; // blue-500
  }
});
</script>

<style>
:root {
  /* Обновленная цветовая палитра */
  --primary-color: #3b82f6; /* blue-500 */
  --primary-dark: #2563eb; /* blue-600 */
  --primary-light: #60a5fa; /* blue-400 */
  --secondary-color: #f97316; /* orange-500 */
  --secondary-dark: #ea580c; /* orange-600 */
  --secondary-light: #fb923c; /* orange-400 */
  --success-color: #10b981; /* emerald-500 */
  --danger-color: #ef4444; /* red-500 */
  --warning-color: #f59e0b; /* amber-500 */
  --info-color: #6366f1; /* indigo-500 */
  --bg-color: #f8fafc; /* slate-50 */
  --card-color: #ffffff;
  --text-color: #1e293b; /* slate-800 */
  --text-muted: #64748b; /* slate-500 */
  --border-color: #e2e8f0; /* slate-200 */
  --nav-height: 60px;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}

/* Page transitions */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.3s ease;
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Общие классы для анимаций */
.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

.slide-up {
  animation: slideUp 0.5s ease forwards;
}

.scale-in {
  animation: scaleIn 0.3s ease forwards;
}

.bounce-in {
  animation: bounceIn 0.5s ease forwards;
}

/* Определения анимаций */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Пульсирующая анимация для привлечения внимания */
.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Запрет зума на тачскринах */
html {
  touch-action: manipulation;
  -ms-touch-action: manipulation;
}

/* Предотвращение выделения текста, что также может вызывать зум */
body {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Разрешаем выделение для элементов ввода */
input,
textarea {
  -webkit-user-select: auto;
  -khtml-user-select: auto;
  -moz-user-select: auto;
  -ms-user-select: auto;
  user-select: auto;
}

/* Стили для появления и исчезновения анимации загрузки */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

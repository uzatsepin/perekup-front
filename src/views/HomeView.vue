<template>
  <div class="pb-4">
    <!-- Шапка приложения с балансом и приветствием -->
    <div class="relative mb-6">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 h-48 -mx-4"
      ></div>

      <div class="relative pt-6 px-1">
        <!-- Верхняя строка с приветствием и балансом -->
        <div class="flex justify-between items-center mb-6">
          <div class="fade-in text-white">
            <h1 class="text-2xl font-bold">Привет, Игрок!</h1>
            <p class="text-blue-100 text-sm">Твой бизнес автоперекупа ждёт</p>
          </div>
          <BalanceBadge :balance="5000" />
          <!-- <div
            class="bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-white shadow-lg border border-white/20 scale-in"
          >
            <div class="text-xs text-blue-100">Баланс</div>
            <div class="font-bold text-xl flex items-center">
              <Icon icon="mdi:currency-usd" class="mr-1" />
              {{ balance.toLocaleString() }}
            </div>
          </div> -->
        </div>

        <!-- Карточка с краткой информацией о профиле -->
        <div
          class="bg-white rounded-xl shadow-xl p-4 mb-4 scale-in flex items-center"
          @click="goToProfile"
        >
          <div class="relative mr-4">
            <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400">
              <img
                src="https://ui-avatars.com/api/?name=Игрок&background=3b82f6&color=fff&size=100"
                alt="Аватар"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              class="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
            >
              {{ level }}
            </div>
          </div>

          <div class="flex-grow">
            <div class="flex justify-between items-center mb-1">
              <h3 class="font-bold text-slate-800">Ваш профиль</h3>
              <div class="text-xs text-white bg-blue-500 px-2 py-0.5 rounded-full">
                {{ rank }} место
              </div>
            </div>

            <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
              <div
                class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                :style="`width: ${(xp / nextLevelXp) * 100}%`"
              ></div>
            </div>

            <div class="flex justify-between text-xs text-slate-500">
              <span>Опыт: {{ xp }} / {{ nextLevelXp }}</span>
              <span>{{ profit.toLocaleString() }}$ прибыли</span>
            </div>
          </div>

          <Icon icon="mdi:chevron-right" class="text-slate-400 h-5 w-5 ml-2" />
        </div>
      </div>
    </div>

    <!-- Статистика бизнеса -->
    <div class="mb-6 slide-up">
      <h2 class="font-bold text-lg mb-3 flex items-center">
        <Icon icon="mdi:chart-box" class="mr-2 text-blue-500" />
        Статистика бизнеса
      </h2>

      <div class="grid grid-cols-2 gap-3">
        <div
          class="bg-white rounded-xl shadow-sm p-4 border border-slate-100 flex items-center"
        >
          <div
            class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mr-3 shadow-sm"
          >
            <Icon icon="mdi:car" class="w-6 h-6" />
          </div>
          <div>
            <div class="text-2xl font-bold">{{ cars }}</div>
            <div class="text-xs text-slate-500">Автомобилей</div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-sm p-4 border border-slate-100 flex items-center"
        >
          <div
            class="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white mr-3 shadow-sm"
          >
            <Icon icon="mdi:cash" class="w-6 h-6" />
          </div>
          <div>
            <div class="text-2xl font-bold">${{ profit.toLocaleString() }}</div>
            <div class="text-xs text-slate-500">Прибыль</div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-sm p-4 border border-slate-100 flex items-center"
        >
          <div
            class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white mr-3 shadow-sm"
          >
            <Icon icon="mdi:tag-multiple" class="w-6 h-6" />
          </div>
          <div>
            <div class="text-2xl font-bold">{{ sales }}</div>
            <div class="text-xs text-slate-500">Продажи</div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-sm p-4 border border-slate-100 flex items-center"
        >
          <div
            class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white mr-3 shadow-sm"
          >
            <Icon icon="mdi:trophy" class="w-6 h-6" />
          </div>
          <div>
            <div class="text-2xl font-bold">{{ rank }}</div>
            <div class="text-xs text-slate-500">Рейтинг</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Карточки быстрого доступа -->
    <div class="mb-6 slide-up" style="animation-delay: 0.1s">
      <h2 class="font-bold text-lg mb-3 flex items-center">
        <Icon icon="mdi:navigation" class="mr-2 text-blue-500" />
        Быстрый доступ
      </h2>

      <div class="flex space-x-3">
        <button
          @click="goToMarket"
          class="flex-1 bg-white rounded-xl shadow-sm p-4 border border-slate-100 hover:shadow-md transition-shadow"
        >
          <div
            class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mx-auto mb-2"
          >
            <Icon icon="mdi:store" class="w-7 h-7" />
          </div>
          <div class="text-center">
            <div class="font-bold text-slate-800">Авторынок</div>
            <div class="text-xs text-slate-500">Купить авто</div>
          </div>
        </button>

        <button
          @click="goToGarage"
          class="flex-1 bg-white rounded-xl shadow-sm p-4 border border-slate-100 hover:shadow-md transition-shadow"
        >
          <div
            class="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white mx-auto mb-2"
          >
            <Icon icon="mdi:garage" class="w-7 h-7" />
          </div>
          <div class="text-center">
            <div class="font-bold text-slate-800">Мой гараж</div>
            <div class="text-xs text-slate-500">{{ cars }} автомобилей</div>
          </div>
        </button>
      </div>
    </div>

    <!-- Советы перекупщика -->
    <div class="slide-up" style="animation-delay: 0.2s">
      <h2 class="font-bold text-lg mb-3 flex items-center">
        <Icon icon="mdi:lightbulb" class="mr-2 text-amber-500" />
        Советы перекупщика
      </h2>

      <div class="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
        <div class="mb-4 overflow-hidden relative">
          <div
            ref="tipContainer"
            class="whitespace-nowrap transition-transform duration-300"
            :style="{ transform: `translateX(-${currentTipIndex * 100}%)` }"
          >
            <div
              v-for="(tip, i) in tips"
              :key="i"
              class="inline-block w-full whitespace-normal"
            >
              <div class="flex items-start">
                <div
                  class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mr-3 flex-shrink-0"
                >
                  <Icon icon="mdi:lightbulb" class="w-5 h-5" />
                </div>
                <div>
                  <div class="font-medium text-slate-800 mb-1">{{ tip.title }}</div>
                  <p class="text-sm text-slate-500">{{ tip.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Точки навигации для советов -->
        <div class="flex justify-center">
          <button
            v-for="(_, i) in tips"
            :key="i"
            @click="currentTipIndex = i"
            class="w-2 h-2 rounded-full mx-1"
            :class="i === currentTipIndex ? 'bg-blue-500' : 'bg-slate-300'"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import BalanceBadge from "@/components/BalanceBadge.vue";

const router = useRouter();

// Данные пользователя
const balance = ref(5000);
const level = ref(5);
const xp = ref(432);
const nextLevelXp = ref(1000);
const cars = ref(3);
const profit = ref(15250);
const sales = ref(12);
const rank = ref(42);

// Полезные советы
const tips = ref([
  {
    title: "Выбирайте популярные модели",
    content:
      "Автомобили с высоким рейтингом популярности продаются быстрее и по более высокой цене.",
  },
  {
    title: "Починка окупается",
    content:
      "Вложение в ремонт автомобиля почти всегда повышает его рыночную стоимость больше, чем стоит сам ремонт.",
  },
  {
    title: "Следите за рынком",
    content:
      "Цены на авторынке меняются каждый день. Покупайте авто, когда их цена ниже среднерыночной.",
  },
]);

// Для карусели советов
const currentTipIndex = ref(0);
let tipInterval: number | null = null;

// Методы для навигации
const goToMarket = () => {
  router.push("/market");
};

const goToGarage = () => {
  router.push("/garage");
};

const goToProfile = () => {
  router.push("/profile");
};

// Автоматическая смена советов
onMounted(() => {
  tipInterval = window.setInterval(() => {
    currentTipIndex.value = (currentTipIndex.value + 1) % tips.value.length;
  }, 7000); // Каждые 7 секунд
});

onUnmounted(() => {
  if (tipInterval) {
    clearInterval(tipInterval);
  }
});
</script>

<style scoped>
/* Дополнительная стилизация при необходимости */
</style>

<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden fade-in">
    <div class="flex flex-col sm:flex-row">
      <!-- Изображение автомобиля -->
      <div class="relative sm:w-1/3">
        <img
          :src="car.photoUrl"
          :alt="`${car.brand} ${car.model}`"
          class="w-full h-48 sm:h-full object-cover"
        />
        <div
          class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium"
          :class="{
            'bg-emerald-100 text-emerald-600': car.status === 'ready',
            'bg-amber-100 text-amber-600': car.status === 'repair',
            'bg-blue-100 text-blue-600': car.status === 'selling',
          }"
        >
          {{ formatStatus(car.status) }}
        </div>

        <!-- Бейдж популярности -->
        <div
          class="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-full flex items-center"
        >
          <Icon icon="mdi:star" class="w-3.5 h-3.5 mr-0.5 text-amber-400" />
          {{ car.popularityScore }}%
        </div>
      </div>

      <!-- Информация об автомобиле -->
      <div class="p-4 flex-1 flex flex-col">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="text-lg font-bold">{{ car.brand }} {{ car.model }}</h3>
            <p class="text-slate-500 text-sm">{{ car.year }} год</p>
          </div>
          <div>
            <div v-if="car.status === 'selling'" class="text-xl font-bold text-blue-600">
              ${{ car.price?.toLocaleString() }}
            </div>
            <div class="text-sm text-slate-500 text-right">
              Рыночная цена:
              <span class="font-semibold">${{ car.marketValue.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Характеристики -->
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-blue-500 mr-2"
            >
              <Icon icon="mdi:speedometer" class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs text-slate-500">Пробег</div>
              <div class="text-sm font-medium">{{ car.mileage }} км</div>
            </div>
          </div>

          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-blue-500 mr-2"
            >
              <Icon icon="mdi:car-cog" class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs text-slate-500">Состояние</div>
              <div class="text-sm font-medium" :class="getConditionClass(car.condition)">
                {{ car.condition }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Прогресс-бар состояния -->
        <CarConditionProgress :condition="car.condition" />

        <!-- Кнопки действий для мобильных устройств (верт. стек) -->
        <div class="mt-auto flex flex-col sm:flex-row gap-2">
          <button
            @click="emit('goToCarDetails', car.id)"
            class="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center justify-center"
          >
            <Icon icon="mdi:information-outline" class="mr-1.5 w-5 h-5" />
            Подробнее
          </button>

          <div class="flex gap-2">
            <button
              v-if="car.status === 'ready'"
              @click="emit('prepareSellCar', car)"
              class="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <Icon
                icon="mdi:tag-outline"
                class="mr-1.5 w-5 h-5 sm:hidden md:inline-block"
              />
              <span>Продать</span>
            </button>

            <button
              v-if="car.status === 'repair'"
              @click="emit('repairCar', car)"
              class="flex-1 px-3 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center justify-center"
            >
              <Icon icon="mdi:wrench" class="mr-1.5 w-5 h-5 sm:hidden md:inline-block" />
              <span>Починить</span>
            </button>

            <button
              v-if="car.status === 'selling'"
              @click="emit('cancelSale', car)"
              class="flex-1 px-3 py-2 bg-slate-500 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center justify-center"
            >
              <Icon icon="mdi:close" class="mr-1.5 w-5 h-5 sm:hidden md:inline-block" />
              <span>Отменить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { formatStatus } from "@/utils/formatStatus";
import { getConditionClass } from "@/utils/conditionState";
import { useRouter } from "vue-router";
import CarConditionProgress from "../Car/CarConditionProgress.vue";

const router = useRouter();
const props = defineProps({
  car: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["prepareSellCar", "repairCar", "cancelSale", "goToCarDetails"]);
</script>

<style scoped></style>

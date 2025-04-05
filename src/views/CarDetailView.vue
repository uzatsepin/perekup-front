<template>
  <div class="py-4">
    <!-- Верхняя панель с возвратом и балансом -->
    <div class="flex justify-between items-center mb-4">
      <button @click="router.back()" class="flex items-center text-slate-600 font-medium">
        <Icon icon="mdi:arrow-left" class="h-5 w-5 mr-1" />
        Назад
      </button>
      <BalanceBadge :balance="5000" />
    </div>

    <!-- Карточка с детальной информацией об автомобиле -->
    <div v-if="car" class="bg-white rounded-lg shadow-md overflow-hidden mb-4 fade-in">
      <!-- Галерея изображений -->
      <div class="relative">
        <img
          :src="car.photoUrl"
          :alt="`${car.brand} ${car.model}`"
          class="w-full h-56 object-cover"
        />

        <!-- Индикаторы (условно, можно добавить карусель) -->
        <div class="absolute bottom-3 left-0 right-0 flex justify-center">
          <div class="flex space-x-1">
            <span class="w-2 h-2 rounded-full bg-white"></span>
            <span class="w-2 h-2 rounded-full bg-white opacity-50"></span>
            <span class="w-2 h-2 rounded-full bg-white opacity-50"></span>
          </div>
        </div>

        <!-- Бейдж популярности -->
        <div
          class="absolute top-3 left-3 px-2 py-1 bg-black/70 text-white text-xs rounded-full flex items-center"
        >
          <Icon icon="mdi:star" class="w-3.5 h-3.5 mr-1 text-amber-400" />
          {{ car.popularityScore }}% популярность
        </div>
      </div>

      <!-- Название и цена -->
      <div class="p-4">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h1 class="text-xl font-bold">{{ car.brand }} {{ car.model }}</h1>
            <p class="text-slate-500">{{ car.year }} год</p>
          </div>
          <div class="text-2xl font-bold text-blue-600">
            ${{ car.price.toLocaleString() }}
          </div>
        </div>

        <!-- Основные характеристики -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-500 mr-3"
            >
              <Icon icon="mdi:speedometer" class="w-5 h-5" />
            </div>
            <div>
              <div class="text-xs text-slate-500">Пробег</div>
              <div class="font-medium">{{ car.mileage }} км</div>
            </div>
          </div>

          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-500 mr-3"
            >
              <Icon icon="mdi:car-wrench" class="w-5 h-5" />
            </div>
            <div>
              <div class="text-xs text-slate-500">Состояние</div>
              <div class="font-medium" :class="getConditionClass(car.condition)">
                {{ getConditionText(car.condition) }} ({{ car.condition }}%)
              </div>
            </div>
          </div>
        </div>
        <!-- Прогресс-бар состояния -->
        <CarConditionProgress :condition="car.condition" />

        <!-- Проблемы и поломки -->
        <div v-if="car.issues && car.issues.length > 0" class="mb-6">
          <h3 class="font-medium mb-2">Выявленные проблемы</h3>
          <ul class="space-y-2">
            <CarProblemsItem
              v-for="(issue, index) in car.issues"
              :key="index"
              :issue="issue"
            />
          </ul>
        </div>

        <!-- Расчет стоимости ремонта и потенциальной прибыли -->
        <div class="bg-slate-50 p-4 rounded-lg mb-6">
          <h3 class="font-medium mb-3">Финансовый анализ</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Стоимость покупки:</span>
              <span class="text-sm font-medium">${{ car.price.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Оценочная стоимость ремонта:</span>
              <span class="text-sm font-medium"
                >${{ estimateRepairCost(car).toLocaleString() }}</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Рыночная цена после ремонта:</span>
              <span class="text-sm font-medium"
                >${{ estimateMarketValue(car).toLocaleString() }}</span
              >
            </div>
            <div class="border-t border-slate-200 pt-2 mt-2">
              <div class="flex justify-between">
                <span class="text-sm text-slate-600">Потенциальная прибыль:</span>
                <span class="text-sm font-medium text-emerald-600">
                  +${{
                    Math.max(
                      0,
                      estimateMarketValue(car) - car.price - estimateRepairCost(car)
                    ).toLocaleString()
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Кнопка покупки -->
        <button
          @click="confirmPurchase"
          class="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg flex items-center justify-center space-x-2"
        >
          <Icon icon="mdi:cart" class="h-5 w-5" />
          <span>Купить за ${{ car.price.toLocaleString() }}</span>
        </button>
      </div>
    </div>

    <!-- Если автомобиль не найден -->
    <div v-else class="bg-white rounded-lg shadow-md p-8 text-center fade-in">
      <div
        class="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3"
      >
        <Icon icon="mdi:car-off" class="w-8 h-8 text-slate-400" />
      </div>
      <h3 class="font-medium mb-1">Автомобиль не найден</h3>
      <p class="text-slate-500 text-sm mb-4">
        Возможно, машина уже продана или убрана с продажи
      </p>
      <button
        @click="router.push('/market')"
        class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        <Icon icon="mdi:arrow-left" class="h-5 w-5 mr-2" />
        Вернуться на авторынок
      </button>
    </div>

    <!-- Модальное окно подтверждения покупки -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg w-full max-w-sm p-5 scale-in">
        <h3 class="font-bold text-lg mb-2">Подтверждение покупки</h3>
        <p class="text-slate-600 mb-4">
          Вы собираетесь приобрести {{ car?.brand }} {{ car?.model }} ({{ car?.year }}) за
          ${{ car?.price.toLocaleString() }}
        </p>
        <div class="flex space-x-3">
          <button
            @click="showConfirmModal = false"
            class="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700"
          >
            Отмена
          </button>
          <button
            @click="purchaseCar"
            class="flex-1 py-2 bg-blue-500 text-white rounded-lg"
          >
            Купить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Страница с карточкой автомобиля на продаже - из автосалона или авторынка
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BalanceBadge from "../components/BalanceBadge.vue";
import { Icon } from "@iconify/vue";
import { getConditionText } from "@/utils/conditionText";
import { getConditionClass } from "@/utils/conditionState";
import CarProblemsItem from "@/components/Car/CarProblemsItem.vue";
import CarConditionProgress from "@/components/Car/CarConditionProgress.vue";

const route = useRoute();
const router = useRouter();
const carId = parseInt(route.params.id as string);
const showConfirmModal = ref(false);

// Типы для автомобиля
interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  condition: number;
  mileage: number;
  price: number;
  photoUrl: string;
  popularityScore: number;
  issues?: string[];
}

// Данные автомобиля (в реальном приложении эти данные будут загружаться по ID)
const car = ref<Car | null>(null);

// Имитация загрузки данных при монтировании компонента
onMounted(() => {
  // В реальном приложении здесь был бы API-запрос
  setTimeout(() => {
    // Имитируем данные автомобиля
    car.value = {
      id: carId,
      brand: "Toyota",
      model: "Camry",
      year: 2015,
      condition: 75,
      mileage: 120000,
      price: 12000,
      photoUrl:
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG95b3RhJTIwY2Ftcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
      popularityScore: 78,
      issues: ["Легкие царапины на бампере", "Требуется замена масла"],
    };
  }, 500);
});

// Расчет стоимости ремонта на основе состояния и выявленных проблем
const estimateRepairCost = (car: Car) => {
  // Базовая формула: чем хуже состояние, тем дороже ремонт
  const baseRepairCost = car.price * 0.3 * (1 - car.condition / 100);

  // Добавляем стоимость за каждую выявленную проблему
  const issuesCost = car.issues ? car.issues.length * 200 : 0;

  return Math.round(baseRepairCost + issuesCost);
};

// Расчет рыночной стоимости после ремонта
const estimateMarketValue = (car: Car) => {
  // Предполагаем, что после ремонта состояние будет 95%
  const marketValue = car.price * 1.3 * (0.8 + car.popularityScore / 100);

  return Math.round(marketValue);
};

// Открытие модального окна подтверждения покупки
const confirmPurchase = () => {
  showConfirmModal.value = true;
};

// Покупка автомобиля
const purchaseCar = () => {
  // В реальном приложении здесь был бы API-запрос на покупку
  showConfirmModal.value = false;

  // Перенаправление в гараж
  router.push("/garage");
};
</script>

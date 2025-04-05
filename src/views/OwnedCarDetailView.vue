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

        <!-- Статусный бейдж в углу -->
        <div
          class="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium"
          :class="{
            'bg-emerald-100 text-emerald-600': car.status === 'ready',
            'bg-amber-100 text-amber-600': car.status === 'repair',
            'bg-blue-100 text-blue-600': car.status === 'selling',
          }"
        >
          {{ formatStatus(car.status) }}
        </div>

        <!-- Индикатор прогресса ремонта (если в ремонте) -->
        <div
          v-if="car.status === 'repair' && car.repairProgress"
          class="absolute bottom-3 left-3 right-3"
        >
          <div class="bg-black/50 backdrop-blur-sm rounded-lg p-2">
            <div class="flex justify-between text-white text-xs mb-1">
              <span>Ремонт</span>
              <span>{{ car.repairProgress }}%</span>
            </div>
            <div class="w-full h-1.5 bg-white/30 rounded-full">
              <div
                class="h-full bg-white rounded-full"
                :style="`width: ${car.repairProgress}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Название и основная информация -->
      <div class="p-4">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h1 class="text-xl font-bold">{{ car.brand }} {{ car.model }}</h1>
            <p class="text-slate-500">{{ car.year }} год</p>
          </div>
          <div>
            <!-- Если выставлен на продажу, показываем цену -->
            <div v-if="car.status === 'selling'" class="text-lg font-bold text-blue-600">
              ${{ car.price?.toLocaleString() }}
            </div>
            <div class="text-sm text-slate-500">
              Рыночная цена: ${{ car.marketValue.toLocaleString() }}
            </div>
          </div>
        </div>

        <!-- Основные характеристики -->
        <div class="grid grid-cols-2 gap-4 mb-5">
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
        <div class="mb-5">
          <div class="flex justify-between items-center mb-1">
            <div class="text-sm font-medium">Состояние автомобиля</div>
            <div class="text-sm text-slate-500">{{ car.condition }}%</div>
          </div>
          <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full"
              :class="{
                'bg-emerald-500': car.condition >= 80,
                'bg-blue-500': car.condition >= 60 && car.condition < 80,
                'bg-amber-500': car.condition >= 40 && car.condition < 60,
                'bg-red-500': car.condition < 40,
              }"
              :style="`width: ${car.condition}%`"
            ></div>
          </div>
        </div>

        <!-- Прогресс-бар популярности -->
        <div class="mb-5">
          <div class="flex justify-between items-center mb-1">
            <div class="text-sm font-medium">Популярность на рынке</div>
            <div class="text-sm text-slate-500">{{ car.popularityScore }}%</div>
          </div>
          <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full"
              :class="{
                'bg-emerald-500': car.popularityScore >= 70,
                'bg-amber-500': car.popularityScore >= 40 && car.popularityScore < 70,
                'bg-red-500': car.popularityScore < 40,
              }"
              :style="`width: ${car.popularityScore}%`"
            ></div>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            {{ getPopularityDescription(car.popularityScore) }}
          </p>
        </div>

        <!-- Проблемы автомобиля (если есть) -->
        <div v-if="car.issues && car.issues.length > 0" class="mb-5">
          <h3 class="font-medium mb-2">Требуется ремонт</h3>
          <ul class="space-y-2">
            <li
              v-for="(issue, i) in car.issues"
              :key="i"
              class="bg-amber-50 p-3 rounded-lg"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start">
                  <Icon
                    icon="mdi:wrench"
                    class="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <span class="text-sm">{{ issue.description }}</span>
                    <div class="text-xs text-slate-500 mt-1">
                      Сложность:
                      <span
                        :class="{
                          'text-green-600': issue.complexity === 'easy',
                          'text-amber-600': issue.complexity === 'medium',
                          'text-red-600': issue.complexity === 'hard',
                        }"
                      >
                        {{ getComplexityText(issue.complexity) }}
                      </span>
                      <span class="mx-1">•</span>
                      Время: {{ formatRepairTime(issue.repairTimeHours) }}
                    </div>
                  </div>
                </div>

                <span class="text-amber-600 font-medium">${{ issue.repairCost }}</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Информация о владении -->
        <div class="bg-slate-50 p-4 rounded-lg mb-5">
          <h3 class="font-medium mb-3">Информация о владении</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-600">Дата покупки:</span>
              <span class="font-medium">{{ formatDate(car.purchaseDate) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600">Стоимость покупки:</span>
              <span class="font-medium">${{ car.purchasePrice.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600">Вложено в ремонт:</span>
              <span class="font-medium"
                >${{ car.repairInvestment.toLocaleString() }}</span
              >
            </div>
            <div class="border-t border-slate-200 pt-2 mt-2">
              <div class="flex justify-between">
                <span class="text-slate-600">Общие вложения:</span>
                <span class="font-medium"
                  >${{
                    (car.purchasePrice + car.repairInvestment).toLocaleString()
                  }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Кнопки действий в зависимости от статуса -->
        <div class="space-y-3">
          <!-- Кнопки для автомобиля в состоянии готовности -->
          <template v-if="car.status === 'ready'">
            <button
              @click="showSellModal = true"
              class="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg flex items-center justify-center"
            >
              <Icon icon="mdi:tag-outline" class="h-5 w-5 mr-2" />
              Выставить на продажу
            </button>

            <button
              @click="improveCondition"
              class="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium rounded-lg flex items-center justify-center"
            >
              <Icon icon="mdi:car-wrench" class="h-5 w-5 mr-2" />
              Улучшить состояние за ${{ getImproveCost() }}
            </button>
          </template>

          <!-- Кнопки для автомобиля в ремонте -->
          <template v-if="car.status === 'repair'">
            <button
              @click="showRepairNowModal = true"
              class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg flex items-center justify-center"
            >
              <Icon icon="mdi:wrench" class="h-5 w-5 mr-2" />
              Починить сейчас за ${{ getRepairCost() }}
            </button>

            <div class="text-center text-sm text-slate-500 mt-1">
              Ремонт завершится через {{ getTimeLeft() }}
            </div>
          </template>

          <!-- Кнопки для автомобиля на продаже -->
          <template v-if="car.status === 'selling'">
            <button
              @click="cancelSale"
              class="w-full py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-lg flex items-center justify-center"
            >
              <Icon icon="mdi:close" class="h-5 w-5 mr-2" />
              Отменить продажу
            </button>

            <div class="text-center text-sm text-slate-500 mt-1">
              Выставлен на продажу {{ getTimeAgo(car.sellingStartDate) }}
            </div>
          </template>
        </div>
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
        Возможно, автомобиль был продан или данные недоступны
      </p>
      <button
        @click="router.push('/garage')"
        class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        <Icon icon="mdi:arrow-left" class="h-5 w-5 mr-2" />
        Вернуться в гараж
      </button>
    </div>

    <!-- Модальное окно выставления на продажу -->
    <div
      v-if="showSellModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg w-full max-w-sm p-5 scale-in">
        <h3 class="font-bold text-lg mb-2">Выставить на продажу</h3>

        <p class="text-sm text-slate-600 mb-4">
          Рыночная стоимость:
          <span class="font-semibold">${{ car?.marketValue.toLocaleString() }}</span>
        </p>

        <div class="mb-4">
          <label class="block text-sm font-medium text-slate-700 mb-1"
            >Цена продажи</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <span class="text-slate-500">$</span>
            </div>
            <input
              v-model="sellPrice"
              type="number"
              class="block w-full pl-7 pr-12 py-2 border border-slate-300 rounded-md"
              placeholder="0"
            />
          </div>
          <p class="mt-1 text-xs text-slate-500">
            Рекомендуемая цена: ${{ Math.round((car?.marketValue || 0) * 1.1) }}
          </p>
        </div>

        <div class="flex space-x-3">
          <button
            @click="showSellModal = false"
            class="flex-1 bg-slate-200 hover:bg-slate-300 py-2 rounded-md text-slate-800"
          >
            Отмена
          </button>
          <button
            @click="sellCar"
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно подтверждения ремонта -->
    <div
      v-if="showRepairModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg w-full max-w-sm p-5 scale-in">
        <h3 class="font-bold text-lg mb-2">Ремонт автомобиля</h3>

        <div class="mb-4">
          <div class="text-sm text-slate-600 mb-3">
            Выберите, какие проблемы вы хотите устранить:
          </div>

          <div v-if="car?.issues && car.issues.length > 0" class="space-y-2">
            <div
              v-for="(issue, i) in car.issues"
              :key="i"
              class="flex items-center justify-between border rounded-lg p-2.5 cursor-pointer"
              :class="
                selectedIssues.includes(i)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200'
              "
              @click="toggleIssueSelection(i)"
            >
              <div class="flex items-start">
                <div
                  class="w-5 h-5 rounded border mr-2 flex items-center justify-center flex-shrink-0"
                  :class="
                    selectedIssues.includes(i)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-slate-300'
                  "
                >
                  <Icon
                    v-if="selectedIssues.includes(i)"
                    icon="mdi:check"
                    class="w-4 h-4 text-white"
                  />
                </div>
                <div>
                  <div class="text-sm font-medium">{{ issue.description }}</div>
                  <div class="text-xs text-slate-500">
                    {{ formatRepairTime(issue.repairTimeHours) }}
                  </div>
                </div>
              </div>
              <div class="text-amber-600 font-medium">${{ issue.repairCost }}</div>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center mb-4 p-3 bg-slate-50 rounded-lg">
          <div>
            <div class="text-sm font-medium">Общая стоимость:</div>
            <div class="text-xs text-slate-500">Время: {{ getTotalRepairTime() }}</div>
          </div>
          <div class="text-lg font-bold text-blue-600">
            ${{ getSelectedRepairCost() }}
          </div>
        </div>

        <div class="flex space-x-3">
          <button
            @click="showRepairModal = false"
            class="flex-1 bg-slate-200 hover:bg-slate-300 py-2 rounded-md text-slate-800"
          >
            Отмена
          </button>
          <button
            @click="startRepair"
            class="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-md"
            :disabled="selectedIssues.length === 0"
          >
            Починить
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно мгновенного ремонта -->
    <div
      v-if="showRepairNowModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg w-full max-w-sm p-5 scale-in">
        <h3 class="font-bold text-lg mb-2">Быстрый ремонт</h3>

        <p class="text-sm text-slate-600 mb-4">
          Вы можете мгновенно завершить ремонт, заплатив за срочность:
        </p>

        <div class="flex justify-between items-center mb-4 p-3 bg-slate-50 rounded-lg">
          <div>
            <div class="text-sm font-medium">Стоимость:</div>
            <div class="text-xs text-slate-500">
              Сейчас в ремонте: {{ getTimeLeft() }}
            </div>
          </div>
          <div class="text-lg font-bold text-blue-600">${{ getRepairCost() }}</div>
        </div>

        <div class="flex space-x-3">
          <button
            @click="showRepairNowModal = false"
            class="flex-1 bg-slate-200 hover:bg-slate-300 py-2 rounded-md text-slate-800"
          >
            Отмена
          </button>
          <button
            @click="repairNow"
            class="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-md"
          >
            Починить сейчас
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Страница с карточкой автомобиля из вашего гаража (уже купленного)
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import BalanceBadge from "../components/BalanceBadge.vue";
import { Icon } from "@iconify/vue";

const route = useRoute();
const router = useRouter();
const carId = parseInt(route.params.id as string);
const showSellModal = ref(false);
const showRepairModal = ref(false);
const showRepairNowModal = ref(false);
const sellPrice = ref(0);
const selectedIssues = ref<number[]>([]);

// Сложность ремонта
type RepairComplexity = "easy" | "medium" | "hard";

// Интерфейс для проблемы автомобиля
interface CarIssue {
  description: string;
  repairCost: number;
  repairTimeHours: number;
  complexity: RepairComplexity;
}

// Обновленный интерфейс типа для автомобиля
interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  condition: number;
  mileage: number;
  status: "ready" | "repair" | "selling";
  photoUrl: string;
  popularityScore: number;
  marketValue: number;
  purchaseDate: Date;
  purchasePrice: number;
  repairInvestment: number;
  price?: number;
  repairProgress?: number;
  repairEndTime?: Date;
  sellingStartDate?: Date;
  issues?: CarIssue[];
}

// Данные автомобиля
const car = ref<Car | null>(null);

// Загрузка данных при монтировании компонента
onMounted(() => {
  // Пытаемся получить данные автомобиля из localStorage
  const savedCarData = localStorage.getItem("selectedCar");

  if (savedCarData) {
    try {
      const parsedData = JSON.parse(savedCarData);

      // Преобразуем строки дат обратно в объекты Date
      if (parsedData.purchaseDate) {
        parsedData.purchaseDate = new Date(parsedData.purchaseDate);
      }
      if (parsedData.sellingStartDate) {
        parsedData.sellingStartDate = new Date(parsedData.sellingStartDate);
      }
      if (parsedData.repairEndTime) {
        parsedData.repairEndTime = new Date(parsedData.repairEndTime);
      }

      // Проверяем, правильно ли оформлены проблемы автомобиля
      if (parsedData.issues && Array.isArray(parsedData.issues)) {
        // Если есть старые данные, конвертируем в новый формат
        if (parsedData.issues.length > 0 && typeof parsedData.issues[0] === "string") {
          parsedData.issues = parsedData.issues.map((description: string) => {
            return createIssue(description);
          });
        }
      }

      car.value = parsedData;

      // Устанавливаем рекомендуемую цену продажи
      if (car.value) {
        sellPrice.value = Math.round(car.value.marketValue * 1.1);
        // По умолчанию выбираем все проблемы для ремонта
        if (car.value.issues) {
          selectedIssues.value = car.value.issues.map((_, index) => index);
        }
      }
    } catch (error) {
      console.error("Ошибка при парсинге данных автомобиля:", error);
      loadFallbackData(); // Загружаем запасные данные при ошибке
    }
  } else {
    // Если данных в localStorage нет, используем запасные данные
    loadFallbackData();
  }
});

// Загрузка запасных данных (если нет в localStorage)
const loadFallbackData = () => {
  setTimeout(() => {
    car.value = {
      id: carId,
      brand: "Toyota",
      model: "Camry",
      year: 2015,
      condition: 75,
      mileage: 120000,
      status: "ready",
      photoUrl:
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG95b3RhJTIwY2Ftcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
      popularityScore: 78,
      marketValue: 14500,
      purchaseDate: new Date(2023, 5, 15),
      purchasePrice: 12000,
      repairInvestment: 800,
      issues: [
        {
          description: "Небольшие царапины на бампере",
          repairCost: 200,
          repairTimeHours: 2,
          complexity: "easy",
        },
        {
          description: "Требуется настройка двигателя",
          repairCost: 350,
          repairTimeHours: 4,
          complexity: "medium",
        },
      ],
    };

    // Предустановленная цена продажи
    sellPrice.value = Math.round(car.value.marketValue * 1.1);

    // По умолчанию выбираем все проблемы для ремонта
    if (car.value.issues) {
      selectedIssues.value = car.value.issues.map((_, index) => index);
    }
  }, 300);
};

// Создание стандартного объекта проблемы из описания
const createIssue = (description: string): CarIssue => {
  // В зависимости от описания определяем сложность и затраты
  let complexity: RepairComplexity = "medium";
  let repairCost = 300;
  let repairTimeHours = 3;

  if (
    description.toLowerCase().includes("царапин") ||
    description.toLowerCase().includes("мелк") ||
    description.toLowerCase().includes("настройк")
  ) {
    complexity = "easy";
    repairCost = Math.floor(Math.random() * 100) + 100; // 100-200
    repairTimeHours = Math.floor(Math.random() * 3) + 1; // 1-3 часа
  } else if (
    description.toLowerCase().includes("двигател") ||
    description.toLowerCase().includes("тормоз") ||
    description.toLowerCase().includes("колод")
  ) {
    complexity = "medium";
    repairCost = Math.floor(Math.random() * 300) + 300; // 300-600
    repairTimeHours = Math.floor(Math.random() * 6) + 3; // 3-8 часов
  } else {
    complexity = "hard";
    repairCost = Math.floor(Math.random() * 500) + 600; // 600-1100
    repairTimeHours = Math.floor(Math.random() * 24) + 8; // 8-32 часов
  }

  return {
    description,
    repairCost,
    repairTimeHours,
    complexity,
  };
};

// Переключение выбора проблемы для ремонта
const toggleIssueSelection = (index: number) => {
  const position = selectedIssues.value.indexOf(index);
  if (position !== -1) {
    selectedIssues.value.splice(position, 1);
  } else {
    selectedIssues.value.push(index);
  }
};

// Получение общей стоимости выбранных ремонтов
const getSelectedRepairCost = () => {
  if (!car.value || !car.value.issues) return 0;

  return selectedIssues.value.reduce((total, index) => {
    if (index >= 0 && index < car.value!.issues!.length) {
      return total + car.value!.issues![index].repairCost;
    }
    return total;
  }, 0);
};

// Получение общего времени ремонта в часах
const getTotalRepairTimeHours = () => {
  if (!car.value || !car.value.issues) return 0;

  return selectedIssues.value.reduce((total, index) => {
    if (index >= 0 && index < car.value!.issues!.length) {
      return total + car.value!.issues![index].repairTimeHours;
    }
    return total;
  }, 0);
};

// Форматирование общего времени ремонта
const getTotalRepairTime = () => {
  const hours = getTotalRepairTimeHours();
  return formatRepairTime(hours);
};

// Получение текста для сложности ремонта
const getComplexityText = (complexity: RepairComplexity) => {
  switch (complexity) {
    case "easy":
      return "Легкий";
    case "medium":
      return "Средний";
    case "hard":
      return "Сложный";
    default:
      return "Средний";
  }
};

// Начало ремонта
const startRepair = () => {
  if (!car.value || selectedIssues.value.length === 0) return;

  // Получаем общую стоимость ремонта
  const repairCost = getSelectedRepairCost();

  // Получаем общее время ремонта в часах
  const repairTimeHours = getTotalRepairTimeHours();

  // Устанавливаем статус "repair" и время окончания ремонта
  car.value.status = "repair";

  // Вычисляем время окончания ремонта
  const now = new Date();
  const repairEndTime = new Date(now.getTime() + repairTimeHours * 60 * 60 * 1000);
  car.value.repairEndTime = repairEndTime;

  // Устанавливаем прогресс ремонта на 0%
  car.value.repairProgress = 0;

  // Добавляем стоимость ремонта к общим затратам
  car.value.repairInvestment += repairCost;

  // Удаляем выбранные проблемы
  car.value.issues = car.value.issues!.filter(
    (_, index) => !selectedIssues.value.includes(index)
  );

  // Сохраняем обновленные данные в localStorage
  localStorage.setItem("selectedCar", JSON.stringify(car.value));

  // Закрываем модальное окно
  showRepairModal.value = false;

  // Сбрасываем выбранные проблемы
  selectedIssues.value = [];
};

// Форматирование времени ремонта
const formatRepairTime = (hours: number) => {
  if (hours < 1) return "Менее часа";

  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);

  if (days === 0) {
    return `${remainingHours} ${formatHours(remainingHours)}`;
  } else {
    if (remainingHours === 0) {
      return `${days} ${formatDays(days)}`;
    } else {
      return `${days} ${formatDays(days)} ${remainingHours} ${formatHours(
        remainingHours
      )}`;
    }
  }
};

// Форматирование даты
const formatDate = (date: Date) => {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Получение времени, прошедшего с определенной даты
const getTimeAgo = (date?: Date) => {
  if (!date) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 24) {
    return `${diffHours} ${formatHours(diffHours)} назад`;
  } else {
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ${formatDays(diffDays)} назад`;
  }
};

// Получение оставшегося времени ремонта
const getTimeLeft = () => {
  if (!car.value || !car.value.repairEndTime) return "";

  const now = new Date();
  const endTime = new Date(car.value.repairEndTime);

  // Если время ремонта уже прошло
  if (now >= endTime) {
    // Автоматически завершаем ремонт
    if (car.value.status === "repair") {
      finishRepair();
    }
    return "завершен";
  }

  const diffMs = endTime.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours < 1) {
    return `${diffMinutes} минут`;
  } else if (diffHours < 24) {
    return `${diffHours} ${formatHours(diffHours)} ${diffMinutes} мин`;
  } else {
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;
    if (remainingHours === 0) {
      return `${diffDays} ${formatDays(diffDays)}`;
    } else {
      return `${diffDays} ${formatDays(diffDays)} ${remainingHours} ${formatHours(
        remainingHours
      )}`;
    }
  }
};

// Завершение ремонта
const finishRepair = () => {
  if (!car.value) return;

  car.value.status = "ready";
  car.value.repairEndTime = undefined;
  car.value.repairProgress = undefined;

  // Обновляем состояние автомобиля (улучшаем)
  car.value.condition = Math.min(100, car.value.condition + 15);

  // Сохраняем обновленные данные в localStorage
  localStorage.setItem("selectedCar", JSON.stringify(car.value));
};

// Расчет стоимости ремонта
const getRepairCost = () => {
  if (!car.value) return 0;

  // Если машина уже в ремонте, рассчитываем стоимость срочного завершения
  if (car.value.status === "repair" && car.value.repairEndTime) {
    const now = new Date();
    const endTime = new Date(car.value.repairEndTime);
    const diffMs = Math.max(0, endTime.getTime() - now.getTime());
    const diffHours = diffMs / (1000 * 60 * 60);

    // Базовая стоимость - зависит от оставшегося времени
    return Math.round(car.value.marketValue * 0.05 * (diffHours / 24 + 0.5));
  }

  // Если есть проблемы, суммируем их стоимость
  if (car.value.issues && car.value.issues.length > 0) {
    return car.value.issues.reduce((total, issue) => total + issue.repairCost, 0);
  }

  // Базовый случай без проблем
  return Math.round(car.value.marketValue * 0.1);
};

// Немедленный ремонт
const repairNow = () => {
  if (!car.value) return;

  // Добавляем стоимость экспресс-ремонта к общим затратам
  car.value.repairInvestment += getRepairCost();

  // Завершаем ремонт
  finishRepair();

  // Улучшаем состояние дополнительно за срочность
  car.value.condition = Math.min(100, car.value.condition + 5);

  // Закрываем модальное окно
  showRepairNowModal.value = false;
};

// Улучшение состояния автомобиля
const improveCondition = () => {
  if (!car.value) return;

  // Показываем модальное окно для ремонта
  showRepairModal.value = true;
};

// Форматирование слова "часов" в зависимости от числа
const formatHours = (hours: number) => {
  if (hours === 1 || (hours > 20 && hours % 10 === 1)) return "час";
  if ([2, 3, 4].includes(hours % 10) && (hours < 10 || hours > 20)) return "часа";
  return "часов";
};

// Форматирование слова "дней" в зависимости от числа
const formatDays = (days: number) => {
  if (days === 1 || (days > 20 && days % 10 === 1)) return "день";
  if ([2, 3, 4].includes(days % 10) && (days < 10 || days > 20)) return "дня";
  return "дней";
};

// Расчет стоимости улучшения состояния
const getImproveCost = () => {
  if (!car.value) return 0;

  // Базовая стоимость улучшения
  const baseCost = 500;

  // Чем лучше состояние, тем дороже улучшение
  const conditionMultiplier = 1 + car.value.condition / 100;

  return Math.round(baseCost * conditionMultiplier);
};

// Получение описания популярности
const getPopularityDescription = (score: number) => {
  if (score >= 80) return "Высокий спрос, быстрая продажа по высокой цене";
  if (score >= 60) return "Хороший спрос, возможна продажа по рыночной цене";
  if (score >= 40) return "Средний спрос, может потребоваться снижение цены";
  return "Низкий спрос, сложная продажа, требуется значительное снижение цены";
};

// Форматирование статуса для отображения
const formatStatus = (status: string) => {
  switch (status) {
    case "ready":
      return "Готов";
    case "repair":
      return "Ремонт";
    case "selling":
      return "Продается";
    default:
      return status;
  }
};

// Получение текста для состояния авто
const getConditionText = (condition: number) => {
  if (condition >= 80) return "Отличное";
  if (condition >= 60) return "Хорошее";
  if (condition >= 40) return "Среднее";
  return "Требует ремонта";
};

// Получение класса для состояния авто
const getConditionClass = (condition: number) => {
  if (condition >= 80) return "text-emerald-500";
  if (condition >= 60) return "text-blue-500";
  if (condition >= 40) return "text-amber-500";
  return "text-red-500";
};

// Выставление на продажу
const sellCar = () => {
  if (!car.value || sellPrice.value <= 0) return;

  // В реальном приложении здесь был бы API-запрос
  car.value.status = "selling";
  car.value.price = sellPrice.value;
  car.value.sellingStartDate = new Date();
  showSellModal.value = false;

  // Сохраняем обновленные данные в localStorage
  localStorage.setItem("selectedCar", JSON.stringify(car.value));
};

// Отмена продажи
const cancelSale = () => {
  if (!car.value) return;

  car.value.status = "ready";
  car.value.price = undefined;
  car.value.sellingStartDate = undefined;

  // Сохраняем обновленные данные в localStorage
  localStorage.setItem("selectedCar", JSON.stringify(car.value));
};
</script>

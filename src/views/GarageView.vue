<template>
  <div class="pb-4">
    <!-- Шапка страницы -->
    <div class="relative mb-6">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 h-32 -mx-4"
      ></div>

      <div class="relative pt-6 px-1">
        <!-- Верхняя строка с заголовком и балансом -->
        <div class="flex justify-between items-center mb-6">
          <div class="fade-in text-white">
            <h1 class="text-2xl font-bold">Мой гараж</h1>
            <p class="text-blue-100 text-sm">Ваши автомобили</p>
          </div>
          <BalanceBadge :balance="5000" />
        </div>

        <!-- Статистика гаража -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div
            class="bg-white rounded-xl shadow-md p-3 flex items-center scale-in"
            style="animation-delay: 0.1s"
          >
            <div
              class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mr-3 shadow-sm"
            >
              <Icon icon="mdi:currency-usd" class="w-6 h-6" />
            </div>
            <div>
              <div class="text-xs text-slate-500">Рыночная стоимость</div>
              <div class="text-lg font-bold">
                ${{ totalMarketValue.toLocaleString() }}
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl shadow-md p-3 flex items-center scale-in"
            style="animation-delay: 0.2s"
          >
            <div
              class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white mr-3 shadow-sm"
            >
              <Icon icon="mdi:car-multiple" class="w-6 h-6" />
            </div>
            <div>
              <div class="text-xs text-slate-500">Автомобилей</div>
              <div class="text-lg font-bold">{{ cars.length }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Табы для категорий автомобилей -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden mb-5">
      <!-- Мобильная версия табов в виде выпадающего списка -->
      <div class="md:hidden p-3 border-b border-slate-100">
        <div class="relative">
          <select
            v-model="activeTab"
            class="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-sm"
          >
            <option v-for="tab in tabs" :key="tab.value" :value="tab.value">
              {{ tab.label }} ({{ getTabCount(tab.value) }})
            </option>
          </select>
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
          >
            <Icon icon="mdi:chevron-down" class="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      <!-- Десктопная версия табов -->
      <div class="hidden md:flex border-b">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="activeTab = tab.value"
          class="flex-1 py-3 px-1 text-center font-medium transition-colors relative"
          :class="
            activeTab === tab.value
              ? 'text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          "
        >
          <div class="flex items-center justify-center">
            <Icon :icon="tab.icon" class="w-5 h-5 mr-1.5" />
            {{ tab.label }}
            <div
              v-if="getTabCount(tab.value) > 0"
              class="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600"
            >
              {{ getTabCount(tab.value) }}
            </div>
          </div>
          <div
            v-if="activeTab === tab.value"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          ></div>
        </button>
      </div>

      <!-- Мобильная оптимизированная панель сортировки -->
      <div
        class="p-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2"
      >
        <div class="text-xs text-slate-500 whitespace-nowrap">
          {{ filteredCars.length }} автомобил{{ getCarWord(filteredCars.length) }}
        </div>

        <div class="relative flex-grow max-w-[180px]">
          <select
            v-model="selectedSort"
            class="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-3 pr-8 text-xs"
          >
            <option v-for="sort in sortOptions" :key="sort.value" :value="sort.value">
              {{ sort.label }}
            </option>
          </select>
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
          >
            <Icon icon="mdi:chevron-down" class="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Сетка автомобилей -->
    <div v-if="filteredCars.length > 0" class="space-y-4">
      <div
        v-for="car in filteredCars"
        :key="car.id"
        class="bg-white rounded-xl shadow-md overflow-hidden fade-in"
      >
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
                <div
                  v-if="car.status === 'selling'"
                  class="text-xl font-bold text-blue-600"
                >
                  ${{ car.price?.toLocaleString() }}
                </div>
                <div class="text-sm text-slate-500 text-right">
                  Рыночная цена:
                  <span class="font-semibold"
                    >${{ car.marketValue.toLocaleString() }}</span
                  >
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
                  <div class="text-sm font-medium">
                    {{ formatMileage(car.mileage) }} км
                  </div>
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
                  <div
                    class="text-sm font-medium"
                    :class="getConditionClass(car.condition)"
                  >
                    {{ car.condition }}%
                  </div>
                </div>
              </div>
            </div>

            <!-- Прогресс-бар состояния -->
            <div class="mb-3">
              <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  class="h-1.5 rounded-full"
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

            <!-- Кнопки действий для мобильных устройств (верт. стек) -->
            <div class="mt-auto flex flex-col sm:flex-row gap-2">
              <button
                @click="goToCarDetails(car.id)"
                class="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center justify-center"
              >
                <Icon icon="mdi:information-outline" class="mr-1.5 w-5 h-5" />
                Подробнее
              </button>

              <div class="flex gap-2">
                <button
                  v-if="car.status === 'ready'"
                  @click="prepareSellCar(car)"
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
                  @click="repairCar(car)"
                  class="flex-1 px-3 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center justify-center"
                >
                  <Icon
                    icon="mdi:wrench"
                    class="mr-1.5 w-5 h-5 sm:hidden md:inline-block"
                  />
                  <span>Починить</span>
                </button>

                <button
                  v-if="car.status === 'selling'"
                  @click="cancelSale(car)"
                  class="flex-1 px-3 py-2 bg-slate-500 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center justify-center"
                >
                  <Icon
                    icon="mdi:close"
                    class="mr-1.5 w-5 h-5 sm:hidden md:inline-block"
                  />
                  <span>Отменить</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Пустой гараж или отсутствие автомобилей в выбранной категории -->
    <div v-else class="bg-white rounded-xl shadow-md p-8 text-center fade-in">
      <div class="mb-4">
        <div
          class="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400"
        >
          <Icon icon="mdi:car-off" class="w-10 h-10" />
        </div>
      </div>
      <h3 class="text-lg font-medium mb-2">
        {{
          cars.length > 0
            ? `В категории "${getActiveTabLabel()}" нет автомобилей`
            : "Ваш гараж пуст"
        }}
      </h3>
      <p class="text-slate-500 mb-6">
        {{
          cars.length > 0
            ? "Выберите другую категорию или добавьте автомобили в эту категорию"
            : "Посетите авторынок, чтобы приобрести ваш первый автомобиль"
        }}
      </p>
      <div class="flex flex-wrap justify-center gap-3">
        <button
          v-if="cars.length > 0 && activeTab !== 'all'"
          @click="activeTab = 'all'"
          class="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center"
        >
          <Icon icon="mdi:view-dashboard" class="w-5 h-5 mr-2" />
          Все автомобили
        </button>

        <router-link
          to="/market"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg inline-flex items-center transition-colors"
        >
          <Icon icon="mdi:cart" class="w-5 h-5 mr-2" />
          На авторынок
        </router-link>
      </div>
    </div>

    <!-- Модальное окно выставления на продажу -->
    <div
      v-if="sellModal.show"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg w-full max-w-sm p-5 scale-in">
        <h3 class="font-bold text-lg mb-2">Выставить на продажу</h3>

        <p class="text-sm text-slate-600 mb-4">
          Рыночная стоимость:
          <span class="font-semibold"
            >${{ sellModal.car?.marketValue.toLocaleString() }}</span
          >
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
              v-model="sellModal.price"
              type="number"
              class="block w-full pl-7 pr-12 py-2 border border-slate-300 rounded-md"
              placeholder="0"
            />
          </div>
          <p class="mt-1 text-xs text-slate-500">
            Рекомендуемая цена: ${{
              sellModal.car ? Math.round(sellModal.car.marketValue * 1.1) : 0
            }}
          </p>
        </div>

        <div class="flex space-x-3">
          <button
            @click="sellModal.show = false"
            class="flex-1 bg-slate-200 hover:bg-slate-300 py-2 rounded-md text-slate-800"
          >
            Отмена
          </button>
          <button
            @click="confirmSellCar"
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import BalanceBadge from "../components/BalanceBadge.vue";
import { Icon } from "@iconify/vue";

const router = useRouter();

// Опции табов
const tabs = [
  { label: "Все", value: "all", icon: "mdi:view-dashboard" },
  { label: "Готовы к продаже", value: "ready", icon: "mdi:car-estate" },
  { label: "На продаже", value: "selling", icon: "mdi:tag" },
  { label: "На ремонте", value: "repair", icon: "mdi:car-wrench" },
];
const activeTab = ref("all");

// Опции сортировки с короткими вариантами для мобильных
const sortOptions = [
  { label: "Популярность", value: "popular" },
  { label: "Цена ↓", value: "price-desc" },
  { label: "Цена ↑", value: "price-asc" },
  { label: "Состояние", value: "condition" },
  { label: "Год выпуска", value: "year" },
];
const selectedSort = ref("popular");

// Модальное окно продажи
const sellModal = reactive({
  show: false,
  car: null as Car | null,
  price: 0,
});

// Типы для автомобиля
interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  condition: number;
  mileage: number;
  price?: number; // Только если выставлен на продажу
  status: "ready" | "repair" | "selling";
  photoUrl: string;
  popularityScore: number;
  marketValue: number;
  purchaseDate?: Date;
  purchasePrice?: number;
  repairInvestment?: number;
  repairProgress?: number;
  sellingStartDate?: Date;
  issues?: string[];
}

// Примерные данные автомобилей с добавленной подробной информацией
const cars = ref<Car[]>([
  {
    id: 1,
    brand: "Toyota",
    model: "Camry",
    year: 2015,
    condition: 75,
    mileage: 120000,
    status: "ready",
    photoUrl:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG95b3RhJTIwY2Ftcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    popularityScore: 78,
    marketValue: 12000,
    purchaseDate: new Date(2023, 4, 10),
    purchasePrice: 10000,
    repairInvestment: 500,
    issues: ["Небольшие царапины на бампере"],
  },
  {
    id: 2,
    brand: "Honda",
    model: "Civic",
    year: 2017,
    condition: 45,
    mileage: 85000,
    status: "repair",
    photoUrl:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ca0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9uZGElMjBjaXZpY3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    popularityScore: 65,
    marketValue: 8500,
    purchaseDate: new Date(2023, 5, 5),
    purchasePrice: 7500,
    repairInvestment: 300,
    repairProgress: 60,
    issues: ["Шум при запуске двигателя", "Износ тормозных колодок"],
  },
  {
    id: 3,
    brand: "BMW",
    model: "X5",
    year: 2016,
    condition: 60,
    mileage: 110000,
    price: 24000, // Цена продажи (так как статус "selling")
    status: "selling",
    photoUrl:
      "https://images.unsplash.com/photo-1571609249239-bf17a9c8a194?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIweDV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    popularityScore: 92,
    marketValue: 22000,
    purchaseDate: new Date(2023, 3, 20),
    purchasePrice: 20000,
    repairInvestment: 1000,
    sellingStartDate: new Date(2023, 6, 1),
  },
]);

// Отфильтрованные автомобили по табу и сортировке
const filteredCars = computed(() => {
  // Фильтрация по статусу (табу)
  let result = [...cars.value];
  if (activeTab.value !== "all") {
    result = result.filter((car) => car.status === activeTab.value);
  }

  // Сортировка
  switch (selectedSort.value) {
    case "price-desc":
      result.sort((a, b) => {
        const aPrice = a.status === "selling" ? a.price || a.marketValue : a.marketValue;
        const bPrice = b.status === "selling" ? b.price || b.marketValue : b.marketValue;
        return bPrice - aPrice;
      });
      break;
    case "price-asc":
      result.sort((a, b) => {
        const aPrice = a.status === "selling" ? a.price || a.marketValue : a.marketValue;
        const bPrice = b.status === "selling" ? b.price || b.marketValue : b.marketValue;
        return aPrice - bPrice;
      });
      break;
    case "condition":
      result.sort((a, b) => b.condition - a.condition);
      break;
    case "year":
      result.sort((a, b) => b.year - a.year);
      break;
    case "popular":
    default:
      result.sort((a, b) => b.popularityScore - a.popularityScore);
      break;
  }

  return result;
});

// Вычисляемое свойство для общей рыночной стоимости гаража
const totalMarketValue = computed(() => {
  return cars.value.reduce((total, car) => total + car.marketValue, 0);
});

// Получение количества автомобилей для каждого таба
const getTabCount = (tabValue: string) => {
  if (tabValue === "all") return cars.value.length;
  return cars.value.filter((car) => car.status === tabValue).length;
};

// Получение правильного окончания слова "автомобиль"
const getCarWord = (count: number) => {
  if (count % 10 === 1 && count % 100 !== 11) return "ь";
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "я";
  return "ей";
};

// Получение названия активного таба
const getActiveTabLabel = () => {
  const tab = tabs.find((t) => t.value === activeTab.value);
  return tab ? tab.label : "";
};

// Форматирование пробега с разделением тысяч
const formatMileage = (mileage: number) => {
  return mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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

// Получение класса для состояния авто
const getConditionClass = (condition: number) => {
  if (condition >= 80) return "text-emerald-500";
  if (condition >= 60) return "text-blue-500";
  if (condition >= 40) return "text-amber-500";
  return "text-red-500";
};

// Перейти на страницу детального просмотра автомобиля
const goToCarDetails = (carId: number) => {
  // Сохраняем данные автомобиля в localStorage для доступа с другой страницы
  const car = cars.value.find((c) => c.id === carId);
  if (car) {
    localStorage.setItem("selectedCar", JSON.stringify(car));
  }
  router.push(`/car/${carId}`);
};

// Подготовка к продаже автомобиля
const prepareSellCar = (car: Car) => {
  sellModal.car = car;
  sellModal.price = Math.round(car.marketValue * 1.1); // Рекомендуемая цена
  sellModal.show = true;
};

// Подтверждение продажи автомобиля
const confirmSellCar = () => {
  if (!sellModal.car || sellModal.price <= 0) return;

  // Находим автомобиль в списке и изменяем его
  const carIndex = cars.value.findIndex((c) => c.id === sellModal.car!.id);
  if (carIndex !== -1) {
    const car = cars.value[carIndex];
    car.status = "selling";
    car.price = sellModal.price;
    car.sellingStartDate = new Date();
  }

  sellModal.show = false;
  sellModal.car = null;
  sellModal.price = 0;
};

// Ремонт автомобиля
const repairCar = (car: Car) => {
  // В реальном приложении здесь был бы API-запрос
  // Переходим на страницу подробностей для ремонта
  localStorage.setItem("selectedCar", JSON.stringify(car));
  router.push(`/garage/car/${car.id}`);
};

// Отмена продажи
const cancelSale = (car: Car) => {
  // В реальном приложении здесь был бы API-запрос
  car.status = "ready";
  car.price = undefined;
  car.sellingStartDate = undefined;
};
</script>

<style scoped>
/* Стили для лучшего отображения на мобильных устройствах */
select {
  /* Предотвращает изменение размера шрифта на мобильных устройствах */
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  font-size: 14px;
}

/* Прячем стрелку нативного селекта в Safari на iOS */
select {
  -webkit-appearance: none;
}

/* Улучшение touch-target для мобильных устройств */
button,
select {
  min-height: 44px;
}

@media (max-width: 640px) {
  /* Стили для мобильных устройств */
  .text-lg {
    font-size: 1rem;
  }
  .text-sm {
    font-size: 0.75rem;
  }
}
</style>

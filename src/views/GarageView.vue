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
        <GarageStats :totalMarketValue="totalMarketValue" :cars="cars" />
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

    <div v-if="filteredCars.length > 0" class="space-y-4">
      <GarageCarCard
        v-for="car in filteredCars"
        :key="car.id"
        :car="car"
        @prepareSellCar="prepareSellCar"
        @repairCar="repairCar"
        @cancelSale="cancelSale"
        @goToCarDetails="goToCarDetails(car.id)"
      />
    </div>

    <!-- Пустой гараж или отсутствие автомобилей в выбранной категории -->
    <GarageEmpty
      v-else
      :activeTab="activeTab"
      :cars="cars"
      :getActiveTabLabel="getActiveTabLabel"
    />

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
import GarageCarCard from "@/components/Garage/GarageCarCard.vue";
import GarageEmpty from "@/components/Garage/GarageEmpty.vue";
import GarageStats from "@/components/Garage/GarageStats.vue";

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

const goToCarDetails = (carId: number) => {
  // Сохраняем данные автомобиля в localStorage для доступа с другой страницы
  const car = cars.value.find((c) => c.id === carId);
  if (car) {
    localStorage.setItem("selectedCar", JSON.stringify(car));
  }
  router.push(`/car/${carId}`);
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

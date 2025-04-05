<template>
  <div class="py-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Авторынок</h1>
      <BalanceBadge :balance="5000" />
    </div>

    <!-- Табы авторынка -->
    <div class="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
      <div class="flex border-b">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="activeTab = index"
          class="flex-1 py-3 px-2 text-center text-sm font-medium transition-colors duration-200"
          :class="
            activeTab === index
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-slate-500 hover:text-slate-700'
          "
        >
          <div class="flex items-center justify-center">
            <Icon :icon="tab.icon" class="w-4 h-4 mr-1.5" />
            {{ tab.name }}
          </div>
        </button>
      </div>
    </div>

    <!-- Фильтр и поиск -->
    <div class="mb-4 bg-white rounded-lg shadow-md p-3">
      <div class="flex items-center mb-3">
        <div class="relative flex-grow">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <Icon icon="mdi:magnify" class="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Поиск по марке или модели..."
            class="bg-slate-50 border border-slate-200 pl-10 py-2 pr-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          @click="showFilters = !showFilters"
          class="ml-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 flex items-center"
        >
          <Icon icon="mdi:filter" class="h-5 w-5 mr-1" />
          <span class="text-sm">Фильтры</span>
        </button>
      </div>

      <!-- Расширенные фильтры -->
      <div v-if="showFilters" class="border-t border-slate-200 pt-3 slide-up">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-slate-500 mb-1">Цена до</label>
            <select
              v-model="filters.maxPrice"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm"
            >
              <option value="0">Любая</option>
              <option value="5000">До $5,000</option>
              <option value="10000">До $10,000</option>
              <option value="20000">До $20,000</option>
              <option value="50000">До $50,000</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">Год выпуска</label>
            <select
              v-model="filters.minYear"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm"
            >
              <option value="0">Любой</option>
              <option value="2000">От 2000</option>
              <option value="2010">От 2010</option>
              <option value="2015">От 2015</option>
              <option value="2020">От 2020</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">Марка</label>
            <select
              v-model="filters.brand"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm"
            >
              <option value="">Все марки</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes">Mercedes</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-slate-500 mb-1">Сортировка</label>
            <select
              v-model="filters.sort"
              class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm"
            >
              <option value="popular">По популярности</option>
              <option value="price_asc">Цена (по возрастанию)</option>
              <option value="price_desc">Цена (по убыванию)</option>
              <option value="year_desc">Год (по убыванию)</option>
            </select>
          </div>
        </div>
        <div class="mt-3 flex justify-end">
          <button
            @click="applyFilters"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
          >
            Применить
          </button>
        </div>
      </div>
    </div>

    <!-- Авторынок -->
    <div v-if="activeTab === 0">
      <div v-if="filteredMarketCars.length > 0" class="grid grid-cols-2 gap-3">
        <div
          v-for="car in filteredMarketCars"
          :key="car.id"
          class="bg-white rounded-lg shadow-md overflow-hidden fade-in"
          @click="goToCarDetails(car.id)"
        >
          <div class="relative">
            <img
              :src="car.photoUrl"
              :alt="`${car.brand} ${car.model}`"
              class="w-full h-32 object-cover"
            />
            <div
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-1 px-2"
            >
              <div class="text-white text-xs font-medium truncate">
                {{ car.brand }} {{ car.model }}
              </div>
            </div>
            <div
              class="absolute top-2 right-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full"
            >
              ${{ car.price.toLocaleString() }}
            </div>
            <div
              class="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-full flex items-center"
            >
              <Icon icon="mdi:star" class="w-3 h-3 mr-0.5 text-amber-400" />
              {{ car.popularityScore }}%
            </div>
          </div>
          <div class="p-2">
            <div class="flex justify-between items-start mb-1">
              <div class="text-xs text-slate-500">{{ car.year }} г.</div>
              <div class="text-xs font-medium" :class="getConditionClass(car.condition)">
                {{ getConditionText(car.condition) }}
              </div>
            </div>
            <div class="text-xs text-slate-500 truncate">
              Пробег: {{ formatMileage(car.mileage) }} км
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-8 text-center">
        <div
          class="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3"
        >
          <Icon icon="mdi:car-search" class="w-8 h-8 text-slate-400" />
        </div>
        <h3 class="font-medium mb-1">Машины не найдены</h3>
        <p class="text-slate-500 text-sm mb-4">
          Попробуйте изменить параметры поиска или фильтры
        </p>
      </div>
    </div>

    <!-- Салоны -->
    <div v-if="activeTab === 1">
      <div v-if="dealerships.length > 0" class="space-y-4">
        <div
          v-for="dealership in dealerships"
          :key="dealership.id"
          class="bg-white rounded-lg shadow-md overflow-hidden fade-in"
          @click="goToDealership(dealership.id)"
        >
          <div class="relative">
            <img
              :src="dealership.photoUrl"
              alt="Dealership"
              class="w-full h-40 object-cover"
            />
            <div
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-3 px-4"
            >
              <div class="text-white font-medium text-lg">
                {{ dealership.name }}
              </div>
              <div class="text-white/80 text-xs flex items-center">
                <Icon icon="mdi:map-marker" class="w-3.5 h-3.5 mr-1" />
                {{ dealership.location }}
              </div>
            </div>
            <div
              class="absolute top-3 right-3 px-2 py-1 bg-white/90 text-slate-800 text-xs rounded-lg flex items-center"
            >
              <Icon icon="mdi:car-multiple" class="w-3.5 h-3.5 mr-1 text-blue-500" />
              {{ dealership.carsCount }} авто
            </div>
          </div>
          <div class="p-3 border-t border-slate-100">
            <div class="flex justify-between mb-2">
              <div class="flex items-center">
                <Icon icon="mdi:star" class="w-4 h-4 text-amber-400 mr-1" />
                <span class="text-sm font-medium">{{ dealership.rating }}</span>
                <span class="text-xs text-slate-500 ml-1"
                  >({{ dealership.reviewsCount }})</span
                >
              </div>
              <div>
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  :class="getLevelBadgeClass(dealership.level)"
                >
                  {{ getLevelText(dealership.level) }}
                </span>
              </div>
            </div>
            <p class="text-xs text-slate-500 line-clamp-2">
              {{ dealership.description }}
            </p>
            <div class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="(tag, i) in dealership.tags"
                :key="i"
                class="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-8 text-center">
        <div
          class="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3"
        >
          <Icon icon="mdi:store-search" class="w-8 h-8 text-slate-400" />
        </div>
        <h3 class="font-medium mb-1">Салоны не найдены</h3>
        <p class="text-slate-500 text-sm mb-4">
          В данный момент нет доступных автосалонов
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import BalanceBadge from "../components/BalanceBadge.vue";
import { Icon } from "@iconify/vue";

const router = useRouter();
const activeTab = ref(0);
const showFilters = ref(false);
const searchQuery = ref("");

// Определение табов
const tabs = [
  {
    name: "Авторынок",
    icon: "mdi:cart",
    description: "Подержанные автомобили от частных лиц",
  },
  {
    name: "Салоны",
    icon: "mdi:store",
    description: "Новые автомобили от официальных дилеров",
  },
];

// Фильтры
const filters = ref({
  maxPrice: 0,
  minYear: 0,
  brand: "",
  sort: "popular",
});

// Данные подержанных автомобилей на авторынке
const marketCars = ref([
  {
    id: 101,
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
  },
  {
    id: 102,
    brand: "Honda",
    model: "Civic",
    year: 2017,
    condition: 45,
    mileage: 85000,
    price: 8500,
    photoUrl:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0ca0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9uZGElMjBjaXZpY3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    popularityScore: 65,
    issues: ["Шум при запуске двигателя", "Износ тормозных колодок", "Вмятина на двери"],
  },
  {
    id: 103,
    brand: "BMW",
    model: "X5",
    year: 2016,
    condition: 60,
    mileage: 110000,
    price: 22000,
    photoUrl:
      "https://images.unsplash.com/photo-1571609249239-bf17a9c8a194?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIweDV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    popularityScore: 92,
    issues: ["Неисправность кондиционера", "Требуется замена ремня ГРМ"],
  },
  {
    id: 104,
    brand: "Mercedes",
    model: "C-Class",
    year: 2018,
    condition: 85,
    mileage: 65000,
    price: 25000,
    photoUrl:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVyY2VkZXMlMjBjJTIwY2xhc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    popularityScore: 88,
    issues: ["Небольшие потертости сидений"],
  },
  {
    id: 105,
    brand: "Toyota",
    model: "Corolla",
    year: 2016,
    condition: 70,
    mileage: 100000,
    price: 9500,
    photoUrl:
      "https://images.unsplash.com/photo-1623895325300-23981ce3f3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG95b3RhJTIwY29yb2xsYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    popularityScore: 80,
    issues: ["Царапины на кузове", "Потертость руля"],
  },
  {
    id: 106,
    brand: "Honda",
    model: "Accord",
    year: 2014,
    condition: 55,
    mileage: 130000,
    price: 7800,
    photoUrl:
      "https://images.unsplash.com/photo-1553623449-464123f47be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9uZGElMjBhY2NvcmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    popularityScore: 72,
    issues: [
      "Небольшая вмятина на капоте",
      "Износ сцепления",
      "Трещина на лобовом стекле",
    ],
  },
]);

// Данные автосалонов
const dealerships = ref([
  {
    id: 201,
    name: "ПремиумАвто",
    location: "Центральный район",
    photoUrl:
      "https://images.unsplash.com/photo-1540679859141-73001a8f5219?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyJTIwZGVhbGVyc2hpcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    rating: 4.8,
    reviewsCount: 253,
    carsCount: 45,
    level: "premium",
    description:
      "Официальный дилер премиальных автомобилей с безупречным сервисом и гарантией на все авто.",
    tags: ["Премиум", "Гарантия", "Кредит", "Trade-in"],
  },
  {
    id: 202,
    name: "АвтоМир",
    location: "Восточный район",
    photoUrl:
      "https://images.unsplash.com/photo-1531174232469-8d5bc5a070f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2FyJTIwZGVhbGVyc2hpcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    rating: 4.3,
    reviewsCount: 186,
    carsCount: 78,
    level: "standard",
    description:
      "Большой выбор автомобилей разных классов. Выгодные условия кредитования и лизинга.",
    tags: ["Доступные цены", "Семейные авто", "Рассрочка"],
  },
  {
    id: 203,
    name: "ЭкономАвто",
    location: "Западный район",
    photoUrl:
      "https://images.unsplash.com/photo-1541899504384-a5065198b681?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNhciUyMGRlYWxlcnNoaXB8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    rating: 3.9,
    reviewsCount: 107,
    carsCount: 36,
    level: "economy",
    description:
      "Экономичные автомобили для города и семьи. Специальные предложения для начинающих водителей.",
    tags: ["Эконом", "Городские авто", "Для новичков"],
  },
]);

// Отфильтрованные автомобили
const filteredMarketCars = computed(() => {
  let filtered = [...marketCars.value];

  // Применяем текстовый поиск
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (car) =>
        car.brand.toLowerCase().includes(query) || car.model.toLowerCase().includes(query)
    );
  }

  // Применяем фильтры
  if (filters.value.maxPrice > 0) {
    filtered = filtered.filter((car) => car.price <= filters.value.maxPrice);
  }

  if (filters.value.minYear > 0) {
    filtered = filtered.filter((car) => car.year >= filters.value.minYear);
  }

  if (filters.value.brand) {
    filtered = filtered.filter((car) => car.brand === filters.value.brand);
  }

  // Сортировка
  switch (filters.value.sort) {
    case "price_asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "year_desc":
      filtered.sort((a, b) => b.year - a.year);
      break;
    case "popular":
    default:
      filtered.sort((a, b) => b.popularityScore - a.popularityScore);
      break;
  }

  return filtered;
});

// Методы
const applyFilters = () => {
  showFilters.value = false;
};

const goToCarDetails = (carId: number) => {
  router.push(`/market/car/${carId}`);
};

const goToDealership = (dealershipId: number) => {
  router.push(`/market/dealership/${dealershipId}`);
};

// Форматирование пробега с разделением тысяч
const formatMileage = (mileage: number) => {
  return mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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

// Получение текста для уровня автосалона
const getLevelText = (level: string) => {
  switch (level) {
    case "premium":
      return "Премиум";
    case "standard":
      return "Стандарт";
    case "economy":
      return "Эконом";
    default:
      return level;
  }
};

// Получение класса для бейджа уровня автосалона
const getLevelBadgeClass = (level: string) => {
  switch (level) {
    case "premium":
      return "bg-indigo-100 text-indigo-600";
    case "standard":
      return "bg-blue-100 text-blue-600";
    case "economy":
      return "bg-emerald-100 text-emerald-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
};
</script>

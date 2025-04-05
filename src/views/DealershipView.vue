<template>
  <div class="py-4">
    <!-- Верхняя панель с возвратом и балансом -->
    <div class="flex justify-between items-center mb-4">
      <button @click="router.back()" class="flex items-center text-slate-600 font-medium">
        <Icon icon="mdi:arrow-left" class="h-5 w-5 mr-1" />
        Назад
      </button>
      <BalanceBadge />
    </div>

    <!-- Информация об автосалоне -->
    <div
      v-if="dealership"
      class="bg-white rounded-lg shadow-md overflow-hidden mb-4 fade-in"
    >
      <DealershipInfo :dealership="dealership" />

      <div class="p-4">
        <!-- Рейтинг и уровень -->
        <div class="flex justify-between mb-3">
          <div class="flex items-center">
            <Icon icon="mdi:star" class="h-5 w-5 text-amber-400 mr-1" />
            <span class="font-medium">{{ dealership.rating }}</span>
            <span class="text-sm text-slate-500 ml-1"
              >({{ dealership.reviewsCount }})</span
            >
          </div>
          <div>
            <span
              class="text-sm px-2 py-1 rounded-full"
              :class="getLevelBadgeClass(dealership.level)"
            >
              {{ getLevelText(dealership.level) }}
            </span>
          </div>
        </div>

        <!-- Описание -->
        <p class="text-slate-600 text-sm mb-3">
          {{ dealership.description }}
        </p>

        <!-- Теги -->
        <div class="flex flex-wrap gap-2 mb-3">
          <span
            v-for="(tag, i) in dealership.tags"
            :key="i"
            class="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- Список автомобилей автосалона -->
    <div v-if="dealership">
      <div class="flex justify-between items-center mb-3">
        <h2 class="font-bold">Автомобили в салоне</h2>
        <div class="text-sm text-slate-500">{{ dealershipCars.length }} авто</div>
      </div>

      <div v-if="dealershipCars.length > 0" class="grid grid-cols-2 gap-3">
        <DealershipCarCard
          v-for="car in dealershipCars"
          :key="car.id"
          :car="car"
          @click="goToCarDetails(car.id)"
        />
      </div>

      <DealershipCarEmpty v-else />
    </div>

    <!-- Если автосалон не найден -->
    <DealershipEmpty v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BalanceBadge from "../components/BalanceBadge.vue";
import { Icon } from "@iconify/vue";
import DealershipInfo from "@/components/Dealership/DealershipInfo.vue";
import DealershipCarCard from "@/components/Dealership/DealershipCarCard.vue";
import DealershipCarEmpty from "@/components/Dealership/DealershipCarEmpty.vue";
import DealershipEmpty from "@/components/Dealership/DealershipEmpty.vue";
import { getLevelBadgeClass } from "@/utils/getLevelBadgeClass";
import { getLevelText } from "@/utils/getLevelText";

const route = useRoute();
const router = useRouter();
const dealershipId = parseInt(route.params.id as string);

// Типы для автосалона
interface Dealership {
  id: number;
  name: string;
  location: string;
  photoUrl: string;
  rating: number;
  reviewsCount: number;
  carsCount: number;
  level: string;
  description: string;
  tags: string[];
}

// Тип для автомобиля в салоне
interface DealershipCar {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  photoUrl: string;
  isNew: boolean;
}

// Данные автосалона (в реальном приложении эти данные будут загружаться по ID)
const dealership = ref<Dealership | null>(null);
const dealershipCars = ref<DealershipCar[]>([]);

// Имитация загрузки данных при монтировании компонента
onMounted(() => {
  // В реальном приложении здесь был бы API-запрос
  setTimeout(() => {
    dealership.value = {
      id: dealershipId,
      name: "ПремиумАвто",
      location: "Центральный район",
      photoUrl:
        "https://images.unsplash.com/photo-1540679859141-73001a8f5219?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyJTIwZGVhbGVyc2hpcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      rating: 4.8,
      reviewsCount: 253,
      carsCount: 45,
      level: "premium",
      description:
        "Официальный дилер премиальных автомобилей с безупречным сервисом и гарантией на все авто. Предлагаем выгодные условия кредитования и лизинга, а также трейд-ин вашего старого автомобиля.",
      tags: ["Премиум", "Гарантия", "Кредит", "Trade-in"],
    };

    dealershipCars.value = [
      {
        id: 301,
        brand: "BMW",
        model: "X5",
        year: 2023,
        price: 75000,
        photoUrl:
          "https://images.unsplash.com/photo-1607853554439-0069ec0f29b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym13JTIweDV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        isNew: true,
      },
      {
        id: 302,
        brand: "Mercedes",
        model: "S-Class",
        year: 2023,
        price: 110000,
        photoUrl:
          "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWVyY2VkZXMlMjBzJTIwY2xhc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        isNew: true,
      },
      {
        id: 303,
        brand: "Audi",
        model: "A6",
        year: 2022,
        price: 65000,
        photoUrl:
          "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXVkaSUyMGE2fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        isNew: false,
      },
      {
        id: 304,
        brand: "Lexus",
        model: "RX",
        year: 2023,
        price: 70000,
        photoUrl:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGV4dXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        isNew: true,
      },
    ];
  }, 500);
});

// Переход на страницу автомобиля
const goToCarDetails = (carId: number) => {
  router.push(`/market/car/${carId}`);
};
</script>

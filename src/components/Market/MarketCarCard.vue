<template>
  <div
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
      <div class="text-xs text-slate-500 truncate">Пробег: {{ car.mileage }} км</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { getConditionText } from "@/utils/conditionText";

const router = useRouter();
const props = defineProps({
  car: {
    type: Object,
    required: true,
  },
});

const getConditionClass = (condition: number) => {
  if (condition >= 80) return "text-emerald-500";
  if (condition >= 60) return "text-blue-500";
  if (condition >= 40) return "text-amber-500";
  return "text-red-500";
};

const goToCarDetails = (carId: number) => {
  router.push(`/market/car/${carId}`);
};
</script>

<style scoped></style>

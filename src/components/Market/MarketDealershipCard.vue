<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden fade-in"
    @click="goToDealership(dealership.id)"
  >
    <div class="relative">
      <img :src="dealership.photoUrl" alt="Dealership" class="w-full h-40 object-cover" />
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
          <span class="text-xs text-slate-500 ml-1">({{ dealership.reviewsCount }})</span>
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
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
const router = useRouter();

const props = defineProps({
  dealership: {
    type: Object,
    required: true,
  },
});

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

const goToDealership = (dealershipId: number) => {
  router.push(`/market/dealership/${dealershipId}`);
};
</script>

<style scoped></style>

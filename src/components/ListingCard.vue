<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Listing } from '@/stores/listings'

withDefaults(defineProps<{ listing: Listing }>(), {})

const router = useRouter()

const handleViewDetails = () => {
  router.push({ name: 'ListingDetails', params: { id: listing.id } })
}
</script>

<template>
  <div
    class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
  >
    <div class="relative overflow-hidden h-64 bg-gray-200">
      <img
        :src="listing.image"
        :alt="listing.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div
        class="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-sm font-semibold text-gray-900 flex items-center gap-1"
      >
        ★ {{ listing.rating }}
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-900 truncate">{{ listing.title }}</h3>
      <p class="text-gray-600 text-sm mb-2">{{ listing.city }}</p>
      <p class="text-gray-700 text-sm line-clamp-2 mb-4">{{ listing.description }}</p>
      <div class="flex justify-between items-center mb-4">
        <div class="flex gap-3 text-sm text-gray-600">
          <span>🛏️ {{ listing.beds }} lit{{ listing.beds > 1 ? 's' : '' }}</span>
          <span>🚿 {{ listing.baths }} salle{{ listing.baths > 1 ? 's' : '' }}</span>
        </div>
      </div>
      <div class="flex justify-between items-center pt-4 border-t border-gray-200">
        <div>
          <span class="text-2xl font-bold text-gray-900">{{ listing.price }}</span>
          <span class="text-gray-600 text-sm"> €/nuit</span>
        </div>
        <button
          @click="handleViewDetails"
          class="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition"
        >
          Voir
        </button>
      </div>
    </div>
  </div>
</template>

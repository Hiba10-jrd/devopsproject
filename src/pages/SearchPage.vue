<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useListingsStore } from '@/stores/listings'
import ListingCard from '@/components/ListingCard.vue'

const route = useRoute()
const listingsStore = useListingsStore()

const searchCity = ref('')
const minPrice = ref(0)
const maxPrice = ref(5000)

const filteredListings = computed(() => {
  return listingsStore.searchListings(searchCity.value, minPrice.value, maxPrice.value)
})

const cities = computed(() => listingsStore.getCities())

const applyFilters = () => {
  // Filters are applied via computed property
}

onMounted(() => {
  if (route.query.city) {
    searchCity.value = route.query.city as string
  }
  if (route.query.minPrice) {
    minPrice.value = parseInt(route.query.minPrice as string)
  }
  if (route.query.maxPrice) {
    maxPrice.value = parseInt(route.query.maxPrice as string)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-20">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Filtres</h2>

            <!-- City Filter -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Ville</label>
              <select
                v-model="searchCity"
                @change="applyFilters"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Toutes les villes</option>
                <option v-for="city in cities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
            </div>

            <!-- Price Range Filter -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Prix par nuit</label>
              <div class="space-y-3">
                <div>
                  <label class="text-xs text-gray-600">Minimum (€)</label>
                  <input
                    v-model.number="minPrice"
                    @change="applyFilters"
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                  <input
                    v-model.number="minPrice"
                    type="number"
                    class="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label class="text-xs text-gray-600">Maximum (€)</label>
                  <input
                    v-model.number="maxPrice"
                    @change="applyFilters"
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                  <input
                    v-model.number="maxPrice"
                    type="number"
                    class="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <div class="mt-2 text-sm text-gray-600">Entre {{ minPrice }}€ et {{ maxPrice }}€</div>
            </div>

            <button
              @click="
                () => {
                  searchCity = ''
                  minPrice = 0
                  maxPrice = 5000
                  applyFilters()
                }
              "
              class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>

        <!-- Results -->
        <div class="lg:col-span-3">
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900">
              {{ filteredListings.length }} logement{{
                filteredListings.length !== 1 ? 's' : ''
              }}
              trouvé{{ filteredListings.length !== 1 ? 's' : '' }}
            </h1>
            <p class="text-gray-600 mt-2">
              <span v-if="searchCity">à {{ searchCity }}</span>
              <span v-if="searchCity && (minPrice > 0 || maxPrice < 5000)"> •</span>
              <span v-if="minPrice > 0 || maxPrice < 5000">
                Entre {{ minPrice }}€ et {{ maxPrice }}€ par nuit</span
              >
            </p>
          </div>

          <div v-if="filteredListings.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ListingCard v-for="listing in filteredListings" :key="listing.id" :listing="listing" />
          </div>
          <div v-else class="bg-white rounded-lg shadow p-12 text-center">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-2">Aucun logement trouvé</h3>
            <p class="text-gray-600">
              Essayez d'ajuster vos filtres pour trouver plus de logements
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useListingsStore } from '@/stores/listings'
import ListingCard from '@/components/ListingCard.vue'

const router = useRouter()
const listingsStore = useListingsStore()

const searchCity = ref('')
const minPrice = ref(0)
const maxPrice = ref(5000)

const handleSearch = () => {
  const params: Record<string, any> = {}
  if (searchCity.value) params.city = searchCity.value
  if (minPrice.value) params.minPrice = minPrice.value
  if (maxPrice.value < 5000) params.maxPrice = maxPrice.value

  router.push({ name: 'Search', query: params })
}

const allListings = listingsStore.listings
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-pink-50 to-rose-50 py-16 md:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explorez des logements uniques
          </h1>
          <p class="text-lg text-gray-600">
            Trouvez votre destination idéale parmi des milliers d'offres
          </p>
        </div>

        <!-- Search Bar -->
        <div class="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
              <input
                v-model="searchCity"
                type="text"
                placeholder="Où allez-vous ?"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Prix min</label>
              <input
                v-model.number="minPrice"
                type="number"
                placeholder="0"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Prix max</label>
              <input
                v-model.number="maxPrice"
                type="number"
                placeholder="5000"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div class="flex items-end">
              <button
                @click="handleSearch"
                class="w-full px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition"
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Listings -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Logements populaires</h2>
        <p class="text-gray-600">Découvrez nos meilleures offres du moment</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ListingCard
          v-for="listing in allListings.slice(0, 6)"
          :key="listing.id"
          :listing="listing"
        />
      </div>

      <div class="text-center mt-12">
        <router-link
          to="/search"
          class="inline-block px-8 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition"
        >
          Voir tous les logements
        </router-link>
      </div>
    </div>

    <!-- Benefits Section -->
    <div class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          Pourquoi choisir AirBnB ?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="flex justify-center mb-4">
              <div
                class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-3xl"
              >
                🏠
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Logements variés</h3>
            <p class="text-gray-600">
              Des studios aux villas luxueuses, trouvez le logement parfait
            </p>
          </div>
          <div class="text-center">
            <div class="flex justify-center mb-4">
              <div
                class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-3xl"
              >
                💰
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Prix compétitifs</h3>
            <p class="text-gray-600">Les meilleurs tarifs du marché avec transparence totale</p>
          </div>
          <div class="text-center">
            <div class="flex justify-center mb-4">
              <div
                class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-3xl"
              >
                ⭐
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Hôtes de confiance</h3>
            <p class="text-gray-600">Logements vérifiés avec évaluations authentiques</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

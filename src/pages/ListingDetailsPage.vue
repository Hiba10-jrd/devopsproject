<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useListingsStore } from '@/stores/listings'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const listingsStore = useListingsStore()
const authStore = useAuthStore()

const listingId = parseInt(route.params.id as string)
const listing = computed(() => listingsStore.getListingById(listingId))
const selectedImageIndex = ref(0)

const displayImages = computed(() => {
  if (listing.value?.images && listing.value.images.length > 0) {
    return listing.value.images
  }
  return listing.value?.image ? [listing.value.image] : []
})

const handleBookNow = () => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
  } else {
    router.push({ name: 'Booking', params: { id: listingId } })
  }
}

onMounted(() => {
  if (!listing.value) {
    router.push('/')
  }
})
</script>

<template>
  <div v-if="listing" class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Image Gallery -->
      <div class="mb-8">
        <div class="rounded-lg overflow-hidden h-96 bg-gray-200 mb-4">
          <img
            :src="displayImages[selectedImageIndex]"
            :alt="listing.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="grid grid-cols-5 gap-2">
          <button
            v-for="(image, index) in displayImages"
            :key="index"
            @click="selectedImageIndex = index"
            :class="[
              'rounded-lg overflow-hidden h-20 border-2 transition',
              selectedImageIndex === index
                ? 'border-pink-500'
                : 'border-gray-300 hover:border-gray-400',
            ]"
          >
            <img :src="image" :alt="`Image ${index + 1}`" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Title and Location -->
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ listing.title }}</h1>
            <div class="flex items-center gap-4 text-lg text-gray-600 mb-4">
              <span class="flex items-center gap-1">📍 {{ listing.city }}</span>
              <span class="flex items-center gap-1">⭐ {{ listing.rating }}</span>
            </div>
            <p class="text-gray-700">📍 {{ listing.address }}</p>
          </div>

          <!-- Owner Information -->
          <div class="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Propriétaire du logement</h2>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-600">Nom</p>
                <p class="text-lg font-semibold text-gray-900">{{ listing.ownerName }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Numéro de téléphone</p>
                <p class="text-lg font-semibold text-gray-900">{{ listing.ownerPhone }}</p>
              </div>
            </div>
          </div>

          <!-- Amenities -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div class="text-3xl">🛏️</div>
              <div>
                <p class="text-sm text-gray-600">Chambres</p>
                <p class="text-xl font-semibold text-gray-900">{{ listing.beds }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-3xl">🚿</div>
              <div>
                <p class="text-sm text-gray-600">Salles de bain</p>
                <p class="text-xl font-semibold text-gray-900">{{ listing.baths }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-3xl">🍳</div>
              <div>
                <p class="text-sm text-gray-600">Cuisines</p>
                <p class="text-xl font-semibold text-gray-900">{{ listing.kitchens || 1 }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-3xl">🛋️</div>
              <div>
                <p class="text-sm text-gray-600">Salons</p>
                <p class="text-xl font-semibold text-gray-900">{{ listing.salons || 1 }}</p>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">À propos du logement</h2>
            <p class="text-lg text-gray-700 leading-relaxed">{{ listing.description }}</p>
          </div>

          <!-- Features -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Équipements</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center gap-3">
                <span class="text-2xl">📶</span>
                <span class="text-gray-700">WiFi gratuit</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-2xl">🍳</span>
                <span class="text-gray-700">Cuisine équipée</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-2xl">🌡️</span>
                <span class="text-gray-700">Climatisation</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-2xl">🧺</span>
                <span class="text-gray-700">Lave-linge</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-2xl">🏊</span>
                <span class="text-gray-700">Piscine</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-2xl">🅿️</span>
                <span class="text-gray-700">Parking gratuit</span>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Avis des voyageurs</h2>
            <div class="space-y-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-semibold text-gray-900">Marie L.</span>
                  <span class="text-yellow-400">★★★★★</span>
                </div>
                <p class="text-gray-700">
                  Superbe logement, très propre et confortable. L'accueil a été parfait!
                </p>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-semibold text-gray-900">Pierre T.</span>
                  <span class="text-yellow-400">★★★★☆</span>
                </div>
                <p class="text-gray-700">
                  Très bon séjour. L'emplacement est idéal pour explorer la région.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Card -->
        <div class="lg:col-span-1">
          <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-6 sticky top-20">
            <div class="mb-6">
              <div class="flex items-baseline gap-2 mb-2">
                <span class="text-4xl font-bold text-gray-900">{{ listing.price }}</span>
                <span class="text-gray-600">€/nuit</span>
              </div>
              <p class="text-sm text-gray-500">Frais de service inclus</p>
            </div>

            <button
              @click="handleBookNow"
              class="w-full px-4 py-4 bg-pink-500 text-white rounded-lg font-bold text-lg hover:bg-pink-600 transition mb-4"
            >
              Réserver maintenant
            </button>

            <div class="space-y-3 text-sm text-gray-700 pb-6 border-b border-gray-200">
              <div class="flex justify-between">
                <span>{{ listing.price }}€ × 1 nuit</span>
                <span>{{ listing.price }}€</span>
              </div>
              <div class="flex justify-between">
                <span>Frais de service</span>
                <span>Gratuit</span>
              </div>
              <div class="flex justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>{{ listing.price }}€</span>
              </div>
            </div>

            <button
              @click="() => window.scrollTo(0, 0)"
              class="w-full mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Envoyer un message
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

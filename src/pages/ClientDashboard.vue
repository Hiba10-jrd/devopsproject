<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useListingsStore, type Listing } from '@/stores/listings'

const router = useRouter()
const authStore = useAuthStore()
const listingsStore = useListingsStore()

const userId = computed(() => authStore.currentUser?.id ?? 0)
const userName = computed(() => authStore.currentUser?.name ?? '')
const userBookings = computed(() => listingsStore.getBookingsByUser(userId.value))
const bookingStatusCounts = computed(() => {
  const counts = { pending: 0, confirmed: 0, cancelled: 0 }
  userBookings.value.forEach((booking) => {
    const status = (booking.status ?? 'pending').toLowerCase()
    if (status in counts) {
      counts[status as keyof typeof counts] += 1
    }
  })
  return counts
})
const totalSpent = computed(() => userBookings.value.reduce((sum, booking) => sum + booking.totalPrice, 0))
const totalReviews = computed(() => listingsStore.getReviewsByUser(userId.value).length)
const userReviews = computed(() => listingsStore.getReviewsByUser(userId.value))
const reviewListingId = ref<number | null>(listingsStore.listings.value[0]?.id ?? null)
const reviewRating = ref(5)
const reviewComment = ref('')

const profileForm = ref({
  name: authStore.currentUser?.name ?? '',
  email: authStore.currentUser?.email ?? '',
  phone: authStore.currentUser?.phone ?? '',
  city: authStore.currentUser?.city ?? '',
  address: authStore.currentUser?.address ?? '',
  description: authStore.currentUser?.description ?? '',
})

const exploreCity = ref('')
const minPrice = ref(0)
const maxPrice = ref(2000)
const exploreResults = computed(() =>
  listingsStore.searchListings(exploreCity.value, minPrice.value, maxPrice.value),
)
const cityOptions = computed(() => listingsStore.getCities())
const selectedTab = ref<'reservations' | 'profile' | 'reviews' | 'explore'>('reservations')

const handleSaveProfile = () => {
  const success = authStore.updateProfile({
    name: profileForm.value.name,
    email: profileForm.value.email,
    phone: profileForm.value.phone,
    city: profileForm.value.city,
    address: profileForm.value.address,
    description: profileForm.value.description,
  })
  if (success) {
    alert('Profil mis à jour avec succès.')
  } else {
    alert('Impossible de mettre à jour votre profil.')
  }
}

const handleAddReview = () => {
  if (!reviewListingId.value || reviewComment.value.trim().length < 10) {
    alert('Veuillez sélectionner un logement et laisser un avis d’au moins 10 caractères.')
    return
  }

  listingsStore.addReview({
    listingId: reviewListingId.value,
    userId: userId.value,
    userName: userName.value,
    rating: reviewRating.value,
    comment: reviewComment.value.trim(),
  })

  reviewComment.value = ''
  reviewRating.value = 5
  alert('Merci ! Votre avis a bien été ajouté.')
}

const handleExploreReset = () => {
  exploreCity.value = ''
  minPrice.value = 0
  maxPrice.value = 2000
}

const goToSearch = () => {
  router.push({ name: 'Search', query: { city: exploreCity.value } })
}

onMounted(() => {
  if (!authStore.isLoggedIn || authStore.currentUser?.role !== 'client') {
    router.push('/login')
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-10">
        <h1 class="text-4xl font-bold text-slate-900 mb-2">Tableau de bord client</h1>
        <p class="text-slate-600 max-w-2xl">
          Retrouvez vos réservations, gérez votre profil, déposez des avis et explorez les logements disponibles.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-10">
        <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p class="text-sm font-semibold text-slate-500">Réservations totales</p>
          <p class="mt-4 text-3xl font-bold text-slate-900">{{ userBookings.length }}</p>
        </div>
        <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p class="text-sm font-semibold text-slate-500">Montant dépensé</p>
          <p class="mt-4 text-3xl font-bold text-slate-900">{{ totalSpent.toFixed(2) }} DH</p>
        </div>
        <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p class="text-sm font-semibold text-slate-500">Avis publiés</p>
          <p class="mt-4 text-3xl font-bold text-slate-900">{{ totalReviews }}</p>
        </div>
        <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p class="text-sm font-semibold text-slate-500">Bienvenue</p>
          <p class="mt-4 text-2xl font-bold text-slate-900">{{ userName }}</p>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 mb-10">
        <div class="flex flex-wrap gap-1 p-3 bg-slate-50 rounded-t-3xl">
          <button
            @click="selectedTab = 'reservations'"
            :class="[
              'px-5 py-3 rounded-2xl font-semibold transition',
              selectedTab === 'reservations'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 hover:bg-slate-100',
            ]"
          >
            Réservations
          </button>
          <button
            @click="selectedTab = 'profile'"
            :class="[
              'px-5 py-3 rounded-2xl font-semibold transition',
              selectedTab === 'profile'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 hover:bg-slate-100',
            ]"
          >
            Profil
          </button>
          <button
            @click="selectedTab = 'reviews'"
            :class="[
              'px-5 py-3 rounded-2xl font-semibold transition',
              selectedTab === 'reviews'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 hover:bg-slate-100',
            ]"
          >
            Avis
          </button>
          <button
            @click="selectedTab = 'explore'"
            :class="[
              'px-5 py-3 rounded-2xl font-semibold transition',
              selectedTab === 'explore'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 hover:bg-slate-100',
            ]"
          >
            Explorer
          </button>
        </div>

        <div class="p-8">
          <section v-if="selectedTab === 'reservations'">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-2xl font-semibold text-slate-900">Mes réservations</h2>
                <p class="text-sm text-slate-600">Suivez vos séjours en attente, confirmés ou annulés.</p>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-3 mb-8">
              <div class="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                <p class="text-sm text-slate-500">En attente</p>
                <p class="mt-4 text-3xl font-bold text-slate-900">{{ bookingStatusCounts.pending }}</p>
              </div>
              <div class="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                <p class="text-sm text-slate-500">Confirmées</p>
                <p class="mt-4 text-3xl font-bold text-slate-900">{{ bookingStatusCounts.confirmed }}</p>
              </div>
              <div class="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                <p class="text-sm text-slate-500">Annulées</p>
                <p class="mt-4 text-3xl font-bold text-slate-900">{{ bookingStatusCounts.cancelled }}</p>
              </div>
            </div>

            <div v-if="userBookings.length > 0" class="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <table class="min-w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr class="text-slate-500 text-sm uppercase tracking-[0.15em]">
                    <th class="px-4 py-3">Logement</th>
                    <th class="px-4 py-3">Arrivée</th>
                    <th class="px-4 py-3">Départ</th>
                    <th class="px-4 py-3">Montant</th>
                    <th class="px-4 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="booking in userBookings" :key="booking.id" class="bg-white rounded-3xl">
                    <td class="px-4 py-4 font-medium text-slate-900">{{ booking.listingTitle || '—' }}</td>
                    <td class="px-4 py-4 text-slate-600">{{ new Date(booking.checkInDate).toLocaleDateString('fr-FR') }}</td>
                    <td class="px-4 py-4 text-slate-600">{{ new Date(booking.checkOutDate).toLocaleDateString('fr-FR') }}</td>
                    <td class="px-4 py-4 font-semibold text-slate-900">{{ booking.totalPrice }} DH</td>
                    <td class="px-4 py-4 text-slate-600 capitalize">{{ booking.status ?? 'pending' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p class="text-slate-600">Vous n’avez pas encore de réservations.</p>
            </div>
          </section>

          <section v-if="selectedTab === 'profile'">
            <div class="mb-6">
              <h2 class="text-2xl font-semibold text-slate-900">Mon profil</h2>
              <p class="text-sm text-slate-600">Mettez à jour vos informations personnelles.</p>
            </div>
            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Nom complet</label>
                <input
                  v-model="profileForm.name"
                  type="text"
                  class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Téléphone</label>
                <input
                  v-model="profileForm.phone"
                  type="tel"
                  class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Ville</label>
                <input
                  v-model="profileForm.city"
                  type="text"
                  class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-2">Adresse</label>
                <input
                  v-model="profileForm.address"
                  type="text"
                  class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-2">Description personnelle</label>
                <textarea
                  v-model="profileForm.description"
                  rows="4"
                  class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
            <button
              @click="handleSaveProfile"
              class="mt-6 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition"
            >
              Enregistrer les informations
            </button>
          </section>

          <section v-if="selectedTab === 'reviews'">
            <div class="mb-6">
              <h2 class="text-2xl font-semibold text-slate-900">Mes avis</h2>
              <p class="text-sm text-slate-600">Ajoutez et consultez vos avis sur les logements réservés.</p>
            </div>
            <div class="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div class="rounded-3xl bg-slate-50 p-8 border border-slate-200">
                <div class="grid gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Logement</label>
                    <select
                      v-model.number="reviewListingId"
                      class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    >
                      <option disabled value="null">Sélectionnez un logement</option>
                      <option
                        v-for="listing in listingsStore.listings"
                        :key="listing.id"
                        :value="listing.id"
                      >
                        {{ listing.title }} - {{ listing.city }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Note</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      v-model.number="reviewRating"
                      class="w-full"
                    />
                    <p class="text-xs text-slate-500">{{ reviewRating }} étoiles</p>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Commentaire</label>
                    <textarea
                      v-model="reviewComment"
                      rows="4"
                      class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                  <button
                    @click="handleAddReview"
                    class="mt-4 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition"
                  >
                    Publier mon avis
                  </button>
                </div>
              </div>

              <div class="rounded-3xl bg-white p-8 border border-slate-200">
                <h3 class="text-xl font-semibold text-slate-900 mb-4">Avis publiés</h3>
                <div v-if="userReviews.length > 0" class="space-y-4">
                  <div
                    v-for="review in userReviews"
                    :key="review.id"
                    class="rounded-3xl bg-slate-50 p-5 border border-slate-200"
                  >
                    <div class="flex items-center justify-between gap-4 mb-3">
                      <p class="font-semibold text-slate-900">
                        {{ listingsStore.getListingById(review.listingId)?.title || 'Logement' }}
                      </p>
                      <span class="rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-semibold">
                        {{ review.rating }}★
                      </span>
                    </div>
                    <p class="text-sm text-slate-700">{{ review.comment }}</p>
                    <p class="text-xs text-slate-500 mt-3">Publié le {{ new Date(review.createdAt).toLocaleDateString('fr-FR') }}</p>
                  </div>
                </div>
                <div v-else class="rounded-3xl bg-slate-50 p-5 text-slate-600">
                  Vous n'avez pas encore rédigé d'avis.
                </div>
              </div>
            </div>
          </section>

          <section v-if="selectedTab === 'explore'">
            <div class="mb-6">
              <h2 class="text-2xl font-semibold text-slate-900">Trouver un logement</h2>
              <p class="text-sm text-slate-600">Filtrez par ville, prix et consultez les offres disponibles.</p>
            </div>

            <div class="grid gap-4 md:grid-cols-3 mb-8">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Ville</label>
                <select
                  v-model="exploreCity"
                  class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">Toutes les villes</option>
                  <option v-for="city in cityOptions" :key="city" :value="city">{{ city }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Prix min (DH)</label>
                <input
                  type="number"
                  min="0"
                  v-model.number="minPrice"
                  class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Prix max (DH)</label>
                <input
                  type="number"
                  min="0"
                  v-model.number="maxPrice"
                  class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <div class="flex flex-wrap gap-3 mb-8">
              <button
                @click="goToSearch"
                class="rounded-full bg-orange-500 px-6 py-3 text-white font-semibold hover:bg-orange-600 transition"
              >
                Voir la recherche avancée
              </button>
              <button
                @click="handleExploreReset"
                class="rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Réinitialiser les filtres
              </button>
            </div>

            <div v-if="exploreResults.length > 0" class="grid gap-6 xl:grid-cols-2">
              <div
                v-for="listing in exploreResults"
                :key="listing.id"
                class="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm"
              >
                <img :src="listing.image" alt="listing.title" class="h-60 w-full object-cover" />
                <div class="p-6">
                  <div class="flex items-center justify-between gap-4 mb-3">
                    <h3 class="text-xl font-semibold text-slate-900">{{ listing.title }}</h3>
                    <span class="text-orange-600 font-bold">{{ listing.price }} DH</span>
                  </div>
                  <p class="text-sm text-slate-600 mb-4">{{ listing.city }}</p>
                  <p class="text-sm text-slate-600 mb-4 line-clamp-3">{{ listing.description }}</p>
                  <div class="flex flex-wrap gap-3 items-center text-sm text-slate-500">
                    <span>{{ listing.beds }} lits</span>
                    <span>{{ listing.baths }} salles de bain</span>
                    <span>{{ listing.kitchens }} cuisine(s)</span>
                  </div>
                  <router-link
                    :to="{ name: 'ListingDetails', params: { id: listing.id } }"
                    class="mt-6 inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-white font-semibold hover:bg-orange-600 transition"
                  >
                    Voir le logement
                  </router-link>
                </div>
              </div>
            </div>
            <div v-else class="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p class="text-slate-600">Aucun logement ne correspond à ces critères pour le moment.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

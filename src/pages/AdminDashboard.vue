<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref<'overview' | 'users' | 'listings' | 'bookings' | 'payments' | 'reviews'>('overview')
const isLoading = ref(false)
const stats = ref({
  totalUsers: 0,
  totalListings: 0,
  totalBookings: 0,
  totalPlatformRevenue: 0,
  totalGrossRevenue: 0,
  commissionRate: 0,
})
const users = ref<any[]>([])
const listings = ref<any[]>([])
const bookings = ref<any[]>([])
const transactions = ref<any[]>([])
const reviews = ref<any[]>([])
const statusOptions = ['active', 'blocked']
const listingStatusOptions = ['pending', 'approved', 'rejected']
const bookingStatusOptions = ['pending', 'paid', 'cancelled']

const formatCurrency = (value: number) => `${Number(value).toFixed(2)} DH`

const fetchStats = async () => {
  const response = await fetch('/api/admin/dashboard')
  if (response.ok) {
    stats.value = await response.json()
  }
}

const fetchUsers = async () => {
  const response = await fetch('/api/admin/users')
  if (response.ok) {
    users.value = await response.json()
  }
}

const fetchListings = async () => {
  const response = await fetch('/api/admin/listings')
  if (response.ok) {
    listings.value = await response.json()
  }
}

const fetchBookings = async () => {
  const response = await fetch('/api/admin/bookings')
  if (response.ok) {
    bookings.value = await response.json()
  }
}

const fetchTransactions = async () => {
  const response = await fetch('/api/admin/transactions')
  if (response.ok) {
    transactions.value = await response.json()
  }
}

const fetchReviews = async () => {
  const response = await fetch('/api/admin/reviews')
  if (response.ok) {
    reviews.value = await response.json()
  }
}

const refreshCurrentTab = async () => {
  if (activeTab.value === 'overview') {
    await fetchStats()
  }
  if (activeTab.value === 'users') {
    await fetchUsers()
  }
  if (activeTab.value === 'listings') {
    await fetchListings()
  }
  if (activeTab.value === 'bookings') {
    await fetchBookings()
  }
  if (activeTab.value === 'payments') {
    await fetchTransactions()
  }
  if (activeTab.value === 'reviews') {
    await fetchReviews()
  }
}

const setActiveTab = async (tab: typeof activeTab.value) => {
  activeTab.value = tab
  await refreshCurrentTab()
}

const updateUserStatus = async (userId: number, status: string) => {
  const response = await fetch(`/api/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (response.ok) {
    await fetchUsers()
  }
}

const deleteUser = async (userId: number) => {
  if (!confirm('Supprimer cet utilisateur ? Cette action est irréversible.')) return
  const response = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
  if (response.ok) {
    await fetchUsers()
  }
}

const updateListingStatus = async (listingId: number, status: string) => {
  const response = await fetch(`/api/admin/listings/${listingId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (response.ok) {
    await fetchListings()
  }
}

const deleteListing = async (listingId: number) => {
  if (!confirm('Supprimer cette annonce ?')) return
  const response = await fetch(`/api/admin/listings/${listingId}`, { method: 'DELETE' })
  if (response.ok) {
    await fetchListings()
  }
}

const updateBookingStatus = async (bookingId: number, status: string) => {
  const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (response.ok) {
    await fetchBookings()
  }
}

const deleteReview = async (reviewId: number) => {
  if (!confirm('Supprimer cet avis ?')) return
  const response = await fetch(`/api/admin/reviews/${reviewId}`, { method: 'DELETE' })
  if (response.ok) {
    await fetchReviews()
  }
}

const loadAll = async () => {
  isLoading.value = true
  await Promise.all([fetchStats(), fetchUsers(), fetchListings(), fetchBookings(), fetchTransactions(), fetchReviews()])
  isLoading.value = false
}

onMounted(async () => {
  if (!authStore.isLoggedIn || !authStore.isAdmin) {
    router.push('/login')
    return
  }
  await loadAll()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-10">
        <h1 class="text-4xl font-bold text-slate-900 mb-2">Tableau de bord administrateur</h1>
        <p class="text-slate-600 max-w-2xl">
          Gérez les utilisateurs, les annonces, les réservations, les paiements et les avis de la plateforme.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-10">
        <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p class="text-sm font-semibold text-slate-500">Utilisateurs</p>
          <p class="mt-4 text-3xl font-bold text-slate-900">{{ stats.value.totalUsers }}</p>
        </div>
        <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p class="text-sm font-semibold text-slate-500">Annonces</p>
          <p class="mt-4 text-3xl font-bold text-slate-900">{{ stats.value.totalListings }}</p>
        </div>
        <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p class="text-sm font-semibold text-slate-500">Réservations</p>
          <p class="mt-4 text-3xl font-bold text-slate-900">{{ stats.value.totalBookings }}</p>
        </div>
        <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p class="text-sm font-semibold text-slate-500">Revenu brut</p>
          <p class="mt-4 text-3xl font-bold text-slate-900">{{ formatCurrency(stats.value.totalGrossRevenue) }}</p>
        </div>
      </div>

      <div class="mb-8">
        <div class="flex flex-wrap gap-2 bg-white rounded-3xl border border-slate-200 p-3">
          <button
            @click="setActiveTab('overview')"
            :class="[
              'px-5 py-3 rounded-2xl font-semibold transition',
              activeTab.value === 'overview' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100',
            ]"
          >
            Aperçu
          </button>
          <button
            @click="setActiveTab('users')"
            :class="[
              'px-5 py-3 rounded-2xl font-semibold transition',
              activeTab.value === 'users' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100',
            ]"
          >
            Utilisateurs
          </button>
          <button
            @click="setActiveTab('listings')"
            :class="[
              'px-5 py-3 rounded-2xl font-semibold transition',
              activeTab.value === 'listings' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100',
            ]"
          >
            Annonces
          </button>
          <button
            @click="setActiveTab('bookings')"
            :class="[
              'px-5 py-3 rounded-2xl font-semibold transition',
              activeTab.value === 'bookings' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100',
            ]"
          >
            Réservations
          </button>
          <button
            @click="setActiveTab('payments')"
            :class="[
              'px-5 py-3 rounded-2xl font-semibold transition',
              activeTab.value === 'payments' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100',
            ]"
          >
            Paiements
          </button>
          <button
            @click="setActiveTab('reviews')"
            :class="[
              'px-5 py-3 rounded-2xl font-semibold transition',
              activeTab.value === 'reviews' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100',
            ]"
          >
            Avis
          </button>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <div v-if="activeTab.value === 'overview'">
          <div class="grid gap-6 md:grid-cols-3 mb-8">
            <div class="rounded-3xl bg-slate-50 p-6 border border-slate-200">
              <p class="text-sm text-slate-500">Revenu platforme</p>
              <p class="mt-4 text-3xl font-bold text-slate-900">{{ formatCurrency(stats.value.totalPlatformRevenue) }}</p>
            </div>
            <div class="rounded-3xl bg-slate-50 p-6 border border-slate-200">
              <p class="text-sm text-slate-500">Taux de commission</p>
              <p class="mt-4 text-3xl font-bold text-slate-900">{{ (stats.value.commissionRate * 100).toFixed(1) }}%</p>
            </div>
            <div class="rounded-3xl bg-slate-50 p-6 border border-slate-200">
              <p class="text-sm text-slate-500">Utilisateurs actifs</p>
              <p class="mt-4 text-3xl font-bold text-slate-900">{{ users.length }}</p>
            </div>
          </div>

          <div class="grid gap-6 lg:grid-cols-2">
            <div class="rounded-3xl bg-slate-50 p-6 border border-slate-200">
              <h2 class="text-xl font-semibold text-slate-900 mb-4">Résumé rapide</h2>
              <ul class="space-y-3 text-slate-600 text-sm">
                <li><strong>{{ stats.value.totalUsers }}</strong> utilisateurs inscrits</li>
                <li><strong>{{ stats.value.totalListings }}</strong> annonces publiées</li>
                <li><strong>{{ stats.value.totalBookings }}</strong> réservations</li>
                <li><strong>{{ transactions.length }}</strong> transactions enregistrées</li>
                <li><strong>{{ reviews.length }}</strong> avis publiés</li>
              </ul>
            </div>
            <div class="rounded-3xl bg-slate-50 p-6 border border-slate-200">
              <h2 class="text-xl font-semibold text-slate-900 mb-4">Actions administrateur</h2>
              <p class="text-slate-600 text-sm">
                Utilisez les onglets pour gérer les utilisateurs, modérer les annonces, suivre les réservations et vérifier les paiements.
              </p>
            </div>
          </div>
        </div>

        <div v-if="activeTab.value === 'users'">
          <div class="overflow-x-auto">
            <table class="min-w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr class="text-slate-500 text-sm uppercase tracking-[0.15em]">
                  <th class="px-4 py-3">Nom</th>
                  <th class="px-4 py-3">Email</th>
                  <th class="px-4 py-3">Rôle</th>
                  <th class="px-4 py-3">Statut</th>
                  <th class="px-4 py-3">Créé le</th>
                  <th class="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" class="bg-slate-50 rounded-3xl">
                  <td class="px-4 py-4 font-medium text-slate-900">{{ user.name }}</td>
                  <td class="px-4 py-4 text-slate-600">{{ user.email }}</td>
                  <td class="px-4 py-4 text-slate-600 capitalize">{{ user.role }}</td>
                  <td class="px-4 py-4 text-slate-600 capitalize">{{ user.status }}</td>
                  <td class="px-4 py-4 text-slate-600">{{ new Date(user.created_at).toLocaleDateString('fr-FR') }}</td>
                  <td class="px-4 py-4 text-right space-x-2">
                    <button
                      v-for="status in statusOptions"
                      :key="status"
                      @click="updateUserStatus(user.id, status)"
                      class="rounded-full border px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                    >
                      {{ status === user.status ? 'Actif' : status === 'blocked' ? 'Bloquer' : status }}
                    </button>
                    <button
                      @click="deleteUser(user.id)"
                      class="rounded-full bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200 transition"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="activeTab.value === 'listings'">
          <div class="overflow-x-auto">
            <table class="min-w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr class="text-slate-500 text-sm uppercase tracking-[0.15em]">
                  <th class="px-4 py-3">Titre</th>
                  <th class="px-4 py-3">Ville</th>
                  <th class="px-4 py-3">Prix</th>
                  <th class="px-4 py-3">Statut</th>
                  <th class="px-4 py-3">Propriétaire</th>
                  <th class="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="listing in listings" :key="listing.id" class="bg-slate-50 rounded-3xl">
                  <td class="px-4 py-4 font-medium text-slate-900">{{ listing.title }}</td>
                  <td class="px-4 py-4 text-slate-600">{{ listing.city }}</td>
                  <td class="px-4 py-4 text-slate-900">{{ listing.price }} DH</td>
                  <td class="px-4 py-4 text-slate-600 capitalize">{{ listing.status }}</td>
                  <td class="px-4 py-4 text-slate-600">{{ listing.owner_name || '—' }}</td>
                  <td class="px-4 py-4 text-right space-x-2">
                    <button
                      v-for="status in listingStatusOptions"
                      :key="status"
                      @click="updateListingStatus(listing.id, status)"
                      class="rounded-full border px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                    >
                      {{ status === listing.status ? 'Actif' : status === 'approved' ? 'Approuver' : status === 'rejected' ? 'Rejeter' : status }}
                    </button>
                    <button
                      @click="deleteListing(listing.id)"
                      class="rounded-full bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200 transition"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="activeTab.value === 'bookings'">
          <div class="overflow-x-auto">
            <table class="min-w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr class="text-slate-500 text-sm uppercase tracking-[0.15em]">
                  <th class="px-4 py-3">#</th>
                  <th class="px-4 py-3">Client</th>
                  <th class="px-4 py-3">Logement</th>
                  <th class="px-4 py-3">Dates</th>
                  <th class="px-4 py-3">Montant</th>
                  <th class="px-4 py-3">Statut</th>
                  <th class="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="booking in bookings" :key="booking.id" class="bg-slate-50 rounded-3xl">
                  <td class="px-4 py-4 font-medium text-slate-900">#{{ booking.id }}</td>
                  <td class="px-4 py-4 text-slate-600">{{ booking.user_name }}</td>
                  <td class="px-4 py-4 text-slate-600">{{ booking.listing_title }}</td>
                  <td class="px-4 py-4 text-slate-600">{{ new Date(booking.check_in_date).toLocaleDateString('fr-FR') }} → {{ new Date(booking.check_out_date).toLocaleDateString('fr-FR') }}</td>
                  <td class="px-4 py-4 text-slate-900">{{ booking.total_price }} DH</td>
                  <td class="px-4 py-4 text-slate-600 capitalize">{{ booking.status }}</td>
                  <td class="px-4 py-4 text-right space-x-2">
                    <button
                      v-for="status in bookingStatusOptions"
                      :key="status"
                      @click="updateBookingStatus(booking.id, status)"
                      class="rounded-full border px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                    >
                      {{ status === booking.status ? 'Actif' : status === 'paid' ? 'Payer' : status === 'cancelled' ? 'Annuler' : status }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="activeTab.value === 'payments'">
          <div class="overflow-x-auto">
            <table class="min-w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr class="text-slate-500 text-sm uppercase tracking-[0.15em]">
                  <th class="px-4 py-3">Transaction</th>
                  <th class="px-4 py-3">Client</th>
                  <th class="px-4 py-3">Logement</th>
                  <th class="px-4 py-3">Montant</th>
                  <th class="px-4 py-3">Commission</th>
                  <th class="px-4 py-3">Paiement</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in transactions" :key="transaction.id" class="bg-slate-50 rounded-3xl">
                  <td class="px-4 py-4 font-medium text-slate-900">#{{ transaction.id }}</td>
                  <td class="px-4 py-4 text-slate-600">{{ transaction.customer_name }}</td>
                  <td class="px-4 py-4 text-slate-600">{{ transaction.listing_title }}</td>
                  <td class="px-4 py-4 text-slate-900">{{ transaction.total_price }} DH</td>
                  <td class="px-4 py-4 text-slate-900">{{ transaction.platform_fee }} DH</td>
                  <td class="px-4 py-4 text-slate-600 capitalize">{{ transaction.status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="activeTab.value === 'reviews'">
          <div class="overflow-x-auto">
            <table class="min-w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr class="text-slate-500 text-sm uppercase tracking-[0.15em]">
                  <th class="px-4 py-3">Utilisateur</th>
                  <th class="px-4 py-3">Logement</th>
                  <th class="px-4 py-3">Note</th>
                  <th class="px-4 py-3">Commentaire</th>
                  <th class="px-4 py-3">Date</th>
                  <th class="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="review in reviews" :key="review.id" class="bg-slate-50 rounded-3xl">
                  <td class="px-4 py-4 text-slate-900">{{ review.user_name }}</td>
                  <td class="px-4 py-4 text-slate-600">{{ review.listing_title }}</td>
                  <td class="px-4 py-4 text-slate-900">{{ review.rating }}/5</td>
                  <td class="px-4 py-4 text-slate-600 line-clamp-2">{{ review.comment }}</td>
                  <td class="px-4 py-4 text-slate-600">{{ new Date(review.created_at).toLocaleDateString('fr-FR') }}</td>
                  <td class="px-4 py-4 text-right">
                    <button
                      @click="deleteReview(review.id)"
                      class="rounded-full bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200 transition"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

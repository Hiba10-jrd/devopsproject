<script setup lang="ts">
import { ref, computed } from 'vue'
import { useListingsStore } from '@/stores/listings'
import type { Listing } from '@/stores/listings'

const listingsStore = useListingsStore()

const activeTab = ref<'listings' | 'bookings' | 'add'>('listings')
const editingId = ref<number | null>(null)

const formData = ref<Partial<Listing>>({
  title: '',
  city: '',
  price: 0,
  image: '',
  beds: 1,
  baths: 1,
  description: '',
  rating: 4.5,
})

const bookings = computed(() => listingsStore.getAllBookings())

const handleAddListing = () => {
  if (!formData.value.title || !formData.value.city || !formData.value.price || !formData.value.image || !formData.value.description) {
    alert('Veuillez remplir tous les champs')
    return
  }

  if (editingId.value) {
    listingsStore.updateListing(editingId.value, formData.value)
    editingId.value = null
  } else {
    listingsStore.addListing(formData.value as Omit<Listing, 'id'>)
  }

  resetForm()
  activeTab.value = 'listings'
}

const resetForm = () => {
  formData.value = {
    title: '',
    city: '',
    price: 0,
    image: '',
    beds: 1,
    baths: 1,
    description: '',
    rating: 4.5,
  }
  editingId.value = null
}

const handleEditListing = (listing: Listing) => {
  formData.value = { ...listing }
  editingId.value = listing.id
  activeTab.value = 'add'
}

const handleDeleteListing = (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce logement ?')) {
    listingsStore.deleteListing(id)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Tableau de bord administrateur</h1>
        <p class="text-gray-600">Gérez vos logements et réservations</p>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow mb-8 border-b border-gray-200">
        <div class="flex">
          <button
            @click="activeTab = 'listings'"
            :class="[
              'px-6 py-4 font-semibold transition',
              activeTab === 'listings'
                ? 'text-pink-600 border-b-2 border-pink-500'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Mes logements ({{ listingsStore.listings.length }})
          </button>
          <button
            @click="activeTab = 'bookings'"
            :class="[
              'px-6 py-4 font-semibold transition',
              activeTab === 'bookings'
                ? 'text-pink-600 border-b-2 border-pink-500'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Réservations ({{ bookings.length }})
          </button>
          <button
            @click="activeTab = 'add'"
            :class="[
              'px-6 py-4 font-semibold transition',
              activeTab === 'add'
                ? 'text-pink-600 border-b-2 border-pink-500'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            {{ editingId ? 'Modifier' : 'Ajouter' }} un logement
          </button>
        </div>
      </div>

      <!-- Listings Tab -->
      <div v-if="activeTab === 'listings'" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Titre</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ville</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Prix</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Lits</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Note</th>
                <th class="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="listing in listingsStore.listings" :key="listing.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ listing.title }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ listing.city }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 font-semibold">{{ listing.price }}€</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ listing.beds }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">⭐ {{ listing.rating }}</td>
                <td class="px-6 py-4 text-right text-sm space-x-2">
                  <button
                    @click="handleEditListing(listing)"
                    class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition"
                  >
                    Modifier
                  </button>
                  <button
                    @click="handleDeleteListing(listing.id)"
                    class="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bookings Tab -->
      <div v-if="activeTab === 'bookings'" class="bg-white rounded-lg shadow overflow-hidden">
        <div v-if="bookings.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID Réservation</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID Logement</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Arrivée</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Départ</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Prix total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">#{{ booking.id }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">#{{ booking.listingId }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ new Date(booking.checkInDate).toLocaleDateString('fr-FR') }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ new Date(booking.checkOutDate).toLocaleDateString('fr-FR') }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ booking.totalPrice }}€</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="p-12 text-center">
          <p class="text-gray-500">Aucune réservation pour le moment</p>
        </div>
      </div>

      <!-- Add/Edit Form Tab -->
      <div v-if="activeTab === 'add'" class="bg-white rounded-lg shadow p-8 max-w-2xl">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ editingId ? 'Modifier le logement' : 'Ajouter un nouveau logement' }}
        </h2>

        <form @submit.prevent="handleAddListing" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Titre</label>
            <input
              v-model="formData.title"
              type="text"
              placeholder="Titre du logement"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
              <input
                v-model="formData.city"
                type="text"
                placeholder="Casablanca"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Prix (€/nuit)</label>
              <input
                v-model.number="formData.price"
                type="number"
                min="0"
                placeholder="450"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">URL de l'image</label>
            <input
              v-model="formData.image"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Lits</label>
              <input
                v-model.number="formData.beds"
                type="number"
                min="1"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Salles de bain</label>
              <input
                v-model.number="formData.baths"
                type="number"
                min="1"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Note</label>
              <input
                v-model.number="formData.rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              v-model="formData.description"
              placeholder="Description du logement..."
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition"
            >
              {{ editingId ? 'Mettre à jour' : 'Ajouter' }}
            </button>
            <button
              v-if="editingId"
              type="button"
              @click="resetForm"
              class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

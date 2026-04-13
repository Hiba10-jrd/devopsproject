<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useListingsStore, type Listing } from '@/stores/listings'

const router = useRouter()
const authStore = useAuthStore()
const listingsStore = useListingsStore()

const activeTab = ref<'listings' | 'bookings' | 'revenues' | 'profile'>('listings')
const editingId = ref<number | null>(null)

const formData = ref<Partial<Listing>>({
  title: '',
  city: '',
  price: 0,
  image: '',
  images: [],
  amenities: [],
  beds: 1,
  baths: 1,
  kitchens: 1,
  salons: 1,
  description: '',
  rating: 4.5,
})

const imagesRaw = ref('')
const amenitiesRaw = ref('')

const profileForm = ref({
  name: authStore.currentUser?.name ?? '',
  email: authStore.currentUser?.email ?? '',
  phone: authStore.currentUser?.phone ?? '',
  city: authStore.currentUser?.city ?? '',
  address: authStore.currentUser?.address ?? '',
  description: authStore.currentUser?.description ?? '',
})

const hostId = computed(() => authStore.currentUser?.id ?? 0)
const hostName = computed(() => authStore.currentUser?.name ?? '')

const hostListings = computed(() =>
  listingsStore.getHostListings(hostId.value, hostName.value),
)

const hostBookings = computed(() =>
  listingsStore.bookings.filter((booking) => {
    if (booking.ownerName && booking.ownerName === hostName.value) {
      return true
    }
    return hostListings.value.some((listing) => listing.id === booking.listingId)
  }),
)

const totalRevenue = computed(() => hostBookings.value.reduce((sum, booking) => sum + booking.totalPrice, 0))
const totalBookings = computed(() => hostBookings.value.length)
const totalListings = computed(() => hostListings.value.length)

const resetForm = () => {
  formData.value = {
    title: '',
    city: '',
    price: 0,
    image: '',
    images: [],
    amenities: [],
    beds: 1,
    baths: 1,
    kitchens: 1,
    salons: 1,
    description: '',
    rating: 4.5,
  }
  imagesRaw.value = ''
  amenitiesRaw.value = ''
  editingId.value = null
}

const handleEditListing = (listing: Listing) => {
  formData.value = { ...listing }
  imagesRaw.value = (listing.images ?? []).join(', ')
  amenitiesRaw.value = (listing.amenities ?? []).join(', ')
  editingId.value = listing.id
  activeTab.value = 'listings'
}

const handleDeleteListing = (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce logement ?')) {
    listingsStore.deleteListing(id)
  }
}

const handleAddListing = () => {
  if (!formData.value.title || !formData.value.city || !formData.value.price || !formData.value.image || !formData.value.description) {
    alert('Veuillez remplir tous les champs obligatoires du logement.')
    return
  }

  const ownerPhone = authStore.currentUser?.phone ?? ''
  const ownerAddress = authStore.currentUser?.address ?? ''
  const ownerId = authStore.currentUser?.id
  const ownerName = authStore.currentUser?.name ?? ''

  const listingPayload = {
    ...formData.value,
    images: String(imagesRaw.value).split(',').map((value) => value.trim()).filter(Boolean),
    amenities: String(amenitiesRaw.value).split(',').map((value) => value.trim()).filter(Boolean),
    ownerId,
    ownerName,
    ownerPhone,
    address: ownerAddress,
  }

  if (editingId.value) {
    listingsStore.updateListing(editingId.value, listingPayload)
    editingId.value = null
  } else {
    listingsStore.addListing(listingPayload as Omit<Listing, 'id'>)
  }

  resetForm()
  activeTab.value = 'listings'
}

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
    alert('Informations personnelles mises à jour avec succès.')
  } else {
    alert('Impossible de mettre à jour vos informations. Veuillez vous reconnecter.')
  }
}

onMounted(() => {
  if (!authStore.isLoggedIn || !authStore.isHost) {
    router.push('/login')
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-10">
        <h1 class="text-4xl font-bold text-slate-900 mb-2">Espace hôte</h1>
        <p class="text-slate-600 max-w-2xl">
          Gérez vos annonces, suivez vos réservations et mettez à jour vos informations personnelles.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-10">
        <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p class="text-sm font-semibold text-slate-500">Annonces publiées</p>
          <p class="mt-4 text-3xl font-bold text-slate-900">{{ totalListings }}</p>
        </div>
        <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p class="text-sm font-semibold text-slate-500">Réservations reçues</p>
          <p class="mt-4 text-3xl font-bold text-slate-900">{{ totalBookings }}</p>
        </div>
        <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p class="text-sm font-semibold text-slate-500">Revenu total</p>
          <p class="mt-4 text-3xl font-bold text-slate-900">{{ totalRevenue.toFixed(2) }} DH</p>
        </div>
        <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p class="text-sm font-semibold text-slate-500">Nom</p>
          <p class="mt-4 text-2xl font-bold text-slate-900">{{ hostName }}</p>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 mb-10">
        <div class="flex flex-wrap gap-1 p-3 bg-slate-50 rounded-t-3xl">
          <button
            @click="activeTab = 'listings'"
            :class="[
              'px-5 py-3 rounded-2xl font-semibold transition',
              activeTab === 'listings'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 hover:bg-slate-100',
            ]"
          >
            Mes annonces
          </button>
          <button
            @click="activeTab = 'bookings'"
            :class="[
              'px-5 py-3 rounded-2xl font-semibold transition',
              activeTab === 'bookings'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 hover:bg-slate-100',
            ]"
          >
            Réservations
          </button>
          <button
            @click="activeTab = 'revenues'"
            :class="[
              'px-5 py-3 rounded-2xl font-semibold transition',
              activeTab === 'revenues'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 hover:bg-slate-100',
            ]"
          >
            Revenus
          </button>
          <button
            @click="activeTab = 'profile'"
            :class="[
              'px-5 py-3 rounded-2xl font-semibold transition',
              activeTab === 'profile'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 hover:bg-slate-100',
            ]"
          >
            Mon profil
          </button>
        </div>

        <div class="p-8">
          <section v-if="activeTab === 'listings'">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-2xl font-semibold text-slate-900">Mes annonces</h2>
                <p class="text-sm text-slate-600">Créez, modifiez ou supprimez vos logements.</p>
              </div>
              <button
                @click="activeTab = 'listings'; resetForm();"
                class="rounded-full bg-orange-500 px-5 py-3 text-white font-semibold hover:bg-orange-600 transition"
              >
                Nouvelle annonce
              </button>
            </div>

            <div v-if="hostListings.length > 0" class="overflow-x-auto">
              <table class="min-w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr class="text-slate-500 text-sm uppercase tracking-[0.15em]">
                    <th class="px-4 py-3">Titre</th>
                    <th class="px-4 py-3">Ville</th>
                    <th class="px-4 py-3">Prix</th>
                    <th class="px-4 py-3">Statut</th>
                    <th class="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="listing in hostListings"
                    :key="listing.id"
                    class="bg-slate-50 rounded-3xl"
                  >
                    <td class="px-4 py-4 font-medium text-slate-900">{{ listing.title }}</td>
                    <td class="px-4 py-4 text-slate-600">{{ listing.city }}</td>
                    <td class="px-4 py-4 text-slate-900">{{ listing.price }} DH</td>
                    <td class="px-4 py-4 text-slate-600">Publié</td>
                    <td class="px-4 py-4 text-right space-x-2">
                      <button
                        @click="handleEditListing(listing)"
                        class="rounded-full border border-orange-500 px-4 py-2 text-orange-600 hover:bg-orange-50 transition"
                      >
                        Modifier
                      </button>
                      <button
                        @click="handleDeleteListing(listing.id)"
                        class="rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200 transition"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p class="text-slate-600">Vous n’avez pas encore de logement publié.</p>
            </div>

            <div class="mt-10 bg-slate-50 rounded-3xl border border-slate-200 p-8">
              <h3 class="text-xl font-semibold text-slate-900 mb-4">Ajouter ou modifier une annonce</h3>
              <div class="grid gap-6 md:grid-cols-2">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Titre</label>
                  <input
                    v-model="formData.title"
                    type="text"
                    placeholder="Appartement à Casablanca"
                    class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Ville</label>
                  <input
                    v-model="formData.city"
                    type="text"
                    placeholder="Casablanca"
                    class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Prix par nuit</label>
                  <input
                    v-model.number="formData.price"
                    type="number"
                    min="0"
                    placeholder="450"
                    class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Image principale</label>
                  <input
                    v-model="formData.image"
                    type="url"
                    placeholder="https://..."
                    class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Autres images (URLs séparées par des virgules)</label>
                  <input
                    v-model="imagesRaw"
                    type="text"
                    placeholder="https://..., https://..."
                    class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Équipements (virgules)</label>
                  <input
                    v-model="amenitiesRaw"
                    type="text"
                    placeholder="Wi-Fi, Climatisation, Cuisine équipée"
                    class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Lits</label>
                  <input
                    v-model.number="formData.beds"
                    type="number"
                    min="1"
                    class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Salles de bain</label>
                  <input
                    v-model.number="formData.baths"
                    type="number"
                    min="1"
                    class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea
                    v-model="formData.description"
                    rows="4"
                    class="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>
              <button
                @click="handleAddListing"
                class="mt-6 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition"
              >
                {{ editingId ? 'Enregistrer les modifications' : 'Publier cette annonce' }}
              </button>
            </div>
          </section>

          <section v-if="activeTab === 'bookings'">
            <div class="mb-6">
              <h2 class="text-2xl font-semibold text-slate-900">Réservations</h2>
              <p class="text-sm text-slate-600">Consultez les réservations associées à vos annonces.</p>
            </div>

            <div v-if="hostBookings.length > 0" class="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <table class="min-w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr class="text-slate-500 text-sm uppercase tracking-[0.15em]">
                    <th class="px-4 py-3">ID</th>
                    <th class="px-4 py-3">Logement</th>
                    <th class="px-4 py-3">Client</th>
                    <th class="px-4 py-3">Arrivée</th>
                    <th class="px-4 py-3">Départ</th>
                    <th class="px-4 py-3">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="booking in hostBookings" :key="booking.id" class="bg-white rounded-3xl">
                    <td class="px-4 py-4 font-medium text-slate-900">#{{ booking.id }}</td>
                    <td class="px-4 py-4 text-slate-600">{{ booking.listingTitle }}</td>
                    <td class="px-4 py-4 text-slate-600">#{{ booking.userId }}</td>
                    <td class="px-4 py-4 text-slate-600">{{ new Date(booking.checkInDate).toLocaleDateString('fr-FR') }}</td>
                    <td class="px-4 py-4 text-slate-600">{{ new Date(booking.checkOutDate).toLocaleDateString('fr-FR') }}</td>
                    <td class="px-4 py-4 font-semibold text-slate-900">{{ booking.totalPrice }} DH</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p class="text-slate-600">Aucune réservation pour vos annonces pour le moment.</p>
            </div>
          </section>

          <section v-if="activeTab === 'revenues'">
            <div class="grid gap-6 md:grid-cols-3 mb-6">
              <div class="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                <p class="text-sm text-slate-500">Revenu total</p>
                <p class="mt-4 text-3xl font-bold text-slate-900">{{ totalRevenue.toFixed(2) }} DH</p>
              </div>
              <div class="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                <p class="text-sm text-slate-500">Réservations</p>
                <p class="mt-4 text-3xl font-bold text-slate-900">{{ totalBookings }}</p>
              </div>
              <div class="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                <p class="text-sm text-slate-500">Annonces actives</p>
                <p class="mt-4 text-3xl font-bold text-slate-900">{{ totalListings }}</p>
              </div>
            </div>

            <div class="rounded-3xl border border-slate-200 bg-white p-8">
              <h3 class="text-xl font-semibold text-slate-900 mb-4">Résumé des revenus</h3>
              <p class="text-slate-600 mb-4">
                Votre revenu est calculé sur l’ensemble des réservations confirmées pour vos annonces.
              </p>
              <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                  <p class="text-sm text-slate-500">Revenu moyen par réservation</p>
                  <p class="mt-4 text-2xl font-bold text-slate-900">
                    {{ hostBookings.length ? (totalRevenue / hostBookings.length).toFixed(2) : '0.00' }} DH
                  </p>
                </div>
                <div class="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                  <p class="text-sm text-slate-500">Annonces ayant généré des réservations</p>
                  <p class="mt-4 text-2xl font-bold text-slate-900">
                    {{ new Set(hostBookings.map((booking) => booking.listingTitle)).size }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section v-if="activeTab === 'profile'">
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
        </div>
      </div>
    </div>
  </div>
</template>

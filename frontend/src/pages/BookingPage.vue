<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useListingsStore } from '@/stores/listings'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const listingsStore = useListingsStore()
const authStore = useAuthStore()

const listingId = parseInt(route.params.id as string)
const listing = computed(() => listingsStore.getListingById(listingId))

const checkInDate = ref('')
const checkOutDate = ref('')
const guests = ref(1)
const paymentMethod = ref('cash')
const guestPhone = ref('')
const guestNotes = ref('')
const agreeTerms = ref(false)
const isSubmitting = ref(false)

const numberOfNights = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 0
  const start = new Date(checkInDate.value)
  const end = new Date(checkOutDate.value)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays)
})

const totalPrice = computed(() => {
  if (!listing.value) return 0
  return listing.value.price * numberOfNights.value
})

const handleConfirmBooking = async () => {
  if (!checkInDate.value || !checkOutDate.value || !listing.value || !authStore.currentUser) {
    alert('Veuillez remplir tous les champs')
    return
  }

  if (!guestPhone.value.trim()) {
    alert('Veuillez entrer votre numéro de téléphone')
    return
  }

  if (new Date(checkInDate.value) >= new Date(checkOutDate.value)) {
    alert("La date de départ doit être après la date d'arrivée")
    return
  }

  if (!agreeTerms.value) {
    alert("Veuillez accepter les conditions d'utilisation")
    return
  }

  isSubmitting.value = true

  try {
    const bookingPayload = {
      listingId: listing.value.id,
      userId: authStore.currentUser.id,
      checkInDate: checkInDate.value,
      checkOutDate: checkOutDate.value,
      totalPrice: totalPrice.value,
      guestPhone: guestPhone.value,
      guestNotes: guestNotes.value,
      paymentMethod: paymentMethod.value,
      ownerId: listing.value.ownerId,
      ownerName: listing.value.ownerName,
      ownerPhone: listing.value.ownerPhone,
      listingTitle: listing.value.title,
    }

    let booking
    try {
      booking = await listingsStore.addBookingApi(bookingPayload)
    } catch (apiError) {
      console.warn('API reservation failed, fallback local store:', apiError)
      booking = listingsStore.addBooking(bookingPayload)
    }

    alert(
      'Reservation confirmee avec succes!\n\nNumero de confirmation: ' +
        booking.id +
        '\nStatut: En attente' +
        '\n\nVous pouvez maintenant contacter le proprietaire au: ' +
        listing.value.ownerPhone,
    )
    router.push('/client')
  } catch (error) {
    console.error('Booking failed:', error)
    alert('Une erreur est survenue lors de la réservation')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  if (!listing.value) {
    router.push('/')
  }
  if (!authStore.isLoggedIn) {
    router.push('/login')
  }
})
</script>

<template>
  <div v-if="listing && authStore.currentUser" class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Confirmez votre réservation</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-8">
            <!-- Listing Summary -->
            <div class="mb-8 pb-8 border-b border-gray-200">
              <div class="flex gap-4">
                <img
                  :src="listing.image"
                  :alt="listing.title"
                  class="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">{{ listing.title }}</h2>
                  <p class="text-gray-600">{{ listing.city }}</p>
                  <p class="text-sm text-gray-500 mt-2">
                    {{ listing.beds }} lit{{ listing.beds > 1 ? 's' : '' }} •
                    {{ listing.baths }} salle{{ listing.baths > 1 ? 's' : '' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Booking Details -->
            <div class="space-y-6 mb-8">
              <h3 class="text-xl font-semibold text-gray-900">Détails de la réservation</h3>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Date d'arrivée</label>
                <input
                  v-model="checkInDate"
                  type="date"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  :min="new Date().toISOString().split('T')[0]"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Date de départ</label>
                <input
                  v-model="checkOutDate"
                  type="date"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  :min="new Date().toISOString().split('T')[0]"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                  >Nombre de clients</label
                >
                <input
                  v-model.number="guests"
                  type="number"
                  min="1"
                  max="10"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <!-- Guest Information -->
            <div class="mb-8 pb-8 border-b border-gray-200">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">
                Vos informations personnelles
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
                  <input
                    :value="authStore.currentUser.name"
                    disabled
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    :value="authStore.currentUser.email"
                    disabled
                    type="email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2"
                    >Numéro de téléphone *</label
                  >
                  <input
                    v-model="guestPhone"
                    type="tel"
                    placeholder="+212 6 12 34 56 78"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2"
                    >Message au propriétaire (optionnel)</label
                  >
                  <textarea
                    v-model="guestNotes"
                    placeholder="Parlez-nous de vous, vos demandes spéciales..."
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="mb-8 pb-8 border-b border-gray-200">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Méthode de paiement</h3>
              <div class="space-y-3">
                <div
                  class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-500 cursor-pointer transition"
                  :class="{ 'border-orange-500 bg-orange-50': paymentMethod === 'cash' }"
                >
                  <input
                    id="cash"
                    v-model="paymentMethod"
                    type="radio"
                    value="cash"
                    class="w-4 h-4 accent-orange-500"
                  />
                  <label for="cash" class="ml-3 flex-1 cursor-pointer">
                    <p class="font-semibold text-gray-900">Paiement en espèces</p>
                    <p class="text-sm text-gray-600">
                      Payez le propriétaire directement à l'arrivée
                    </p>
                  </label>
                </div>
              </div>
              <p class="text-sm text-gray-500 mt-4">
                <strong>Note:</strong> Vous recevrez les coordonnées du propriétaire après
                confirmation. Le paiement s'effectuera directement avec le propriétaire.
              </p>
            </div>

            <!-- Owner Contact Info -->
            <div class="mb-8 pb-8 border-b border-gray-200 bg-blue-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Informations du propriétaire</h3>
              <div class="space-y-2">
                <p class="text-gray-700"><strong>Nom:</strong> {{ listing.ownerName }}</p>
                <p class="text-gray-700">
                  <strong>Téléphone:</strong>
                  <a
                    :href="'tel:' + listing.ownerPhone"
                    class="text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    {{ listing.ownerPhone }}
                  </a>
                </p>
                <p class="text-sm text-gray-600 mt-2">
                  Vous pourrez contacter le propriétaire directement après la confirmation de votre
                  réservation.
                </p>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-start gap-3 mb-8">
              <input
                id="terms"
                v-model="agreeTerms"
                type="checkbox"
                class="mt-1 w-4 h-4 accent-orange-500 rounded cursor-pointer"
              />
              <label for="terms" class="text-sm text-gray-600 cursor-pointer">
                J'accepte les conditions d'utilisation et les règles de la maison. Je comprends que
                le paiement s'effectuera en espèces avec le propriétaire.
              </label>
            </div>

            <!-- Confirm Button -->
            <button
              @click="handleConfirmBooking"
              :disabled="isSubmitting"
              class="w-full px-6 py-4 bg-orange-500 text-white rounded-lg font-bold text-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Traitement...' : 'Confirmer la réservation' }}
            </button>
          </div>
        </div>

        <!-- Price Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white border border-gray-200 rounded-lg shadow p-6 sticky top-20">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Récapitulatif du prix</h3>

            <div v-if="numberOfNights > 0" class="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div class="flex justify-between">
                <span class="text-gray-700"
                  >{{ listing.price }}DH × {{ numberOfNights }} nuit{{
                    numberOfNights > 1 ? 's' : ''
                  }}</span
                >
                <span class="font-semibold text-gray-900"
                  >{{ listing.price * numberOfNights }}DH</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-700">Frais de nettoyage</span>
                <span class="font-semibold text-gray-900">Gratuit</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-700">Frais de service</span>
                <span class="font-semibold text-gray-900">Gratuit</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>{{ totalPrice }}DH</span>
              </div>
            </div>
            <div v-else class="text-center text-gray-500 py-4">Sélectionnez vos dates</div>

            <!-- Policies -->
            <div class="space-y-3 text-xs text-gray-600">
              <div class="flex gap-2">
                <span>✓</span>
                <span>Annulation flexible</span>
              </div>
              <div class="flex gap-2">
                <span>✓</span>
                <span>Paiement en espèces</span>
              </div>
              <div class="flex gap-2">
                <span>✓</span>
                <span>Contact propriétaire garanti</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


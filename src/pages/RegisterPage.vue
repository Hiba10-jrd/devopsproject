<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref<'client' | 'host'>('client')
const phone = ref('')
const cin = ref('')
const city = ref('')
const address = ref('')
const description = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const cityOptions = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Essaouira',
  'Chefchaouen',
  'Tétouan',
  'Nador',
  'El Jadida',
  'Beni Mellal',
  'Kénitra',
  'Safi',
]

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }

  if (!phone.value || !city.value) {
    errorMessage.value = 'Veuillez renseigner le téléphone et choisir une ville'
    return
  }

  if (role.value === 'host' && (!address.value || !description.value)) {
    errorMessage.value = 'Veuillez remplir toutes les informations spécifiques pour l’hôte'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.registerApi(
      name.value,
      email.value,
      password.value,
      role.value,
      {
        phone: phone.value,
        cin: cin.value,
        city: city.value,
        address: address.value,
        description: description.value,
      },
    )
    if (result.success) {
      const redirectPath = role.value === 'host' ? '/host' : '/'
      router.push(redirectPath)
    } else {
      errorMessage.value = result.message || 'Cet email est déjà utilisé'
    }
  } catch (error) {
    errorMessage.value = 'Une erreur est survenue'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleRegister()
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <img src="/images/logo.png" alt="MAISSON Logo"  class="h-32 w-auto object-contain max-w-full">
        </div>

        <h2 class="text-2xl font-bold text-center text-gray-900 mb-6">S'inscrire</h2>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p class="text-orange-700 text-sm">{{ errorMessage }}</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="Nom complet"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              :disabled="isLoading"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="votre@email.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              :disabled="isLoading"
            />
          </div>

          <div>
            <p class="block text-sm font-semibold text-gray-700 mb-2">Je m'inscris en tant que</p>
            <div class="grid grid-cols-2 gap-3 mb-4">
              <label
                class="flex items-center justify-center gap-3 border rounded-lg p-3 cursor-pointer transition hover:border-orange-400"
                :class="role === 'client' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white'"
              >
                <input
                  type="radio"
                  name="role"
                  value="client"
                  v-model="role"
                  class="hidden"
                />
                <span class="text-sm font-semibold">Voyageur</span>
              </label>

              <label
                class="flex items-center justify-center gap-3 border rounded-lg p-3 cursor-pointer transition hover:border-orange-400"
                :class="role === 'host' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white'"
              >
                <input
                  type="radio"
                  name="role"
                  value="host"
                  v-model="role"
                  class="hidden"
                />
                <span class="text-sm font-semibold">Hôte</span>
              </label>
            </div>
          </div>

          <div class="space-y-4 p-4 border border-orange-100 rounded-lg bg-orange-50">
            <div>
              <p class="text-sm font-semibold text-gray-700 mb-2">1. Informations personnelles</p>
              <label for="phone" class="block text-sm text-gray-600 mb-1">Téléphone</label>
              <input
                id="phone"
                v-model="phone"
                type="tel"
                placeholder="+212 6X XX XX XX"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                :disabled="isLoading"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">Ville</label>
              <div class="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                <button
                  v-for="opt in cityOptions"
                  :key="opt"
                  type="button"
                  @click="city = opt"
                  :class="[
                    'w-full rounded-lg border px-3 py-2 text-sm transition',
                    city === opt
                      ? 'border-orange-600 bg-orange-500 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-orange-400',
                  ]"
                  :disabled="isLoading"
                >
                  {{ opt }}
                </button>
              </div>
              <p v-if="city" class="mt-2 text-xs text-gray-500">Ville sélectionnée : {{ city }}</p>
            </div>
          </div>

          <div v-if="role === 'host'" class="space-y-4 p-4 border border-orange-100 rounded-lg bg-orange-50">
            <div>
              <p class="text-sm font-semibold text-gray-700 mb-2">2. Informations spécifiques Hôte</p>
              <div class="grid gap-4">
                <div>
                  <label for="cin" class="block text-sm text-gray-600 mb-1">CIN / Carte d’identité <span class="text-gray-400">(optionnel)</span></label>
                  <input
                    id="cin"
                    v-model="cin"
                    type="text"
                    placeholder="CIN ou carte d'identité"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    :disabled="isLoading"
                  />
                </div>

                <div>
                  <label for="address" class="block text-sm text-gray-600 mb-1">Adresse</label>
                  <input
                    id="address"
                    v-model="address"
                    type="text"
                    placeholder="Adresse complète"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    :disabled="isLoading"
                  />
                </div>

                <div>
                  <label for="description" class="block text-sm text-gray-600 mb-1">Description (bio)</label>
                  <textarea
                    id="description"
                    v-model="description"
                    rows="3"
                    placeholder="Je suis un hôte sérieux..."
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    :disabled="isLoading"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              :disabled="isLoading"
            />
            <p class="text-xs text-gray-500 mt-1">Au moins 6 caractères</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              :disabled="isLoading"
              @keydown="handleKeydown"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-4 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {{ isLoading ? 'Inscription en cours...' : "S'inscrire" }}
          </button>
        </form>

        <!-- Terms -->
        <p class="text-xs text-gray-500 text-center mt-4">
          En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de
          confidentialité.
        </p>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Vous avez déjà un compte ?
            <router-link to="/login" class="text-orange-500 font-semibold hover:text-orange-600">
              Se connecter
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

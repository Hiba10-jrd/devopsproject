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
const errorMessage = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  errorMessage.value = ''

  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Veuillez remplir tous les champs'
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
    const success = authStore.register(name.value, email.value, password.value)
    if (success) {
      router.push('/')
    } else {
      errorMessage.value = 'Cet email est déjà utilisé'
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
    class="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <img src="/images/logo.png" alt="MAISSON Logo" class="h-21 w-20 object-contain">

        </div>

        <h2 class="text-2xl font-bold text-center text-gray-900 mb-6">S'inscrire</h2>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="Jean Dupont"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              :disabled="isLoading"
            />
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
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              :disabled="isLoading"
              @keydown="handleKeydown"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-4 py-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
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
            <router-link to="/login" class="text-pink-500 font-semibold hover:text-pink-600">
              Se connecter
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

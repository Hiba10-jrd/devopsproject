<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }

  isLoading.value = true

  try {
    const success = await authStore.loginApi(email.value, password.value)
    if (success) {
      if (authStore.isAdmin) {
        router.push('/admin')
      } else if (authStore.isHost) {
        router.push('/host')
      } else {
        router.push('/')
      }
    } else {
      errorMessage.value = 'Email ou mot de passe incorrect'
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
    handleLogin()
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

        <h2 class="text-2xl font-bold text-center text-gray-900 mb-6">Se connecter</h2>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p class="text-orange-700 text-sm">{{ errorMessage }}</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
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
              @keydown="handleKeydown"
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
            {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </form>

        <!-- Demo Credentials -->
       
        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Pas encore inscrit ?
            <router-link to="/register" class="text-orange-500 font-semibold hover:text-orange-600">
              S'inscrire
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

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
    const success = authStore.login(email.value, password.value)
    if (success) {
      router.push('/')
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
  <div class="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg">
            <span class="text-white font-bold text-2xl">✕</span>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-center text-gray-900 mb-6">Se connecter</h2>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
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
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
            {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-600 text-center mb-4">Utilisateurs de test :</p>
          <div class="space-y-2 text-xs bg-gray-50 p-3 rounded">
            <p class="text-gray-700">
              <strong>Admin:</strong>
              <br />
              Email: admin@test.com
              <br />
              Mot de passe: admin
            </p>
            <p class="text-gray-700 mt-3">
              <strong>Utilisateur:</strong>
              <br />
              Email: jean@test.com
              <br />
              Mot de passe: password123
            </p>
          </div>
        </div>

        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Pas encore inscrit ?
            <router-link to="/register" class="text-pink-500 font-semibold hover:text-pink-600">
              S'inscrire
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

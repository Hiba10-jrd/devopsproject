<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isMenuOpen = ref(false)
const searchCity = ref('')

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const handleSearch = () => {
  if (searchCity.value) {
    router.push({ name: 'Search', query: { city: searchCity.value } })
    searchCity.value = ''
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 group">
           <img src="/images/logo.png" alt="MAISSON Logo" class="h-40 w-20 object-contain">
          <span class="text-xl font-bold text-gray-900 hidden sm:inline"></span>
        </router-link>

        <!-- Search Bar (Desktop) -->
        <div class="hidden md:flex flex-1 mx-8 max-w-md">
          <div
            class="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:shadow-md transition"
          >
            <input
              v-model="searchCity"
              @keydown="handleKeydown"
              type="text"
              placeholder="Où allez-vous ?"
              class="flex-1 outline-none bg-transparent text-sm"
            />
            <button @click="handleSearch" class="text-pink-500 hover:text-pink-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-4">
          <router-link to="/" class="text-gray-700 hover:text-gray-900 transition font-medium">
            Accueil
          </router-link>
          <router-link
            to="/search"
            class="text-gray-700 hover:text-gray-900 transition font-medium"
          >
            Chercher
          </router-link>

          <div v-if="authStore.isLoggedIn" class="flex items-center gap-4">
            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              class="text-gray-700 hover:text-gray-900 transition font-medium"
            >
              Admin
            </router-link>
            <button
              @click="handleLogout"
              class="text-gray-700 hover:text-gray-900 transition font-medium"
            >
              Déconnexion
            </button>
            <div class="text-sm text-gray-600">
              {{ authStore.currentUser?.name }}
            </div>
          </div>
          <div v-else class="flex items-center gap-3">
            <router-link
              to="/login"
              class="text-gray-700 hover:text-gray-900 transition font-medium"
            >
              Se connecter
            </router-link>
            <router-link
              to="/register"
              class="px-4 py-2 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition"
            >
              S'inscrire
            </router-link>
          </div>
        </nav>

        <!-- Mobile Menu Button -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="md:hidden pb-4 border-t border-gray-200">
        <div class="py-3 space-y-2">
          <input
            v-model="searchCity"
            @keydown="handleKeydown"
            type="text"
            placeholder="Où allez-vous ?"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            @click="handleSearch"
            class="w-full px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition"
          >
            Rechercher
          </button>
        </div>
        <nav class="space-y-2">
          <router-link to="/" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >Accueil</router-link
          >
          <router-link to="/search" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >Chercher</router-link
          >
          <div v-if="authStore.isLoggedIn">
            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >Admin</router-link
            >
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Déconnexion
            </button>
            <div class="px-4 py-2 text-sm text-gray-600">
              {{ authStore.currentUser?.name }}
            </div>
          </div>
          <div v-else class="space-y-2">
            <router-link to="/login" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >Se connecter</router-link
            >
            <router-link
              to="/register"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >S'inscrire</router-link
            >
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

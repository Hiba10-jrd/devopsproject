<!-- filepath: src/App.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useListingsStore } from '@/stores/listings'
import Header from '@/components/Header.vue'
import PageLoader from '@/components/PageLoader.vue'

const router = useRouter()
const authStore = useAuthStore()
const listingsStore = useListingsStore()
const loaderRef = ref<InstanceType<typeof PageLoader> | null>(null)

onMounted(async () => {
  await authStore.loadUsersFromDb()
  await listingsStore.loadListings()
})

// Ajouter le loading sur chaque navigation
router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    loaderRef.value?.startLoading()
  }
  next()
})

router.afterEach(() => {
  loaderRef.value?.stopLoading()
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <PageLoader ref="loaderRef" />
    <Header />
    <main class="pt-16">
      <router-view />
    </main>
    <footer class="bg-gray-900 text-white py-12 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="font-semibold text-lg mb-4">MAISSON</h3>
            <p class="text-gray-400 text-sm">La plateforme leader pour voyager et vivre partout.</p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Accueil</h4>
            <ul class="text-gray-400 text-sm space-y-2">
              <li><a href="#" class="hover:text-white transition">À propos</a></li>
              <li><a href="#" class="hover:text-white transition">Blog</a></li>
              <li><a href="#" class="hover:text-white transition">Emplois</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Support</h4>
            <ul class="text-gray-400 text-sm space-y-2">
              <li><a href="#" class="hover:text-white transition">Centre d'aide</a></li>
              <li><a href="#" class="hover:text-white transition">Sécurité</a></li>
              <li><a href="#" class="hover:text-white transition">Options de paiement</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Communauté</h4>
            <ul class="text-gray-400 text-sm space-y-2">
              <li><a href="#" class="hover:text-white transition">Nouvelles</a></li>
              <li><a href="#" class="hover:text-white transition">Forum</a></li>
              <li><a href="#" class="hover:text-white transition">Événements</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 text-gray-400 text-sm text-center">
          <p>&copy; 2024 MAISSON. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useListingsStore } from '@/stores/listings'
import Header from '@/components/Header.vue'

const authStore = useAuthStore()
const listingsStore = useListingsStore()

onMounted(async () => {
  try {
    await authStore.loadUsersFromDb()
    await listingsStore.loadListings()
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error)
  }
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <Header />

    <main class="pt-16">
      <router-view />
    </main>

    <footer class="bg-gray-900 text-white py-12 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          <div>
            <h3 class="font-semibold text-lg mb-4">MAISON</h3>
            <p class="text-gray-400 text-sm">
              Votre plateforme incontournable pour la location de maisons et séjours partout.
            </p>
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
          <p>&copy; 2025 MAISON.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

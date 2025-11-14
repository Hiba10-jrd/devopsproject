import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  email: string
  password: string
  isAdmin: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const users = ref<User[]>([])

  const isLoggedIn = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.isAdmin ?? false)

  const loadUsersFromDb = async () => {
    try {
      const response = await fetch('/db.json')
      const data = await response.json()
      users.value = data.users
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        currentUser.value = JSON.parse(savedUser)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const login = (email: string, password: string): boolean => {
    const user = users.value.find(u => u.email === email && u.password === password)
    if (user) {
      currentUser.value = user
      localStorage.setItem('currentUser', JSON.stringify(user))
      return true
    }
    return false
  }

  const register = (name: string, email: string, password: string): boolean => {
    const userExists = users.value.some(u => u.email === email)
    if (userExists) {
      return false
    }

    const newUser: User = {
      id: Math.max(...users.value.map(u => u.id), 0) + 1,
      name,
      email,
      password,
      isAdmin: false,
    }

    users.value.push(newUser)
    currentUser.value = newUser
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  return {
    currentUser,
    users,
    isLoggedIn,
    isAdmin,
    loadUsersFromDb,
    login,
    register,
    logout,
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  email: string
  password?: string
  role: 'client' | 'host'
  phone?: string
  cin?: string
  city?: string
  address?: string
  description?: string
  isAdmin: boolean
}

export interface HostInfo {
  phone?: string
  cin?: string
  city?: string
  address?: string
  description?: string
}

export const useAuthStore = defineStore('auth', () => {
  const savedUser = localStorage.getItem('currentUser')
  const currentUser = ref<User | null>(savedUser ? JSON.parse(savedUser) : null)
  const users = ref<User[]>([])

  const isLoggedIn = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.isAdmin ?? false)
  const isHost = computed(() => currentUser.value?.role === 'host')

  const loadUsersFromDb = async () => {
    try {
      const response = await fetch('/db.json')
      const data = await response.json()
      users.value = data.users
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const login = (email: string, password: string): boolean => {
    const user = users.value.find((u) => u.email === email && u.password === password)
    if (user) {
      currentUser.value = user
      localStorage.setItem('currentUser', JSON.stringify(user))
      return true
    }
    return false
  }

  const register = (
    name: string,
    email: string,
    password: string,
    role: 'client' | 'host',
    hostInfo?: HostInfo,
  ): boolean => {
    const userExists = users.value.some((u) => u.email === email)
    if (userExists) {
      return false
    }

    const newUser: User = {
      id: Math.max(...users.value.map((u) => u.id), 0) + 1,
      name,
      email,
      password,
      role,
      phone: hostInfo?.phone,
      cin: hostInfo?.cin,
      city: hostInfo?.city,
      address: hostInfo?.address,
      description: hostInfo?.description,
      isAdmin: false,
    }

    users.value.push(newUser)
    return true
  }

  const loginApi = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) {
        return false
      }
      const user = await response.json()
      currentUser.value = user
      localStorage.setItem('currentUser', JSON.stringify(user))
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const registerApi = async (
    name: string,
    email: string,
    password: string,
    role: 'client' | 'host',
    hostInfo?: HostInfo,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone: hostInfo?.phone,
          cin: hostInfo?.cin,
          city: hostInfo?.city,
          address: hostInfo?.address,
          description: hostInfo?.description,
        }),
      })
      if (!response.ok) {
        let body: { message?: string } | null = null
        try {
          body = await response.json()
        } catch {
          body = null
        }
        return { success: false, message: body?.message || 'Erreur d inscription' }
      }
      return {
        success: true,
        message: 'Compte cree avec succes. Connectez-vous pour continuer.',
      }
    } catch (error) {
      console.error(error)
      return { success: false, message: 'Erreur reseau' }
    }
  }

  const updateProfile = (profile: Partial<User>) => {
    if (!currentUser.value) {
      return false
    }
    currentUser.value = {
      ...currentUser.value,
      ...profile,
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
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
    isHost,
    loadUsersFromDb,
    login,
    loginApi,
    register,
    registerApi,
    updateProfile,
    logout,
  }
})


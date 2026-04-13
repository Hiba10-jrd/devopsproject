import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Listing {
  id: number
  title: string
  city: string
  price: number
  image: string
  images?: string[]
  amenities?: string[]
  beds: number
  baths: number
  kitchens?: number
  salons?: number
  description: string
  rating: number
  ownerId?: number
  ownerName?: string
  ownerPhone?: string
  address?: string
}

export interface Booking {
  id: number
  listingId: number
  userId: number
  checkInDate: string
  checkOutDate: string
  totalPrice: number
  createdAt: string
  guestPhone?: string
  guestNotes?: string
  paymentMethod?: string
  ownerName?: string
  ownerPhone?: string
  listingTitle?: string
  status?: string
}

export interface Review {
  id: number
  listingId: number
  userId: number
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export const useListingsStore = defineStore('listings', () => {
  const listings = ref<Listing[]>([])
  const bookings = ref<Booking[]>([])
  const reviews = ref<Review[]>([])

  const loadReviews = () => {
    const saved = localStorage.getItem('maison-reviews')
    reviews.value = saved ? JSON.parse(saved) : []
  }

  const persistReviews = () => {
    localStorage.setItem('maison-reviews', JSON.stringify(reviews.value))
  }

  const loadListings = async () => {
    try {
      const response = await fetch('/db.json')
      const data = await response.json()
      listings.value = data.listings
      bookings.value = data.bookings
      loadReviews()
    } catch (error) {
      console.error('Failed to load listings:', error)
    }
  }

  const getListingById = (id: number) => {
    return listings.value.find((l) => l.id === id)
  }

  const getHostListings = (ownerId: number, ownerName?: string) => {
    if (ownerId) {
      return listings.value.filter((listing) => listing.ownerId === ownerId)
    }
    if (ownerName) {
      return listings.value.filter((listing) => listing.ownerName === ownerName)
    }
    return []
  }

  const searchListings = (city: string = '', minPrice: number = 0, maxPrice: number = Infinity) => {
    return listings.value.filter((listing) => {
      const cityMatch = city === '' || listing.city.toLowerCase().includes(city.toLowerCase())
      const priceMatch = listing.price >= minPrice && listing.price <= maxPrice
      return cityMatch && priceMatch
    })
  }

  const addListing = (listing: Omit<Listing, 'id'>) => {
    const newListing: Listing = {
      ...listing,
      id: Math.max(...listings.value.map((l) => l.id), 0) + 1,
    }
    listings.value.push(newListing)
    return newListing
  }

  const updateListing = (id: number, updates: Partial<Listing>) => {
    const index = listings.value.findIndex((l) => l.id === id)
    if (index !== -1) {
      listings.value[index] = { ...listings.value[index], ...updates }
    }
  }

  const deleteListing = (id: number) => {
    const index = listings.value.findIndex((l) => l.id === id)
    if (index !== -1) {
      listings.value.splice(index, 1)
    }
  }

  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Math.max(...bookings.value.map((b) => b.id), 0) + 1,
      createdAt: new Date().toISOString(),
      status: booking.status ?? 'pending',
    }
    bookings.value.push(newBooking)
    return newBooking
  }

  const updateBookingStatus = (id: number, status: string) => {
    const index = bookings.value.findIndex((b) => b.id === id)
    if (index !== -1) {
      bookings.value[index].status = status
    }
  }

  const getBookingsByUser = (userId: number) => {
    return bookings.value.filter((b) => b.userId === userId)
  }

  const getReviewsByUser = (userId: number) => {
    return reviews.value.filter((review) => review.userId === userId)
  }

  const getReviewsByListing = (listingId: number) => {
    return reviews.value.filter((review) => review.listingId === listingId)
  }

  const addReview = (review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: Math.max(...reviews.value.map((r) => r.id), 0) + 1,
      createdAt: new Date().toISOString(),
    }
    reviews.value.push(newReview)
    persistReviews()
    return newReview
  }

  const getAllBookings = () => {
    return bookings.value
  }

  const getCities = () => {
    return [...new Set(listings.value.map((l) => l.city))].sort()
  }

  return {
    listings,
    bookings,
    reviews,
    loadListings,
    getListingById,
    getHostListings,
    searchListings,
    addListing,
    updateListing,
    deleteListing,
    addBooking,
    updateBookingStatus,
    getBookingsByUser,
    getAllBookings,
    getReviewsByUser,
    getReviewsByListing,
    addReview,
    getCities,
  }
})

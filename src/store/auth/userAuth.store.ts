// src/store/auth/userAuth.store.ts
import { create } from "zustand"
import type { User } from "./auth.types"
import { userServices } from "@/api/services/user.service"
import { authUserService } from "@/api/services/auth.service"

type AuthState = {
     loading: boolean
     error: string | null
     user: User | null
     isAuthenticated: boolean
     isLoggedIn: boolean

     fetchUser: () => Promise<User | null>
     checkAuth: () => Promise<boolean>
     resendRefreshToken: () => Promise<boolean>
     logout: () => Promise<void>
     initAuth: () => Promise<boolean>
     updateProfile: (payload: Partial<User>) => Promise<User | null>
}

export const useAuthUserStore = create<AuthState>((set, get) => ({
     loading: false,
     error: null,
     user: null,
     isAuthenticated: false,
     isLoggedIn: false,

     fetchUser: async (): Promise<User | null> => {
          set({ loading: true, error: null })
          try {
               const res = await userServices.getUserMe()
               const userData = res.data

               set({
                    user: userData,
                    isAuthenticated: true,
                    isLoggedIn: true,
                    loading: false,
               })
               return userData
          } catch (err: unknown) {
               const message = err instanceof Error ? err.message : "Failed to fetch user"
               set({
                    user: null,
                    isAuthenticated: false,
                    isLoggedIn: false,
                    loading: false,
                    error: message,
               })
               return null
          }
     },

     resendRefreshToken: async (): Promise<boolean> => {
          try {
               const res = await authUserService.refreshAccessToken()
               return res.status === 200
          } catch {
               return false
          }
     },

     checkAuth: async (): Promise<boolean> => {
          const currentUser = await get().fetchUser()
          if (currentUser) return true

          const refreshed = await get().resendRefreshToken()
          if (!refreshed) return false

          const refreshedUser = await get().fetchUser()
          return Boolean(refreshedUser)
     },

     logout: async (): Promise<void> => {
          set({ loading: true, error: null })
          try {
               await authUserService.logOut()
               set({
                    user: null,
                    isAuthenticated: false,
                    isLoggedIn: false,
                    loading: false,
               })
          } catch (err: unknown) {
               const message = err instanceof Error ? err.message : "Logout failed"
               set({
                    user: null,
                    isAuthenticated: false,
                    isLoggedIn: false,
                    loading: false,
                    error: message,
               })

               
          }
     },

     initAuth: async () => {
          return get().checkAuth()
     },

     updateProfile: async (payload) => {
          set({ loading: true, error: null })
          try {
               const res = await userServices.updateUserMe(payload)
               set({
                    user: res.data,
                    loading: false,
               })
               return res.data
          } catch (err: unknown) {
               const message = err instanceof Error ? err.message : "Profile update failed"
               set({
                    loading: false,
                    error: message,
               })
               return null
          }
     },
}))

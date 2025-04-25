import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: {
    id: number
    name: string
    email: string
    avatar?: string
  } | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  
  login: async (email: string, password: string) => {
    // Simulação de login - em uma implementação real, isso seria uma chamada à API
    if (email === 'admin@example.com' && password === 'senha123') {
      set({
        isAuthenticated: true,
        user: {
          id: 1,
          name: 'Administrador',
          email: 'admin@example.com'
        }
      })
      return true
    } else if (email === 'usuario@example.com' && password === 'senha123') {
      set({
        isAuthenticated: true,
        user: {
          id: 2,
          name: 'Usuário Teste',
          email: 'usuario@example.com'
        }
      })
      return true
    }
    return false
  },
  
  register: async (name: string, email: string, password: string) => {
    // Simulação de registro - em uma implementação real, isso seria uma chamada à API
    set({
      isAuthenticated: true,
      user: {
        id: Date.now(),
        name,
        email
      }
    })
    return true
  },
  
  logout: () => {
    set({
      isAuthenticated: false,
      user: null
    })
  }
}))

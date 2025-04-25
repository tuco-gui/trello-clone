'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth/store'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Rotas que não precisam de autenticação
    const publicRoutes = ['/', '/login', '/register', '/forgot-password']
    
    // Verificar se a rota atual precisa de autenticação
    const isPublicRoute = publicRoutes.includes(pathname)
    
    // Redirecionar para login se não estiver autenticado e a rota não for pública
    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login')
    }
    
    // Redirecionar para boards se estiver autenticado e a rota for pública
    if (isAuthenticated && isPublicRoute && pathname !== '/') {
      router.push('/boards')
    }
  }, [isAuthenticated, pathname, router])

  return children
}

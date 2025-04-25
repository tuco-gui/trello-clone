'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl font-bold text-slate-800 sm:text-5xl">
          Bem-vindo ao <span className="text-blue-600">Trello Clone</span>
        </h1>
        <p className="text-xl text-slate-600">
          Organize seus projetos e tarefas de forma simples e eficiente
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-600">Quadros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Crie quadros para organizar seus projetos e visualizar o progresso.</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-600">Listas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Organize suas tarefas em listas para acompanhar o fluxo de trabalho.</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-600">Cartões</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Adicione detalhes, etiquetas, datas e comentários aos seus cartões.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

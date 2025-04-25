'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useBoardStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Plus, X } from 'lucide-react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import BoardCard from './board-card'

interface BoardListProps {
  id: number
  title: string
  position: number
  boardId: number
}

export default function BoardList({ id, title, position, boardId }: BoardListProps) {
  const { cards, createCard, fetchCards } = useBoardStore()
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [listTitle, setListTitle] = useState(title)
  
  // Configuração para arrastar e soltar
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: id.toString(),
    data: {
      type: 'list',
      list: { id, title, position, boardId }
    }
  })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }
  
  // Filtrar cartões desta lista
  const listCards = cards
    .filter(card => card.listId === id)
    .sort((a, b) => a.position - b.position)
  
  // Adicionar novo cartão
  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return
    
    await createCard(id, newCardTitle)
    setNewCardTitle('')
    setIsAddingCard(false)
  }
  
  // Abrir modal de cartão
  const handleCardClick = (cardId: number) => {
    // Em uma implementação real, isso redirecionaria para a rota do cartão
    // ou abriria um modal com os detalhes do cartão
    console.log(`Abrir cartão ${cardId}`)
  }
  
  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="bg-slate-100 rounded-md h-full flex flex-col w-72 flex-shrink-0 mr-3 list-container"
    >
      <div 
        className="p-2 font-medium flex items-center justify-between"
        {...attributes}
        {...listeners}
      >
        {isEditingTitle ? (
          <Input
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            autoFocus
            className="h-7 text-sm"
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditingTitle(false)
                // Aqui seria chamada a função para atualizar o título da lista
              }
            }}
          />
        ) : (
          <h3 className="cursor-pointer" onClick={() => setIsEditingTitle(true)}>{listTitle}</h3>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <SortableContext 
          items={listCards.map(card => card.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {listCards.map((card) => (
            <BoardCard
              key={card.id}
              id={card.id}
              title={card.title}
              description={card.description}
              dueDate={card.dueDate}
              isCompleted={card.isCompleted}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </SortableContext>
        
        {isAddingCard ? (
          <div className="mt-2">
            <Input
              placeholder="Digite o título do cartão..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className="mb-2"
              autoFocus
            />
            <div className="flex items-center">
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 mr-2"
                onClick={handleAddCard}
              >
                Adicionar
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setIsAddingCard(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            onClick={() => setIsAddingCard(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar um cartão
          </Button>
        )}
      </div>
    </div>
  )
}

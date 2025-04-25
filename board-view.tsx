'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useBoardStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'
import BoardList from '@/components/ui/board/board-list'
import CardModal from '@/components/ui/board/card-modal'

interface BoardViewProps {
  id: number
}

export default function BoardView({ id }: BoardViewProps) {
  const router = useRouter()
  const { 
    boards, 
    lists, 
    fetchLists, 
    createList, 
    moveList, 
    cards, 
    fetchCards, 
    moveCard 
  } = useBoardStore()
  
  const [board, setBoard] = useState<any>(null)
  const [boardLists, setBoardLists] = useState<any[]>([])
  const [isAddingList, setIsAddingList] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')
  
  // Configurar sensores para DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  // Carregar dados do quadro
  useEffect(() => {
    const currentBoard = boards.find(b => b.id === id)
    if (currentBoard) {
      setBoard(currentBoard)
    }
    
    // Carregar listas do quadro
    fetchLists(id)
  }, [id, boards, fetchLists])
  
  // Atualizar listas quando o estado global mudar
  useEffect(() => {
    const filteredLists = lists
      .filter(list => list.boardId === id)
      .sort((a, b) => a.position - b.position)
    
    setBoardLists(filteredLists)
    
    // Carregar cartões para cada lista
    filteredLists.forEach(list => {
      fetchCards(list.id)
    })
  }, [id, lists, fetchCards])
  
  // Adicionar nova lista
  const handleAddList = async () => {
    if (!newListTitle.trim()) return
    
    await createList(id, newListTitle)
    setNewListTitle('')
    setIsAddingList(false)
  }
  
  // Manipular eventos de arrastar e soltar
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return
    
    if (active.id !== over.id) {
      // Implementar lógica para mover listas ou cartões
      // Baseado no tipo de item sendo arrastado
      
      // Exemplo para listas:
      const oldIndex = boardLists.findIndex(list => list.id.toString() === active.id.toString())
      const newIndex = boardLists.findIndex(list => list.id.toString() === over.id.toString())
      
      if (oldIndex !== -1 && newIndex !== -1) {
        moveList(parseInt(active.id.toString()), newIndex)
      }
      
      // A lógica para mover cartões seria implementada nos componentes de lista
    }
  }
  
  if (!board) return <div>Carregando...</div>
  
  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col">
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-bold text-slate-800">{board.title}</h1>
      </div>
      
      <div className="flex-1 overflow-x-auto p-4">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={boardLists.map(list => list.id.toString())}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex h-full">
              {boardLists.map((list) => (
                <BoardList
                  key={list.id}
                  id={list.id}
                  title={list.title}
                  position={list.position}
                  boardId={id}
                />
              ))}
              
              {isAddingList ? (
                <div className="w-72 flex-shrink-0 bg-slate-100 rounded-md p-2">
                  <Input
                    placeholder="Digite o título da lista..."
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    className="mb-2"
                    autoFocus
                  />
                  <div className="flex items-center">
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 mr-2"
                      onClick={handleAddList}
                    >
                      Adicionar lista
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setIsAddingList(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-72 flex-shrink-0">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-white/80 hover:bg-white"
                    onClick={() => setIsAddingList(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar outra lista
                  </Button>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      
      {/* Modal de cartão será renderizado quando uma rota de cartão for acessada */}
      <CardModal />
    </div>
  )
}

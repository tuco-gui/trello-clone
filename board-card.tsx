'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useBoardStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckSquare, MessageSquare, Paperclip } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface BoardCardProps {
  id: number
  title: string
  description?: string
  dueDate?: string
  isCompleted: boolean
  onClick: () => void
}

export default function BoardCard({ id, title, description, dueDate, isCompleted, onClick }: BoardCardProps) {
  const { labels, cardLabels, comments } = useBoardStore()
  
  // Configuração para arrastar e soltar
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id.toString(),
    data: {
      type: 'card',
      card: { id, title, description, dueDate, isCompleted }
    }
  })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }
  
  // Obter etiquetas do cartão
  const cardLabelsIds = cardLabels
    .filter(cl => cl.cardId === id)
    .map(cl => cl.labelId)
  
  const cardLabelsList = labels.filter(label => cardLabelsIds.includes(label.id))
  
  // Contar comentários
  const commentCount = comments.filter(comment => comment.cardId === id).length
  
  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`mb-2 p-3 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer card-item ${isDragging ? 'dragging' : ''}`}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      {cardLabelsList.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {cardLabelsList.map(label => (
            <div 
              key={label.id}
              className="w-10 h-2 rounded label-pill"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      )}
      
      <p className="font-medium mb-2">{title}</p>
      
      {description && description.length > 0 && (
        <p className="text-sm text-slate-600 mb-2 line-clamp-2">{description}</p>
      )}
      
      {(dueDate || commentCount > 0) && (
        <div className="flex items-center text-xs text-slate-600 mt-2 gap-3">
          {dueDate && (
            <div className={`flex items-center ${isCompleted ? 'text-green-600' : ''}`}>
              <Clock className="h-3 w-3 mr-1" />
              {format(new Date(dueDate), "dd MMM", { locale: ptBR })}
              {isCompleted && <CheckSquare className="h-3 w-3 ml-1" />}
            </div>
          )}
          
          {commentCount > 0 && (
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              {commentCount}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useBoardStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, X, Tag, MessageSquare, Paperclip, Clock, CheckSquare, Plus } from 'lucide-react'

export default function CardModal() {
  const params = useParams()
  const cardId = params?.cardId ? parseInt(params.cardId as string) : null
  
  const { cards, updateCard, labels, cardLabels, addLabelToCard, removeLabelFromCard, comments, fetchComments, createComment } = useBoardStore()
  
  const [open, setOpen] = useState(!!cardId)
  const [card, setCard] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showLabels, setShowLabels] = useState(false)
  const [newComment, setNewComment] = useState('')
  
  // Carregar dados do cartão
  useEffect(() => {
    if (cardId) {
      const currentCard = cards.find(c => c.id === cardId)
      if (currentCard) {
        setCard(currentCard)
        setTitle(currentCard.title)
        setDescription(currentCard.description || '')
        setDueDate(currentCard.dueDate ? new Date(currentCard.dueDate) : undefined)
        setIsCompleted(currentCard.isCompleted)
        
        // Carregar comentários
        fetchComments(cardId)
      }
    }
  }, [cardId, cards, fetchComments])
  
  // Salvar alterações no cartão
  const handleSave = async () => {
    if (cardId) {
      await updateCard(cardId, {
        title,
        description,
        dueDate: dueDate?.toISOString(),
        isCompleted
      })
    }
    setOpen(false)
  }
  
  // Adicionar ou remover etiqueta
  const toggleLabel = (labelId: number) => {
    if (cardId) {
      const hasLabel = cardLabels.some(cl => cl.cardId === cardId && cl.labelId === labelId)
      
      if (hasLabel) {
        removeLabelFromCard(cardId, labelId)
      } else {
        addLabelToCard(cardId, labelId)
      }
    }
  }
  
  // Adicionar comentário
  const handleAddComment = () => {
    if (cardId && newComment.trim()) {
      createComment(cardId, 1, newComment) // Usando userId 1 para simulação
      setNewComment('')
    }
  }
  
  if (!card) return null
  
  const cardLabelsIds = cardLabels
    .filter(cl => cl.cardId === cardId)
    .map(cl => cl.labelId)
  
  const cardLabelsList = labels.filter(label => cardLabelsIds.includes(label.id))
  
  const cardComments = comments.filter(comment => comment.cardId === cardId)
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold mb-2"
            />
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="mb-6">
              <Label className="mb-2 block">Descrição</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicione uma descrição mais detalhada..."
                className="min-h-32"
              />
            </div>
            
            {cardLabelsList.length > 0 && (
              <div className="mb-6">
                <Label className="mb-2 block">Etiquetas</Label>
                <div className="flex flex-wrap gap-2">
                  {cardLabelsList.map(label => (
                    <div 
                      key={label.id}
                      className="px-3 py-1 rounded text-white text-sm flex items-center"
                      style={{ backgroundColor: label.color }}
                    >
                      {label.name}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 ml-1 text-white hover:bg-white/20"
                        onClick={() => toggleLabel(label.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {dueDate && (
              <div className="mb-6">
                <Label className="mb-2 block">Data de vencimento</Label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    className={`flex items-center ${isCompleted ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
                    onClick={() => setIsCompleted(!isCompleted)}
                  >
                    <CheckSquare className={`h-4 w-4 mr-2 ${isCompleted ? 'text-green-600' : ''}`} />
                    {format(dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2"
                    onClick={() => setDueDate(undefined)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <Label className="mb-2 block">Comentários</Label>
              <div className="flex mb-4">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escreva um comentário..."
                  className="mr-2"
                />
                <Button onClick={handleAddComment}>Adicionar</Button>
              </div>
              
              {cardComments.map(comment => (
                <Card key={comment.id} className="mb-3">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm font-medium">Usuário {comment.userId}</CardTitle>
                    <div className="text-xs text-slate-500">
                      {new Date(comment.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    {comment.content}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Adicionar ao cartão</h3>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowLabels(!showLabels)}
              >
                <Tag className="h-4 w-4 mr-2" />
                Etiquetas
              </Button>
              
              {showLabels && (
                <Card className="p-2">
                  <div className="space-y-2">
                    {labels.map(label => (
                      <div 
                        key={label.id}
                        className="flex items-center p-2 rounded cursor-pointer hover:bg-slate-100"
                        onClick={() => toggleLabel(label.id)}
                      >
                        <div 
                          className="w-8 h-2 rounded mr-2"
                          style={{ backgroundColor: label.color }}
                        />
                        <span className="text-sm">{label.name}</span>
                        {cardLabelsIds.includes(label.id) && (
                          <CheckSquare className="h-4 w-4 ml-auto text-blue-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Data de vencimento
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => {
                      setDueDate(date)
                      setShowDatePicker(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Anexo
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

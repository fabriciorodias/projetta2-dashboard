import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useFilters, useSetFilters, useResetFilters } from '@/hooks/useStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
}

const FilterPanel = ({ isOpen, onClose }: FilterPanelProps) => {
  const filters = useFilters()
  const setFilters = useSetFilters()
  const resetFilters = useResetFilters()
  
  const [localFilters, setLocalFilters] = useState(filters)

  const handleApply = () => {
    setFilters(localFilters)
    onClose()
  }

  const handleReset = () => {
    resetFilters()
    setLocalFilters({
      agencies: [],
      portfolios: [],
      statuses: [],
      managers: [],
      dateRange: { start: null, end: null },
      valueRange: { min: null, max: null },
      daysRange: { min: null, max: null },
      searchTerm: '',
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-96 bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700"
          >
            <Card className="h-full rounded-none border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold">Filtros Avançados</CardTitle>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <XMarkIcon className="w-5 h-5" />
                </Button>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto space-y-6">
                {/* Search */}
                <Input
                  label="Busca"
                  placeholder="Digite um termo de busca..."
                  value={localFilters.searchTerm}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                />

                {/* Value Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Valor da Proposta
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Mínimo"
                      value={localFilters.valueRange.min || ''}
                      onChange={(e) => setLocalFilters(prev => ({
                        ...prev,
                        valueRange: { ...prev.valueRange, min: Number(e.target.value) || null }
                      }))}
                    />
                    <Input
                      type="number"
                      placeholder="Máximo"
                      value={localFilters.valueRange.max || ''}
                      onChange={(e) => setLocalFilters(prev => ({
                        ...prev,
                        valueRange: { ...prev.valueRange, max: Number(e.target.value) || null }
                      }))}
                    />
                  </div>
                </div>

                {/* Days Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dias de Processamento
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Mínimo"
                      value={localFilters.daysRange.min || ''}
                      onChange={(e) => setLocalFilters(prev => ({
                        ...prev,
                        daysRange: { ...prev.daysRange, min: Number(e.target.value) || null }
                      }))}
                    />
                    <Input
                      type="number"
                      placeholder="Máximo"
                      value={localFilters.daysRange.max || ''}
                      onChange={(e) => setLocalFilters(prev => ({
                        ...prev,
                        daysRange: { ...prev.daysRange, max: Number(e.target.value) || null }
                      }))}
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Período de Criação
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={localFilters.dateRange.start ? localFilters.dateRange.start.toISOString().split('T')[0] : ''}
                      onChange={(e) => setLocalFilters(prev => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          start: e.target.value ? new Date(e.target.value) : null
                        }
                      }))}
                    />
                    <Input
                      type="date"
                      value={localFilters.dateRange.end ? localFilters.dateRange.end.toISOString().split('T')[0] : ''}
                      onChange={(e) => setLocalFilters(prev => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          end: e.target.value ? new Date(e.target.value) : null
                        }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    onClick={handleReset}
                    className="flex-1"
                  >
                    Limpar Filtros
                  </Button>
                  <Button onClick={handleApply} className="flex-1">
                    Aplicar
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FilterPanel
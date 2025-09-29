import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProposals } from '@/hooks/useStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  MagnifyingGlassIcon, 
  CalendarIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  XMarkIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose }) => {
  const proposals = useProposals()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    agencies: [],
    portfolios: [],
    managers: [],
    statuses: [],
    valueRange: { min: '', max: '' },
    daysRange: { min: '', max: '' },
    dateRange: { start: '', end: '' },
  })

  // Get unique values for dropdowns
  const uniqueValues = {
    agencies: [...new Set(proposals.map(p => p.nomeAgencia))],
    portfolios: [...new Set(proposals.map(p => p.carteiraNegocio).filter(Boolean))],
    managers: [...new Set(proposals.map(p => p.gerenteResponsavel).filter(Boolean))],
    statuses: [...new Set(proposals.map(p => p.statusPrioridade).filter(Boolean))],
  }

  const handleMultiSelect = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value]
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      agencies: [],
      portfolios: [],
      managers: [],
      statuses: [],
      valueRange: { min: '', max: '' },
      daysRange: { min: '', max: '' },
      dateRange: { start: '', end: '' },
    })
    setSearchTerm('')
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).flat().filter(Boolean).length + (searchTerm ? 1 : 0)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Filtros
                  </h3>
                  {getActiveFiltersCount() > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <XMarkIcon className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Search */}
                <Card variant="outline">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Busca Global</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="Buscar propostas, clientes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                    />
                  </CardContent>
                </Card>

                {/* Agencies */}
                <Card variant="outline">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">🔥 Agências</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uniqueValues.agencies.map(agency => (
                        <label key={agency} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.agencies.includes(agency)}
                            onChange={() => handleMultiSelect('agencies', agency)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {agency}
                          </span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Portfolios */}
                <Card variant="outline">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">💼 Carteiras</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uniqueValues.portfolios.map(portfolio => (
                        <label key={portfolio} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.portfolios.includes(portfolio)}
                            onChange={() => handleMultiSelect('portfolios', portfolio)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {portfolio}
                          </span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Managers */}
                <Card variant="outline">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">👥 Gerentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uniqueValues.managers.map(manager => (
                        <label key={manager} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.managers.includes(manager)}
                            onChange={() => handleMultiSelect('managers', manager)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {manager.split(' - ')[0]}
                          </span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Status */}
                <Card variant="outline">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">📊 Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uniqueValues.statuses.map(status => (
                        <label key={status} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.statuses.includes(status)}
                            onChange={() => handleMultiSelect('statuses', status)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {status}
                          </span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Value Range */}
                <Card variant="outline">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">💰 Faixa de Valores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Valor mínimo"
                        type="number"
                        leftIcon={<CurrencyDollarIcon className="w-4 h-4" />}
                        value={filters.valueRange.min}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          valueRange: { ...prev.valueRange, min: e.target.value }
                        }))}
                      />
                      <Input
                        placeholder="Valor máximo"
                        type="number"
                        leftIcon={<CurrencyDollarIcon className="w-4 h-4" />}
                        value={filters.valueRange.max}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          valueRange: { ...prev.valueRange, max: e.target.value }
                        }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Days Range */}
                <Card variant="outline">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">⏱️ Faixa de Prazos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Dias mín."
                        type="number"
                        leftIcon={<ClockIcon className="w-4 h-4" />}
                        value={filters.daysRange.min}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          daysRange: { ...prev.daysRange, min: e.target.value }
                        }))}
                      />
                      <Input
                        placeholder="Dias máx."
                        type="number"
                        leftIcon={<ClockIcon className="w-4 h-4" />}
                        value={filters.daysRange.max}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          daysRange: { ...prev.daysRange, max: e.target.value }
                        }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Date Range */}
                <Card variant="outline">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">📅 Período</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="date"
                        leftIcon={<CalendarIcon className="w-4 h-4" />}
                        value={filters.dateRange.start}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, start: e.target.value }
                        }))}
                      />
                      <Input
                        type="date"
                        leftIcon={<CalendarIcon className="w-4 h-4" />}
                        value={filters.dateRange.end}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value }
                        }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex space-x-3">
                  <Button variant="secondary" onClick={clearAllFilters} className="flex-1">
                    🗑️ Limpar Tudo
                  </Button>
                  <Button className="flex flex-1">
                    ✅ Aplicar Filtros
                  </Button>
                </div>
                
                <Button variant="ghost" onClick={onClose} className="w-full">
                  Fechar
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FilterPanel

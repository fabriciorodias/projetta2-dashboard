import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { exportData } from '@/services/api'
import { 
  XMarkIcon, 
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  DocumentIcon
} from '@heroicons/react/24/outline'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  dataCount: number
  filters?: any
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, dataCount, filters }) => {
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('excel')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeFilters, setIncludeFilters] = useState(true)
  const [customName, setCustomName] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const formatOptions = [
    {
      value: 'excel',
      label: 'Excel (.xlsx)',
      icon: <TableCellsIcon className="w-5 h-5" />,
      description: 'Múltiplas abas com análises completas',
      recommended: true,
    },
    {
      value: 'pdf',
      label: 'PDF',
      icon: <DocumentIcon className="w-5 h-5" />,
      description: 'Relatório executivo com gráficos',
    },
    {
      value: 'csv',
      label: 'CSV',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      description: 'Dados brutos para análise externa',
    },
  ]

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const blob = await exportData(format, filters)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Set filename
      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = customName || `propostas_${timestamp}.${format === 'excel' ? 'xlsx' : format}`
      link.download = filename
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      onClose()
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const getExportSizeEstimate = () => {
    const baseSize = dataCount * 0.001 // KB per record
    const multipliers = {
      csv: baseSize,
      excel: baseSize * 2,
      pdf: baseSize * 0.5 + 500, // PDFs são maiores por conter gráficos
    }
    
    const sizeKB = Math.round(multipliers[format])
    if (sizeKB < 1024) return `${sizeKB} KB`
    return `${(sizeKB / 1024).toFixed(1)} MB`
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <DocumentArrowDownIcon className="w-6 h-6 text-primary-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Exportar Dados
                  </h3>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <XMarkIcon className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                {/* Data Summary */}
                <Card variant="outline">
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {dataCount.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        registros serão exportados
                      </p>
                      <div className="flex justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>📊 Gráficos: {includeCharts ? 'Sim' : 'Não'}</span>
                        <span>🔍 Filtros: {includeFilters ? 'Sim' : 'Não'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Format Selection */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Escolha o formato:
                  </h4>
                  <div className="space-y-2">
                    {formatOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`block cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                          format === option.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="format"
                              value={option.value}
                              checked={format === option.value}
                              onChange={(e) => setFormat(e.target.value as any)}
                              className="text-primary-600 focus:ring-primary-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-600 dark:text-gray-400">
                                  {option.icon}
                                </span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {option.label}
                                </span>
                                {option.recommended && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                                    Recomendado
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Export Options */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Opções de Exportação:
                  </h4>
                  
                  <div className="space-y-3">
                    {format !== 'csv' && (
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={includeCharts}
                          onChange={(e) => setIncludeCharts(e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Incluir Gráficos
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Adiciona visualizações aos relatórios
                          </p>
                        </div>
                      </label>
                    )}
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={includeFilters}
                        onChange={(e) => setIncludeFilters(e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Incluir Filtros Aplicados
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Documenta os critérios utilizados
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Custom Filename */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome do arquivo (opcional):
                  </label>
                  <Input
                    placeholder="Ex: relatorio_propostas_janeiro"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                  />
                </div>

                {/* Size Estimate */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Tamanho estimado:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {getExportSizeEstimate()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <Button 
                  onClick={handleExport} 
                  loading={isExporting}
                  className="w-full"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"/>
                      </svg>
                      Preparando arquivo...
                    </>
                  ) : (
                    <>
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                      Baixar {format.toUpperCase()}
                    </>
                  )}
                </Button>
                <Button variant="ghost" onClick={onClose} className="w-full">
                  Cancelar
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ExportModal

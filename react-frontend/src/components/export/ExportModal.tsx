import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  DocumentTextIcon, 
  TableCellsIcon, 
  DocumentIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useProposals } from '@/hooks/useStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ApiService from '@/services/api'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  dataCount?: number
}

const ExportModal = ({ isOpen, onClose, dataCount = 0 }: ExportModalProps) => {
  const proposals = useProposals()
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf'>('csv')
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const formats = [
    {
      id: 'csv' as const,
      name: 'CSV',
      description: 'Arquivo de texto separado por vírgulas',
      icon: DocumentTextIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'excel' as const,
      name: 'Excel',
      description: 'Planilha com múltiplas abas e formatação',
      icon: TableCellsIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'pdf' as const,
      name: 'PDF',
      description: 'Documento com gráficos e tabelas',
      icon: DocumentIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    }
  ]

  const handleExport = async () => {
    setIsExporting(true)
    setExportComplete(false)
    
    try {
      await ApiService.exportData(selectedFormat, proposals)
      
      setTimeout(() => {
        setIsExporting(false)
        setExportComplete(true)
        setTimeout(() => {
          setExportComplete(false)
          onClose()
        }, 2000)
      }, 1500)
    } catch (error) {
      setIsExporting(false)
      console.error('Erro ao exportar:', error)
    }
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
            className="fixed inset-0 bg-black bg-opacity-25 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <Card className="relative">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg font-semibold">Exportar Dados</CardTitle>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <XMarkIcon className="w-5 h-5" />
                  </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Data Info */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Total de registros
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {dataCount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Format Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Escolha o formato
                    </label>
                    {formats.map((format) => (
                      <div
                        key={format.id}
                        className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                          selectedFormat === format.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => setSelectedFormat(format.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${format.bgColor}`}>
                            <format.icon className={`w-5 h-5 ${format.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                {format.name}
                              </h3>
                              {selectedFormat === format.id && (
                                <CheckCircleIcon className="w-4 h-4 text-blue-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {format.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Export Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleExport}
                      loading={isExporting}
                      disabled={isExporting}
                      className="w-full"
                    >
                      {exportComplete ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 mr-2" />
                          Exportação Concluída!
                        </>
                      ) : isExporting ? (
                        'Exportando...'
                      ) : (
                        `Exportar para ${formats.find(f => f.id === selectedFormat)?.name}`
                      )}
                    </Button>
                  </div>

                  {exportComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-2"
                    >
                      <p className="text-sm text-green-600 dark:text-green-400">
                        ✓ Download iniciado automaticamente
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ExportModal
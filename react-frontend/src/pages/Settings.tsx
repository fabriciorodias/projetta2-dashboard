import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    refreshInterval: 300,
    autoExport: false,
    exportFormat: 'excel',
    notifications: true,
    cacheEnabled: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    // Aqui seria implementada a lógica para salvar as configurações
    console.log('Settings saved:', settings)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie as preferências do dashboard
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Display Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Exibição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Intervalo de Atualização
                </label>
                <select
                  value={settings.refreshInterval}
                  onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                  className="input"
                >
                  <option value={30}>30 segundos</option>
                  <option value={60}>1 minuto</option>
                  <option value={300}>5 minutos</option>
                  <option value={900}>15 minutos</option>
                  <option value={0}>Desabilitado</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notificações
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receber alertas sobre mudanças importantes
                  </p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', !settings.notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.notifications ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cache Habilitado
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Melhora a performance do dashboard
                  </p>
                </div>
                <button
                  onClick={() => handleSettingChange('cacheEnabled', !settings.cacheEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.cacheEnabled ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.cacheEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Export Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Exportações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Formato Preferido
                </label>
                <select
                  value={settings.exportFormat}
                  onChange={(e) => handleSettingChange('exportFormat', e.target.value)}
                  className="input"
                >
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exportação Automática
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Exportar relatórios periodicamente
                  </p>
                </div>
                <button
                  onClick={() => handleSettingChange('autoExport', !settings.autoExport)}
                  className={`relative inline-flex h-6 w-8 items-center rounded-full transition-colors duration-200 ${
                    settings.autoExport ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.autoExport ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {settings.autoExport && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Frequência da Exportação
                  </label>
                  <select className="input">
                    <option value="daily">Diariamente</option>
                    <option value="business">Dias úteis</option>
                    <option value="weekly">Semanalmente</option>
                    <option value="monthly">Mensalmente</option>
                  </select>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Sobre o Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Versão:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">2.0.0 React</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Última atualização:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Hoje</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ambiente:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Desenvolvimento</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col space-y-3">
                  <Button variant="secondary" className="w-full">
                    📖 Documentação
                  </Button>
                  <Button variant="secondary" className="w-full">
                    🆘 Suporte
                  </Button>
                  <Button variant="secondary" className="w-full">
                    🔄 Verificar Atualizações
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-3">
                <Button onClick={saveSettings} className="w-full">
                  💾 Salvar Configurações
                </Button>
                <Button variant="secondary" className="w-full">
                  🔄 Resetar Padrões
                </Button>
                <Button variant="danger" className="w-full">
                  🗑️ Limpar Cache
                </Button>
                <Button variant="secondary" className="w-full">
                  📊 Exportar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings

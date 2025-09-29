import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { useSidebarCollapsed, useAlerts, useRemoveAlert } from '@/hooks/useStore'

interface SidebarProps {
  children: React.ReactNode
}

const AlertItem = ({ alert, onRemove }: { alert: any; onRemove: () => void }) => {
  const icons = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
    info: ExclamationTriangleIcon,
  }

  const colors = {
    success: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
    warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
    error: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300',
    info: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
  }

  const Icon = icons[alert.type as keyof typeof icons]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`p-3 rounded-lg border-l-4 ${colors[alert.type as keyof typeof colors]} mb-3`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2">
          <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{alert.message}</p>
            <p className="text-xs mt-1 opacity-75">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

const Sidebar = ({ children }: SidebarProps) => {
  const sidebarCollapsed = useSidebarCollapsed()
  const alerts = useAlerts()
  const removeAlert = useRemoveAlert()
  const [showAlerts, setShowAlerts] = useState(false)

  useEffect(() => {
    if (alerts.length > 0) {
      setShowAlerts(true)
    }
  }, [alerts.length])

  useEffect(() => {
    alerts.forEach((alert, index) => {
      if (alert.autoHide !== false) {
        const timer = setTimeout(() => {
          removeAlert(index)
        }, 5000)
        return () => clearTimeout(timer)
      }
    })
  }, [alerts, removeAlert])

  return (
    <aside className={`relative transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Main Sidebar */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col"
      >
        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {children}
        </div>

        {/* Alerts section */}
        <AnimatePresence>
          {(showAlerts && alerts.length > 0) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 max-h-96 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Alertas Recentes
                </h3>
                <button
                  onClick={() => setShowAlerts(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {alerts.slice(-5).map((alert, index) => (
                  <AlertItem
                    key={alert.id}
                    alert={alert}
                    onRemove={() => removeAlert(index)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick stats footer */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 bg-gray-50 dark:bg-gray-800"
          >
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">150</div>
                  <div className="text-gray-500 dark:text-gray-400">Propostas</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="w-4 h-4 text-green-500" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">R$ 2.1M</div>
                  <div className="text-gray-500 dark:text-gray-400">Valor Total</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">18</div>
                  <div className="text-gray-500 dark:text-gray-400">Dias Médio</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">4</div>
                  <div className="text-gray-500 dark:text-gray-400">Gerentes</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </aside>
  )
}

export default Sidebar
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import FilterPanel from '@/components/filters/FilterPanel'
import ExportModal from '@/components/export/ExportModal'
import { useIsDarkMode, useToggleDarkMode, useSidebarCollapsed, useToggleSidebar, useProposals } from '@/hooks/useStore'
import { MagnifyingGlassIcon, SunIcon, MoonIcon, Bars3Icon, FunnelIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const isDarkMode = useIsDarkMode()
  const toggleDarkMode = useToggleDarkMode()
  const sidebarCollapsed = useSidebarCollapsed()
  const toggleSidebar = useToggleSidebar()
  const proposals = useProposals()

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Mobile sidebar toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <Bars3Icon className="h-5 w-5" />
            </Button>
            
            {/* Logo - hidden on collapsed sidebar */}
            {sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P2</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">Dashboard</span>
              </motion.div>
            )}
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-lg mx-4 hidden sm:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar propostas, clientes, agências..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-colors duration-200"
              />
            </motion.div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* Quick actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                className="relative"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsExportOpen(true)}
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>

            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="relative"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDarkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-gray-600" />
                )}
              </motion.div>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5v5zM12 19v-7m0 0V9m0 3V7m0 0H9m3 0h3" />
              </svg>
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-error-500 rounded-full text-xs"></span>
            </Button>

            {/* User menu */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">U</span>
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Usuário
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />

      {/* Export Modal */}
      <ExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        dataCount={proposals.length}
      />
    </motion.header>
  )
}

export default Header

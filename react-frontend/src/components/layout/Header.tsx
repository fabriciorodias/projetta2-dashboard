import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  BellIcon, 
  SunIcon, 
  MoonIcon,
  FunnelIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { useToggleSidebar, useToggleDarkMode, useIsDarkMode } from '@/hooks/useStore'
import Button from '@/components/ui/Button'
import FilterPanel from '@/components/filters/FilterPanel'
import ExportModal from '@/components/export/ExportModal'

interface HeaderProps {
  onSearchChange?: (value: string) => void
  searchValue?: string
}

const Header = ({ onSearchChange, searchValue = '' }: HeaderProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const toggleSidebar = useToggleSidebar()
  const toggleDarkMode = useToggleDarkMode()
  const isDarkMode = useIsDarkMode()

  return (
    <>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-lg"
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="md:hidden"
              >
                <Bars3Icon className="w-5 h-5" />
              </Button>

              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P2</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Projetta2
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Dashboard Analytics
                  </p>
                </div>
              </div>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar propostas, clientes, agências..."
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              {/* Filter button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                className="hidden sm:flex"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filtros
              </Button>

              {/* Export button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExportOpen(true)}
                className="hidden sm:flex"
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                Exportar
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative"
              >
                <BellIcon className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* Dark mode toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2"
              >
                <motion.div
                  key={isDarkMode ? 'dark' : 'light'}
                  initial={{ rotate: 180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDarkMode ? (
                    <MoonIcon className="w-5 h-5" />
                  ) : (
                    <SunIcon className="w-5 h-5" />
                  )}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Modals */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </>
  )
}

export default Header
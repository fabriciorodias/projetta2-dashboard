import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSidebarCollapsed, useToggleSidebar } from '@/hooks/useStore'

interface SidebarProps {
  children: React.ReactNode
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ children, className = '' }) => {
  const collapsed = useSidebarCollapsed()
  const toggleSidebar = useToggleSidebar()

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: collapsed ? '80px' : '320px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`hidden lg:block sidebar bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      >
        <div className="h-screen flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P2</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Projetta2</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P2</span>
                </div>
              </motion.div>
            )}
            
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <svg
                className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
                  collapsed ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            {children}
          </div>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {/* This would be implemented for mobile */}
      </AnimatePresence>
    </>
  )
}

export default Sidebar

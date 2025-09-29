import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'motion'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Dashboard from '@/pages/Dashboard'
import PortfolioAnalysis from '@/pages/PortfolioAnalysis'
import ManagerPerformance from '@/pages/ManagerPerformance'
import Settings from '@/pages/Settings'
import { useSidebarCollapsed } from '@/hooks/useStore'

function App() {
  const sidebarCollapsed = useSidebarCollapsed()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <div className="flex">
        <Sidebar>
          <div className="space-y-6">
            {/* Navigation */}
            <nav className="space-y-2">
              <SidebarNavItem
                href="/"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2H3z" /></svg>}
                label="Dashboard"
              />
              <SidebarNavItem
                href="/portfolio"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V7a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                label="Carteiras"
              />
              <SidebarNavItem
                href="/managers"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 .02v1A6 6 0 0115 21" /></svg>}
                label="Gerentes"
              />
              <SidebarNavItem
                href="/settings"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                label="Configurações"
              />
            </nav>

            {/* Quick Stats */}
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Resumo Rápido
                </div>
                <div className="space-y-3">
                  <QuickStatItem label="Total Props." value="1,234" />
                  <QuickStatItem label="Valor Total" value="R$ 45.2M" />
                  <QuickStatItem label="Último Mês" value="+12%" />
                </div>
              </motion.div>
            )}
          </div>
        </Sidebar>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-0' : 'lg:ml-0'
        }`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900"
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/portfolio" element={<PortfolioAnalysis />} />
              <Route path="/managers" element={<ManagerPerformance />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

// Sidebar Navigation Item Component
interface SidebarNavItemProps {
  href: string
  icon: React.ReactNode
  label: string
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ href, icon, label }) => {
  const sidebarCollapsed = useSidebarCollapsed()

  return (
    <a
      href={href}
      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 ${
        sidebarCollapsed ? 'justify-center' : ''
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!sidebarCollapsed && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {label}
        </motion.span>
      )}
    </a>
  )
}

// Quick Stat Item Component
interface QuickStatItemProps {
  label: string
  value: string
}

const QuickStatItem: React.FC<QuickStatItemProps> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
  </div>
)

export default App

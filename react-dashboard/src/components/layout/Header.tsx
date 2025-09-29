import React from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { ui, setUIState } = useStore();

  const toggleSidebar = () => {
    setUIState({ sidebarOpen: !ui.sidebarOpen });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
          
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              📊 Dashboard Projetta2
            </h1>
            <p className="text-sm text-gray-600">
              Análise de Propostas de Crédito
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Atualizar
          </Button>

          <div className="text-sm text-gray-500">
            {new Date().toLocaleString('pt-BR')}
          </div>
        </div>
      </div>
    </header>
  );
};
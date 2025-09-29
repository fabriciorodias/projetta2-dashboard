import React from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';

export const Sidebar: React.FC = () => {
  const { ui, filtros, setFiltros, propostas } = useStore();

  if (!ui.sidebarOpen) return null;

  // Extrair opções únicas dos dados
  const agencias = ['Todos', ...Array.from(new Set(propostas.map(p => p.nomeAgencia)))];
  const carteiras = ['Todos', ...Array.from(new Set(propostas.map(p => p.carteiraNegocio)))];
  const status = ['Todos', ...Array.from(new Set(propostas.map(p => p.statusPrioridade)))];
  const gerentes = ['Todos', ...Array.from(new Set(propostas.map(p => p.gerenteResponsavel)))];

  const limparFiltros = () => {
    setFiltros({
      agencia: 'Todos',
      carteiraNegocio: 'Todos',
      statusPrioridade: 'Todos',
      gerenteResponsavel: 'Todos',
      buscaTexto: ''
    });
  };

  return (
    <aside className="bg-white shadow-sm border-r border-gray-200 w-80 min-h-screen">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">🔍 Filtros</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={limparFiltros}
          >
            Limpar
          </Button>
        </div>

        <div className="space-y-6">
          {/* Filtro de Agência */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agência
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtros.agencia}
              onChange={(e) => setFiltros({ agencia: e.target.value })}
            >
              {agencias.map(agencia => (
                <option key={agencia} value={agencia}>
                  {agencia}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Carteira */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carteira de Negócio
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtros.carteiraNegocio}
              onChange={(e) => setFiltros({ carteiraNegocio: e.target.value })}
            >
              {carteiras.map(carteira => (
                <option key={carteira} value={carteira}>
                  {carteira}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtros.statusPrioridade}
              onChange={(e) => setFiltros({ statusPrioridade: e.target.value })}
            >
              {status.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Gerente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gerente
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtros.gerenteResponsavel}
              onChange={(e) => setFiltros({ gerenteResponsavel: e.target.value })}
            >
              {gerentes.map(gerente => (
                <option key={gerente} value={gerente}>
                  {gerente.length > 30 ? `${gerente.substring(0, 30)}...` : gerente}
                </option>
              ))}
            </select>
          </div>

          {/* Busca Textual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Buscar Cliente
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o nome do cliente..."
              value={filtros.buscaTexto}
              onChange={(e) => setFiltros({ buscaTexto: e.target.value })}
            />
          </div>

          {/* Info de Filtros */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Filtros aplicados automaticamente
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
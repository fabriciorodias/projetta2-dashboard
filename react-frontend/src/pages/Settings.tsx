import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  CogIcon, 
  SunIcon, 
  MoonIcon, 
  BellIcon,
  UserIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline'
import { useIsDarkMode, useToggleDarkMode } from '@/hooks/useStore'

const Settings = () => {
  const isDarkMode = useIsDarkMode()
  const toggleDarkMode = useToggleDarkMode()

  const settingsSections = [
    {
      title: 'Aparência',
      icon: <SunIcon className="w-5 h-5" />,
      items: [
        {
          label: 'Modo Escuro',
          description: 'Alternar entre tema claro e escuro',
          action: (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleDarkMode}
              className="flex items-center space-x-2"
            >
              {isDarkMode ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
              <span>{isDarkMode ? 'Escuro' : 'Claro'}</span>
            </Button>
          )
        },
        {
          label: 'Idioma',
          description: 'Português (Brasil)',
          action: <span className="text-sm text-gray-500">Português</span>
        }
      ]
    },
    {
      title: 'Notificações',
      icon: <BellIcon className="w-5 h-5" />,
      items: [
        {
          label: 'Alertas do Sistema',
          description: 'Receber notificações sobre mudanças importantes',
          action: <div className="w-12 h-6 bg-blue-500 rounded-full relative">
            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
          </div>
        },
        {
          label: 'Novos Dados',
          description: 'Notificar quando novos dados estiverem disponíveis',
          action: <div className="w-12 h-6 bg-blue-500 rounded-full relative">
            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
          </div>
        }
      ]
    },
    {
      title: 'Conta',
      icon: <UserIcon className="w-5 h-5" />,
      items: [
        {
          label: 'Perfil de Usuário',
          description: 'Administrador do Sistema',
          action: <Button variant="ghost" size="sm">Editar</Button>
        },
        {
          label: 'Alterar Senha',
          description: 'Última alteração há 30 dias',
          action: <Button variant="ghost" size="sm">Alterar</Button>
        }
      ]
    },
    {
      title: 'Segurança',
      icon: <ShieldCheckIcon className="w-5 h-5" />,
      items: [
        {
          label: 'Autenticação',
          description: 'Autenticação de dois fatores desabilitada',
          action: <Button variant="ghost" size="sm">Configurar</Button>
        },
        {
          label: 'Logs de Acesso',
          description: 'Histórico de acesso dos últimos 30 dias',
          action: <Button variant="ghost" size="sm">Visualizar</Button>
        }
      ]
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Configurações
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Personalize sua experiência no dashboard
          </p>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Status do Sistema</div>
                  <div className="text-xl font-bold text-green-600">Online</div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Última Atualização</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">Agora</div>
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Versão</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">v2.0.0</div>
                </div>
                <CogIcon className="w-6 h-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      {section.icon}
                    </div>
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {section.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex}
                        className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {item.label}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {item.description}
                          </div>
                        </div>
                        <div className="ml-4">
                          {item.action}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="ghost">Cancelar</Button>
          <Button>Salvar Alterações</Button>
        </div>
      </div>
    </motion.div>
  )
}

export default Settings
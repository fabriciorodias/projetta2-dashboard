import React from 'react'
import { useMemo } from 'react'
import { formatCurrencyBRL, formatDate, formatNumberBR } from '@/utils/formatters'

type Formatter = 'currency' | 'date' | 'number' | 'text'

export interface DataTableColumn<T> {
  key: keyof T
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  format?: Formatter | ((value: any, row: T) => React.ReactNode)
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  pageSize?: number
  emptyMessage?: string
}

function formatCell(value: any, format?: Formatter | ((v: any) => React.ReactNode)) {
  if (typeof format === 'function') return format(value)
  switch (format) {
    case 'currency':
      return formatCurrencyBRL(Number(value))
    case 'date':
      return formatDate(value)
    case 'number':
      return formatNumberBR(Number(value))
    default:
      return String(value ?? '')
  }
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  emptyMessage = 'Nenhum registro encontrado',
}: DataTableProps<T>) {
  const [page, setPage] = React.useState(1)

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize])

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages, page])

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  }`}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginated.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {paginated.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`px-4 py-3 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap ${
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    }`}
                  >
                    {formatCell(row[col.key], col.format as any)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Página {page} de {totalPages}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={page <= 1}
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={page >= totalPages}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable



export const formatCurrencyBRL = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value || 0
  )

export const formatNumberBR = (value: number): string =>
  new Intl.NumberFormat('pt-BR').format(value || 0)

export const formatPercentage = (value: number, fractionDigits = 1): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format((value || 0) / 100)

export const formatDate = (date: Date | string): string =>
  new Intl.DateTimeFormat('pt-BR').format(new Date(date))

export const formatDateTime = (date: Date | string): string =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))

export const formatDays = (days: number): string =>
  `${Math.round(days || 0)} dia${Math.round(days || 0) === 1 ? '' : 's'}`

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

export const truncate = (text: string, len = 32): string =>
  text.length > len ? `${text.slice(0, len - 1)}…` : text



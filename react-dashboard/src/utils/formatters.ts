// Funções utilitárias para formatação e cálculos

export const formatters = {
  currency: (value: number): string => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value),
    
  number: (value: number): string =>
    new Intl.NumberFormat('pt-BR').format(value),
    
  date: (date: Date): string =>
    new Intl.DateTimeFormat('pt-BR').format(date),
    
  datetime: (date: Date): string =>
    new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date),
    
  percentage: (value: number): string =>
    new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 1
    }).format(value / 100),
    
  days: (days: number): string =>
    `${Math.round(days)} dia${days !== 1 ? 's' : ''}`
};

export function groupBy<T>(array: T[], key: keyof T | ((item: T) => any)): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function median(numbers: number[]): number {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

export function calculateStdDev(numbers: number[]): number {
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
  return Math.sqrt(variance);
}

export function percentile(numbers: number[], p: number): number {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  
  if (Math.floor(index) === index) {
    return sorted[index];
  }
  
  const lower = sorted[Math.floor(index)];
  const upper = sorted[Math.ceil(index)];
  const weight = index - Math.floor(index);
  
  return lower * (1 - weight) + upper * weight;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
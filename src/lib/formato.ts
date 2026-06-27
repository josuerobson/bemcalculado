const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatBRL(value: number): string {
  return brlFormatter.format(value);
}

export function parseCurrency(str: string): number {
  const cleaned = str
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  return parseFloat(cleaned) || 0;
}

export function parsePercent(str: string): number {
  const cleaned = str.replace(/[%\s]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}

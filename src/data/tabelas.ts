// Fonte única de verdade para tabelas fiscais e trabalhistas brasileiras

export interface FaixaINSS {
  faixaMin: number;
  faixaMax: number;
  aliquota: number; // percentual (ex: 7.5)
}

export interface FaixaIRRF {
  faixaMin: number;
  faixaMax: number | null; // null = sem limite
  aliquota: number; // percentual
  deducao: number; // valor em R$
}

export interface TabelaComVigencia<T> {
  dados: T;
  fonte: string;
  vigencia: string;
}

// --- INSS 2025 ---
// TODO: confirmar vigência
export const tabelaINSS: TabelaComVigencia<FaixaINSS[]> = {
  dados: [
    { faixaMin: 0, faixaMax: 1518.00, aliquota: 7.5 },
    { faixaMin: 1518.01, faixaMax: 2793.88, aliquota: 9 },
    { faixaMin: 2793.89, faixaMax: 5563.94, aliquota: 12 },
    { faixaMin: 5563.95, faixaMax: 8157.41, aliquota: 14 },
  ],
  fonte: 'https://www.gov.br/inss/pt-br',
  vigencia: '2025-01-01', // TODO: confirmar vigência
};

// --- IRRF 2025 ---
// TODO: confirmar vigência
export const tabelaIRRF: TabelaComVigencia<FaixaIRRF[]> = {
  dados: [
    { faixaMin: 0, faixaMax: 2259.20, aliquota: 0, deducao: 0 },
    { faixaMin: 2259.21, faixaMax: 2826.65, aliquota: 7.5, deducao: 169.44 },
    { faixaMin: 2826.66, faixaMax: 3751.05, aliquota: 15, deducao: 381.44 },
    { faixaMin: 3751.06, faixaMax: 4664.68, aliquota: 22.5, deducao: 662.77 },
    { faixaMin: 4664.69, faixaMax: null, aliquota: 27.5, deducao: 896.00 },
  ],
  fonte: 'https://www.gov.br/receitafederal/pt-br',
  vigencia: '2025-02-01', // TODO: confirmar vigência
};

// --- Valores de referência 2025 ---
export const salarioMinimo: TabelaComVigencia<number> = {
  dados: 1518,
  fonte: 'https://www.gov.br/trabalho-e-emprego/pt-br',
  vigencia: '2025-01-01', // TODO: confirmar vigência
};

export const tetoINSS: TabelaComVigencia<number> = {
  dados: 8157.41,
  fonte: 'https://www.gov.br/inss/pt-br',
  vigencia: '2025-01-01', // TODO: confirmar vigência
};

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

// --- IR 2026 — Lei 15.270/2025 (vigência 01/01/2026) ---

export interface Lei15270Constantes {
  teto_isencao: number;        // RTB ≤ este valor → redutor = min(IR, reducao_max_isento)
  reducao_max_isento: number;  // 312.89 — redutor máximo para isentos
  faixa_reducao_max: number;   // 7350 — acima disto, redutor = 0
  coef_a: number;              // 978.62 — constante da fórmula do redutor parcial
  coef_b: number;              // 0.133145 — coeficiente da fórmula do redutor parcial
  desconto_simplificado: number; // 607.20 (= 25% de R$ 2.428,80)
}

// Constantes definidas pela Lei 15.270/2025 — NÃO alterar sem nova legislação
export const lei15270: TabelaComVigencia<Lei15270Constantes> = {
  dados: {
    teto_isencao: 5000,
    reducao_max_isento: 312.89,
    faixa_reducao_max: 7350,
    coef_a: 978.62,
    coef_b: 0.133145,
    desconto_simplificado: 607.20,
  },
  fonte: 'Lei 15.270/2025 — https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/L15270.htm',
  vigencia: '2026-01-01',
};

// Tabela progressiva mensal IRRF 2026 — CONFIRMADO via gov.br/receitafederal (busca web 2026-06-30)
// A tabela progressiva em si não mudou desde 2025 em termos estruturais, mas a Lei 15.270/2025
// elevou a faixa de isenção da tabela para R$ 2.428,80 (mesmo valor da base simplificada) e
// recalculou as parcelas a deduzir das faixas seguintes.
export const tabelaIRRF2026: TabelaComVigencia<FaixaIRRF[]> = {
  dados: [
    { faixaMin: 0,       faixaMax: 2428.80, aliquota: 0,    deducao: 0      },
    { faixaMin: 2428.81, faixaMax: 2826.65, aliquota: 7.5,  deducao: 182.16 },
    { faixaMin: 2826.66, faixaMax: 3751.05, aliquota: 15,   deducao: 394.16 },
    { faixaMin: 3751.06, faixaMax: 4664.68, aliquota: 22.5, deducao: 675.49 },
    { faixaMin: 4664.69, faixaMax: null,    aliquota: 27.5, deducao: 908.73 },
  ],
  fonte: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026',
  vigencia: '2026-01-01',
};

// Tabela INSS 2026 — CONFIRMADO via Portaria Interministerial MPS/MF nº 13/2026 (busca web 2026-06-30)
// Reajuste de 3,9%: piso nacional R$ 1.621,00, teto do INSS R$ 8.475,55
export const tabelaINSS2026: TabelaComVigencia<FaixaINSS[]> = {
  dados: [
    { faixaMin: 0,       faixaMax: 1621.00, aliquota: 7.5 },
    { faixaMin: 1621.01, faixaMax: 2902.84, aliquota: 9   },
    { faixaMin: 2902.85, faixaMax: 4354.27, aliquota: 12  },
    { faixaMin: 4354.28, faixaMax: 8475.55, aliquota: 14  },
  ],
  fonte: 'Portaria Interministerial MPS/MF nº 13/2026 — https://www.gov.br/previdencia/pt-br/assuntos/rpps/documentos/PortariaInterministerialMPSMF13de9dejaneirode2026.pdf',
  vigencia: '2026-01-01',
};

// Dedução por dependente mensal 2026 — CONFIRMADO via gov.br/receitafederal (busca web 2026-06-30)
// Valor mantido em relação a 2025: R$ 189,59/mês (R$ 2.275,08/ano)
export const deducaoDependente2026: TabelaComVigencia<number> = {
  dados: 189.59,
  fonte: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026',
  vigencia: '2026-01-01',
};

// Teto do INSS 2026 — referência para validação de limites de contribuição
export const tetoINSS2026: TabelaComVigencia<number> = {
  dados: 8475.55,
  fonte: 'https://www.gov.br/inss/pt-br/assuntos/com-reajuste-de-3-9-teto-do-inss-chega-a-r-8-475-55-em-2026',
  vigencia: '2026-01-01',
};

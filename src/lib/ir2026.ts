// Engine de cálculo do IR 2026 — Lei 15.270/2025
// Função pura, sem dependências de UI. Importável tanto no frontmatter (SSR) quanto em <script> (client).

import {
  tabelaINSS2026,
  tabelaIRRF2026,
  deducaoDependente2026,
  lei15270,
} from '../data/tabelas';

export interface InputIR2026 {
  salarioBruto: number;
  dependentes: number;
  inssManual?: number;     // se informado, usa este valor; senão calcula via tabela
  outrasDeducoes?: number; // pensão alimentícia, previdência privada, etc.
}

export interface ResultadoIR2026 {
  salarioBruto: number;
  inss: number;
  deducaoDependentes: number;
  outrasDeducoes: number;
  // Caminho completo (deduções legais)
  baseCompleto: number;
  irCompleto: number;
  // Caminho simplificado (desconto fixo)
  baseSimplificado: number;
  irSimplificado: number;
  descontoSimplificado: number;
  // Escolha automática
  metodo: 'completo' | 'simplificado';
  irApurado: number;
  // Redutor Lei 15.270 — calculado sobre RTB, nunca sobre base
  rtb: number;
  reducao: number;
  // Final
  irFinal: number;
  isento: boolean;
  // Comparativo antes/depois
  irSemReducao: number;
  economia: number;
  // Auxiliares para exibição
  faixaTabela: string;
  aliquotaEfetiva: number;
}

function calcularINSS(salario: number): number {
  const { dados } = tabelaINSS2026;
  let inss = 0;
  for (const faixa of dados) {
    if (salario <= faixa.faixaMin) break;
    const contribuicao = Math.min(salario, faixa.faixaMax) - faixa.faixaMin;
    inss += contribuicao * (faixa.aliquota / 100);
  }
  return Math.round(inss * 100) / 100;
}

function aplicarTabela(base: number): { ir: number; faixa: string } {
  if (base <= 0) return { ir: 0, faixa: 'Isento' };
  const { dados } = tabelaIRRF2026;
  for (const f of dados) {
    const max = f.faixaMax ?? Infinity;
    if (base <= max) {
      const ir = Math.max(0, base * (f.aliquota / 100) - f.deducao);
      const faixa = f.aliquota === 0
        ? `Isento (base até R$ ${max.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`
        : `${f.aliquota}% (parcela a deduzir R$ ${f.deducao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`;
      return { ir: Math.round(ir * 100) / 100, faixa };
    }
  }
  return { ir: 0, faixa: 'Isento' };
}

function calcularReducor(rtb: number, irApurado: number): number {
  // PEGADINHA: o redutor usa RTB (salário bruto), nunca a base de cálculo
  const { dados } = lei15270;
  let reducao = 0;
  if (rtb <= dados.teto_isencao) {
    reducao = Math.min(irApurado, dados.reducao_max_isento);
  } else if (rtb <= dados.faixa_reducao_max) {
    const calc = dados.coef_a - dados.coef_b * rtb;
    reducao = Math.min(irApurado, Math.max(0, calc));
  }
  return Math.round(reducao * 100) / 100;
}

export function calcularIR2026(input: InputIR2026): ResultadoIR2026 {
  const { salarioBruto, dependentes } = input;
  const outrasDeducoes = input.outrasDeducoes ?? 0;
  const inss = input.inssManual !== undefined ? input.inssManual : calcularINSS(salarioBruto);
  const deducaoDependentes = dependentes * deducaoDependente2026.dados;
  const rtb = salarioBruto; // Rendimento Tributável Bruto — input do redutor (não a base de cálculo)
  const descontoSimplificado = lei15270.dados.desconto_simplificado;

  // Caminho completo
  const baseCompleto = Math.max(0, rtb - inss - deducaoDependentes - outrasDeducoes);
  const { ir: irCompleto, faixa: faixaCompleto } = aplicarTabela(baseCompleto);

  // Caminho simplificado
  const baseSimplificado = Math.max(0, rtb - descontoSimplificado);
  const { ir: irSimplificado, faixa: faixaSimplificado } = aplicarTabela(baseSimplificado);

  // Escolha automática: menor imposto
  const metodo: 'completo' | 'simplificado' = irSimplificado <= irCompleto ? 'simplificado' : 'completo';
  const irApurado = metodo === 'simplificado' ? irSimplificado : irCompleto;
  const faixaTabela = metodo === 'simplificado' ? faixaSimplificado : faixaCompleto;

  // Redutor Lei 15.270 — SEMPRE sobre RTB, nunca sobre base
  const reducao = calcularReducor(rtb, irApurado);
  const irFinal = Math.max(0, Math.round((irApurado - reducao) * 100) / 100);
  const economia = Math.round((irApurado - irFinal) * 100) / 100;
  const aliquotaEfetiva = salarioBruto > 0
    ? Math.round((irFinal / salarioBruto) * 10000) / 100
    : 0;

  return {
    salarioBruto,
    inss,
    deducaoDependentes: Math.round(deducaoDependentes * 100) / 100,
    outrasDeducoes: Math.round(outrasDeducoes * 100) / 100,
    baseCompleto: Math.round(baseCompleto * 100) / 100,
    irCompleto: Math.round(irCompleto * 100) / 100,
    baseSimplificado: Math.round(baseSimplificado * 100) / 100,
    irSimplificado: Math.round(irSimplificado * 100) / 100,
    descontoSimplificado,
    metodo,
    irApurado: Math.round(irApurado * 100) / 100,
    rtb,
    reducao,
    irFinal,
    isento: irFinal === 0,
    irSemReducao: Math.round(irApurado * 100) / 100,
    economia,
    faixaTabela,
    aliquotaEfetiva,
  };
}

// 13º salário — cálculo exclusivo na fonte, separado do mensal
// O redutor da Lei 15.270 incide normalmente sobre o RTB do 13º
export function calcularIR13o(input: Omit<InputIR2026, 'outrasDeducoes'>): ResultadoIR2026 {
  return calcularIR2026({ ...input, outrasDeducoes: 0 });
}

// --- Casos de teste oficiais Receita Federal ---

export interface CasoTeste {
  nome: string;
  salario: number;
  dependentes: number;
  inssManual?: number;
  irEsperado: number | null;
  observacao: string;
}

export const CASOS_TESTE: CasoTeste[] = [
  {
    nome: 'João',
    salario: 3036.00,
    dependentes: 0,
    irEsperado: 0,
    observacao: 'Base simplificado ≈ R$ 2.428,80 → faixa isenta ou redutor zera o imposto',
  },
  {
    nome: 'José',
    salario: 4000.00,
    dependentes: 0,
    irEsperado: 0,
    observacao: 'Imposto apurado R$ 114,76 (com tabela 2026 correta), reduzido a 0 pelo redutor',
  },
  {
    nome: 'Maria',
    salario: 5000.00,
    dependentes: 0,
    irEsperado: 0,
    observacao: 'Imposto apurado R$ 312,89 (com tabela 2026 correta), zerado pelo redutor máximo',
  },
  {
    nome: 'Rita',
    salario: 6000.00,
    dependentes: 0,
    inssManual: 649.60, // INSS fornecido pelo exemplo oficial; substituir por cálculo automático após confirmar tabela 2026
    irEsperado: 382.88,
    observacao: 'TESTE-CHAVE: INSS=649,60 → imposto=562,63 → redutor=179,75 → final=382,88',
  },
  {
    nome: 'Vera',
    salario: 7607.20,
    dependentes: 0,
    irEsperado: null, // valor exato depende da tabela IRRF 2026 confirmada
    observacao: 'RTB=7.607,20 > 7.350 → sem redutor; base simplificado deve ser exatamente R$ 7.000,00',
  },
];

export interface ResultadoTeste {
  nome: string;
  passou: boolean;
  irFinal: number;
  irEsperado: number | null;
  detalhes: ResultadoIR2026;
  erro?: string;
}

export function runTestes(): ResultadoTeste[] {
  return CASOS_TESTE.map((caso) => {
    const resultado = calcularIR2026({
      salarioBruto: caso.salario,
      dependentes: caso.dependentes,
      inssManual: caso.inssManual,
    });

    let passou = true;
    let erro: string | undefined;

    if (caso.irEsperado !== null) {
      if (Math.abs(resultado.irFinal - caso.irEsperado) > 0.02) {
        passou = false;
        erro = `IR esperado R$ ${caso.irEsperado.toFixed(2)} | obtido R$ ${resultado.irFinal.toFixed(2)} | diff R$ ${Math.abs(resultado.irFinal - caso.irEsperado).toFixed(2)}`;
      }
    } else if (caso.nome === 'Vera') {
      const erros: string[] = [];
      if (Math.abs(resultado.baseSimplificado - 7000) > 0.02) {
        erros.push(`Base simplificado esperada R$ 7.000,00, obtida R$ ${resultado.baseSimplificado.toFixed(2)}`);
      }
      if (resultado.reducao !== 0) {
        erros.push(`Redutor deveria ser R$ 0,00, obtido R$ ${resultado.reducao.toFixed(2)}`);
      }
      if (erros.length > 0) {
        passou = false;
        erro = erros.join(' | ');
      }
    }

    return {
      nome: caso.nome,
      passou,
      irFinal: resultado.irFinal,
      irEsperado: caso.irEsperado,
      detalhes: resultado,
      erro,
    };
  });
}

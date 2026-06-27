export type CategoriaCalculadora = 'investimentos' | 'trabalhista' | 'impostos' | 'credito';

export interface Calculadora {
  nome: string;
  slug: string;
  descricao: string;
  categoria: CategoriaCalculadora;
  icone: string;
  ativa: boolean;
}

export const calculadoras: Calculadora[] = [
  {
    nome: 'Juros Compostos',
    slug: 'juros-compostos',
    descricao: 'Calcule o rendimento de seus investimentos com juros compostos.',
    categoria: 'investimentos',
    icone: 'trending-up',
    ativa: true,
  },
  {
    nome: 'Salário Líquido',
    slug: 'salario-liquido',
    descricao: 'Descubra seu salário líquido após descontos de INSS e IRRF.',
    categoria: 'trabalhista',
    icone: 'wallet',
    ativa: false,
  },
  {
    nome: 'Simulador de Financiamento',
    slug: 'simulador-de-financiamento',
    descricao: 'Simule parcelas e custo total de financiamentos imobiliários e veiculares.',
    categoria: 'credito',
    icone: 'home',
    ativa: false,
  },
  {
    nome: 'IRRF',
    slug: 'irrf',
    descricao: 'Calcule o Imposto de Renda Retido na Fonte sobre seu salário.',
    categoria: 'impostos',
    icone: 'file-text',
    ativa: false,
  },
  {
    nome: 'Correção pela Inflação',
    slug: 'correcao-pela-inflacao',
    descricao: 'Corrija valores monetários pela inflação usando índices oficiais.',
    categoria: 'investimentos',
    icone: 'bar-chart',
    ativa: false,
  },
  {
    nome: 'Rentabilidade Real',
    slug: 'rentabilidade-real',
    descricao: 'Calcule a rentabilidade real de seus investimentos descontando a inflação.',
    categoria: 'investimentos',
    icone: 'percent',
    ativa: false,
  },
];

export interface ParametrosJurosCompostos {
  valorInicial: number;
  aporteMensal: number;
  taxaJuros: number; // annual percentage, e.g. 12 for 12%
  periodo: number; // in months
}

export interface EvolucaoMensal {
  mes: number;
  aporte: number;
  juros: number;
  acumulado: number;
}

export interface ResultadoJurosCompostos {
  montanteFinal: number;
  totalInvestido: number;
  totalJuros: number;
  evolucaoMensal: EvolucaoMensal[];
}

export function calcularJurosCompostos(params: ParametrosJurosCompostos): ResultadoJurosCompostos {
  const { valorInicial, aporteMensal, taxaJuros, periodo } = params;

  const taxaMensal = Math.pow(1 + taxaJuros / 100, 1 / 12) - 1;

  const evolucaoMensal: EvolucaoMensal[] = [];
  let acumulado = valorInicial;

  for (let mes = 1; mes <= periodo; mes++) {
    const saldoAntes = acumulado + aporteMensal;
    const juros = saldoAntes * taxaMensal;
    acumulado = saldoAntes + juros;

    evolucaoMensal.push({
      mes,
      aporte: mes === 1 ? valorInicial + aporteMensal : aporteMensal,
      juros: Math.round(juros * 100) / 100,
      acumulado: Math.round(acumulado * 100) / 100,
    });
  }

  const totalInvestido = valorInicial + aporteMensal * periodo;
  const montanteFinal = Math.round(acumulado * 100) / 100;
  const totalJuros = Math.round((montanteFinal - totalInvestido) * 100) / 100;

  return {
    montanteFinal,
    totalInvestido,
    totalJuros,
    evolucaoMensal,
  };
}

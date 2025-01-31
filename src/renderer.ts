interface TWindow extends Window {
  [key: string]: any;
  versions: {
    [key: string]: () => string;
  };
}

const w = window as unknown as TWindow;
const btn = document.getElementById('calculateBtn');

if (btn) {
  // Evento de clique no botão "Calcular"
  btn.addEventListener('click', calculateAverageRate);

  // Exemplo de função (fake) para obter taxa média do BCB
  async function fetchAverageRateFromBCB(
    startDate: string,
    financingCode: string
  ) {
    const data = await w.fetchBCB.fetch({
      codSegmento: '1',
      codModalidade: financingCode,
      tipoModalidade: 'D',
      periodo: startDate,
    });

    return data;
  }

  // Função principal de cálculo
  async function calculateAverageRate() {
    const startDate = (document.getElementById('startDate') as HTMLInputElement)
      ?.value;
    const financingCode = (
      document.getElementById('financingType') as HTMLInputElement
    )?.value;
    const contractRateStr = (
      document.getElementById('contractRate') as HTMLInputElement
    )?.value;
    const resultDiv = document.getElementById('result');

    if (!resultDiv) return;

    // Limpa resultado a cada novo cálculo
    resultDiv.textContent = '';

    // Verificações básicas
    if (!startDate) {
      resultDiv.textContent = 'Por favor, selecione a data inicial.';
      return;
    }

    if (!contractRateStr) {
      resultDiv.textContent = 'Por favor, insira a taxa de juros do contrato.';
      return;
    }

    const contractRate = parseFloat(contractRateStr);

    if (isNaN(contractRate)) {
      resultDiv.textContent =
        'Taxa de juros inválida. Digite um número válido.';
      return;
    }

    try {
      if (!btn) return;

      btn.innerText = 'Carregando';
      btn.setAttribute('disabled', '');

      // 1) Buscar a taxa média no período (simulada)
      const averageRate = await fetchAverageRateFromBCB(
        startDate,
        financingCode
      );

      btn.removeAttribute('disabled');
      btn.innerText = 'Calcular';

      // 2) Calcular se a taxa do contrato está 50% acima da média
      const limiarAbusivo = 1.5 * averageRate;

      // Montando mensagem de resultado
      let mensagem = `• Período inicial: ${startDate}\n`;
      mensagem += `• Código do Financiamento: ${financingCode}\n\n`;
      mensagem += `Taxa média do período (simulada): ${averageRate.toFixed(2)}% ao mês.\n`;
      mensagem += `Taxa do contrato: ${contractRate.toFixed(2)}% ao mês.\n\n`;

      if (contractRate > limiarAbusivo) {
        mensagem +=
          'Resultado: A taxa do contrato está mais de 50% acima da média (ABUSIVA).';
      } else {
        mensagem +=
          'Resultado: A taxa do contrato NÃO está 50% acima da média.';
      }

      resultDiv.textContent = mensagem;
    } catch (error) {
      console.error(error);
      resultDiv.textContent = 'Ocorreu um erro ao buscar dados do BCB.';
    }
  }
}

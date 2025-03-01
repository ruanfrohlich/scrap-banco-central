import {
  ChangeEventHandler,
  FormEventHandler,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { IForm, IUpdaterObject } from 'types';
import { UpdaterModal } from './components';

export function App() {
  const [formData, setFormData] = useState<IForm>({
    contractRate: 0,
    financingType: 401101,
    startDate: new Date().toISOString(),
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [updateDetails, setUpdateDetails] = useState<IUpdaterObject>();
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const resultDiv = useRef<HTMLDivElement>(null);
  const [appVersion, setAppVersion] = useState<string>('');

  const setValue: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (
    evt
  ) => {
    const { id, value } = evt.target as HTMLInputElement;

    setFormData((state) => {
      return {
        ...state,
        [id]: value,
      };
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();

    calculateAverageRate();
  };

  async function fetchAverageRateFromBCB(
    startDate: string,
    financingCode: string
  ) {
    const data = await window.electronAPI.fetchBCB({
      codSegmento: '1',
      codModalidade: financingCode,
      tipoModalidade: 'D',
      periodo: startDate,
    });

    return data;
  }

  async function calculateAverageRate() {
    if (!resultDiv.current) return;

    // Limpa resultado a cada novo cálculo
    resultDiv.current.textContent = '';

    // Verificações básicas
    if (!formData.startDate) {
      resultDiv.current.textContent = 'Por favor, selecione a data inicial.';
      return;
    }

    if (!formData.contractRate) {
      resultDiv.current.textContent =
        'Por favor, insira a taxa de juros do contrato.';
      return;
    }

    const contractRate = parseFloat(formData.contractRate.toString());

    if (isNaN(contractRate)) {
      resultDiv.current.textContent =
        'Taxa de juros inválida. Digite um número válido.';
      return;
    }

    try {
      setLoading(true);

      // 1) Buscar a taxa média no período (simulada)
      const averageRate = await fetchAverageRateFromBCB(
        formData.startDate,
        formData.financingType.toString()
      );

      // 2) Calcular se a taxa do contrato está 50% acima da média
      const limiarAbusivo = 1.5 * averageRate;

      // Montando mensagem de resultado
      let mensagem = `• Período inicial: ${formData.startDate}<br>`;
      mensagem += `• Código do Financiamento: ${formData.financingType}<br><br>`;
      mensagem += `Taxa média do período (simulada): ${averageRate.toFixed(2)}% ao mês.<br><br>`;
      mensagem += `Taxa do contrato: ${contractRate.toFixed(2)}% ao mês.<br>`;

      if (contractRate > limiarAbusivo) {
        mensagem +=
          'Resultado: A taxa do contrato está mais de 50% acima da média (ABUSIVA).';
      } else {
        mensagem +=
          'Resultado: A taxa do contrato NÃO está 50% acima da média.';
      }

      resultDiv.current.innerHTML = mensagem;

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      resultDiv.current.textContent = 'Ocorreu um erro ao buscar dados do BCB.';
    }
  }

  useLayoutEffect(() => {
    const { onUpdate, onMessage, getAppVersion, onAppVersion } =
      window.electronAPI;
    getAppVersion();

    onMessage((message) => {
      console.log(message);
    });

    onUpdate((details) => {
      console.log(details);

      setUpdateDetails(details);
    });

    onAppVersion((version) => setAppVersion(version));
  }, []);

  return (
    <main className="flex justify-center w-[100vw] h-[100vh]">
      <p className="fixed bottom-0 left-2.5">Version: {appVersion}</p>
      {updateDetails && !closeModal && (
        <UpdaterModal
          onClose={() => setCloseModal(true)}
          details={updateDetails}
          oldVersion={appVersion}
        />
      )}
      <div className="p-2 pt-[120px] max-w-[400px] my-0 mx-auto">
        <h1 className="text-2xl mb-4">Calculadora de Taxas de Juros</h1>
        <form noValidate onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col">
              <label className="text-[12px] uppercase" htmlFor="startDate">
                Data Inicial:
              </label>
              <input
                className="py-1 px-2 rounded border border-gray-800 focus:outline-0 focus:shadow-lg transition"
                type="date"
                id="startDate"
                onChange={setValue}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[12px] uppercase" htmlFor="financingType">
                Tipo de Financiamento (Código no BCB):
              </label>
              <select
                className="py-1 px-2 rounded border border-gray-800 focus:outline-0 focus:shadow-lg transition"
                id="financingType"
                onChange={setValue}
              >
                <option value="401101">Financiamento de Veículos</option>
                <option value="402201">
                  Aquisição de outros bens - Pré-fixado
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[12px] uppercase" htmlFor="contractRate">
                Taxa de Juros do Contrato (% ao mês):
              </label>
              <input
                className="py-1 px-2 rounded border border-gray-800 focus:outline-0 focus:shadow-lg transition"
                type="number"
                id="contractRate"
                step="0.01"
                placeholder="Ex: 2.50"
                onChange={setValue}
              />
            </div>
          </div>
          <button
            className="rounded-2xl bg-blue-500 text-white font-bold px-3 py-1 disabled:pointer-events-none disabled:bg-gray-500"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Calculando' : 'Calcular'}
          </button>
        </form>
        <div ref={resultDiv} className="flex flex-col"></div>
      </div>
    </main>
  );
}

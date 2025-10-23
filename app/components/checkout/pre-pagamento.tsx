import { criarPreferenciaPagamento } from '@/app/services/checkout';
import { addEndereco, getEnderecos, updateEndereco } from '@/app/services/enderecos';
import { calculoFrete } from '@/app/services/frete';
import React, { useState, useEffect, useCallback, useMemo } from 'react';


// --- Interfaces de Tipagem (Adaptar conforme sua API) ---
interface Endereco {
  id: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  estado: string;
  is_padrao: boolean;
  // Outros campos relevantes...
}

interface FreteOpcao {
  nome: string;
  prazo: string;
  valor: number;
}

interface CheckoutProps {
  // Simulação de dados do produto/plano
  plano_id: "PLANO_MENSAL" | "PLANO_ANUAL";
  box_id: string;
  nome_box: string;
  valor_box: number; // Ex: R$300.00
  token: string; // Token de autenticação do usuário
}

// --- Componente de Formulário de Endereço ---
interface EnderecoFormProps {
  onSave: (endereco: Omit<Endereco, 'id'>) => Promise<void>;
  enderecoInicial?: Endereco | null;
  onCancel: () => void;
}

const EnderecoForm: React.FC<EnderecoFormProps> = ({ onSave, enderecoInicial, onCancel }) => {
  const [formData, setFormData] = useState({
    rua: enderecoInicial?.rua || '',
    cep: enderecoInicial?.cep || '',
    numero: enderecoInicial?.numero || '',
    bairro: enderecoInicial?.bairro || '',
    complemento: enderecoInicial?.complemento || '',
    cidade: enderecoInicial?.cidade || '',
    estado: enderecoInicial?.estado || '',
    is_padrao: enderecoInicial?.is_padrao || false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      alert('Houve um erro ao salvar o endereço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Lógica para buscar o CEP (omito aqui, mas seria ideal integrar com ViaCEP ou similar)

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <input name="cep" value={formData.cep} onChange={handleChange} placeholder="CEP" required style={{ width: '100%', margin: '5px 0', padding: '10px' }} />
      <input name="rua" value={formData.rua} onChange={handleChange} placeholder="Rua" required style={{ width: '100%', margin: '5px 0', padding: '10px' }} />
      <div style={{ display: 'flex', gap: '10px' }}>
        <input name="numero" value={formData.numero} onChange={handleChange} placeholder="Número" required style={{ flex: 1, margin: '5px 0', padding: '10px' }} />
        <input name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Complemento" style={{ flex: 1, margin: '5px 0', padding: '10px' }} />
      </div>
      <input name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Bairro" required style={{ width: '100%', margin: '5px 0', padding: '10px' }} />
      <div style={{ display: 'flex', gap: '10px' }}>
        <input name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Cidade" required style={{ flex: 1, margin: '5px 0', padding: '10px' }} />
        <input name="estado" value={formData.estado} onChange={handleChange} placeholder="Estado" required style={{ width: 100, margin: '5px 0', padding: '10px' }} />
      </div>

      <label style={{ display: 'block', margin: '10px 0' }}>
        <input
          type="checkbox"
          name="is_padrao"
          checked={formData.is_padrao}
          onChange={handleChange}
          style={{ marginRight: '5px' }}
        />
        Salvar endereço para futuras compras
      </label>

      <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'flex-end' }}>
        {enderecoInicial && (
          <button type="button" onClick={onCancel} style={{ backgroundColor: '#ccc', color: 'black', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px' }}>
            Cancelar
          </button>
        )}
        <button type="submit" disabled={loading} style={{ backgroundColor: '#F0A500', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px' }}>
          {loading ? 'Salvando...' : 'Avançar'}
        </button>
      </div>
    </form>
  );
};

// --- Componente Principal de Checkout ---
const CheckoutPrePagamento: React.FC<CheckoutProps> = ({ plano_id, box_id, nome_box, valor_box, token }) => {
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<Endereco | null>(null);
  const [modoEdicao, setModoEdicao] = useState<'novo' | 'editar' | null>(null);
  const [fretes, setFretes] = useState<FreteOpcao[]>([]);
  const [freteSelecionado, setFreteSelecionado] = useState<FreteOpcao | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingFrete, setLoadingFrete] = useState(false);
  const [erro, setErro] = useState<string | null>(null); // Para erros globais

  // Função para garantir que todos os campos de Endereço sejam mapeados corretamente
  const mapEnderecoToService = (data: Omit<Endereco, 'id'> | Endereco): [string, string, string, string, string, string, string, boolean] => {
    return [
      data.cep,
      data.rua,
      data.numero,
      data.bairro,
      data.complemento,
      data.cidade,
      data.estado,
      data.is_padrao,
    ];
  };

  // --- 1. Lógica de Endereços ---
  const fetchEnderecos = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const data = await getEnderecos(token);
      setEnderecos(data);
      
      // Tenta manter o selecionado, senão pega o padrão ou o primeiro
      const manterSelecionado = enderecoSelecionado ? data.find((e: Endereco) => e.id === enderecoSelecionado.id) : null;
      const padrao = manterSelecionado || data.find((e: Endereco) => e.is_padrao) || data[0];
      
      if (padrao) {
        setEnderecoSelecionado(padrao);
      } else {
        setEnderecoSelecionado(null);
        if (data.length === 0) {
            setModoEdicao('novo'); // Se não tiver endereços, força a adição
        }
      }
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
      setErro('Não foi possível carregar seus endereços. Tente recarregar a página.');
    } finally {
      setLoading(false);
    }
  }, [token, enderecoSelecionado]); // Adicionado enderecoSelecionado para atualização correta após edição/adição

  useEffect(() => {
    fetchEnderecos();
  }, [fetchEnderecos]);

  const handleSaveEndereco = async (formData: Omit<Endereco, 'id'>) => {
    // Note: Os serviços esperam a ordem: cep, rua, numero, bairro, complemento, cidade, estado, is_padrao
    const params = mapEnderecoToService(formData);
    
    try {
      // Verifica se está editando ou adicionando
      if (modoEdicao === 'editar' && enderecoSelecionado) {
        // updateEndereco(token, id, ...params)
        await updateEndereco(token, enderecoSelecionado.id, ...params);
      } else {
        // addEndereco(token, ...params)
        await addEndereco(token, ...params);
      }
      setModoEdicao(null);
      await fetchEnderecos(); // Recarrega a lista para atualizar o estado
    } catch (error) {
      throw error; // Deixa o erro ser tratado no EnderecoForm
    }
  };

  // --- 2. Lógica de Frete ---
  const calcularFrete = useCallback(async (cep: string) => {
    if (!cep) return;
    setLoadingFrete(true);
    setFretes([]);
    setFreteSelecionado(null);
    try {
      const data = await calculoFrete(cep);
      // Assumindo que data é FreteOpcao[]
      setFretes(data); 
      if (data.length > 0) {
        setFreteSelecionado(data[0]); // Seleciona o primeiro por padrão
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      setErro('Não foi possível calcular o frete para este CEP.');
      setFretes([]);
    } finally {
      setLoadingFrete(false);
    }
  }, []);

  useEffect(() => {
    if (enderecoSelecionado) {
      calcularFrete(enderecoSelecionado.cep);
    }
  }, [enderecoSelecionado, calcularFrete]);

  // --- 3. Lógica de Finalização e Resumo ---
  const valorTotal = useMemo(() => {
    return valor_box + (freteSelecionado?.valor || 0);
  }, [valor_box, freteSelecionado]);

  const handleFinalizarPagamento = async () => {
    if (!enderecoSelecionado || !freteSelecionado) {
      alert('Selecione um endereço e uma opção de frete para continuar.');
      return;
    }

    try {
      // Chamada ao serviço de checkout
      const response = await criarPreferenciaPagamento(
        token,
        plano_id,
        box_id,
        enderecoSelecionado.id,
        freteSelecionado.valor 
      );

      // Assumindo que o serviço retorna uma URL para redirecionamento (Stripe Checkout)
      if (response.url) {
        window.location.href = response.url;
      } else {
        alert('Pagamento iniciado com sucesso, mas sem URL de redirecionamento. Verifique o console.');
        console.log(response);
      }
    } catch (error) {
      console.error('Erro ao iniciar pagamento:', error);
      alert('Ocorreu um erro ao iniciar o processo de pagamento. Tente novamente.');
    }
  };

  // Função utilitária para formatar valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // --- Renderização do Checkout ---

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando informações do checkout...</div>;
  }

  if (erro && !enderecos.length) {
    return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>{erro}</div>;
  }
  
  // Condição para mostrar o topo do checkout mesmo que precise adicionar endereço
  const showFormOnly = !enderecos.length && modoEdicao === 'novo';

  // --- Colunas de Layout ---
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Aqui você incluiria o HEADER (Checkout Pré Pagamento) */}
      <div style={{ padding: '10px 0', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
         <h1 style={{ margin: 0, fontSize: '24px' }}>CHECKOUT PRÉ PAGAMENTO</h1>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>

        {/* --- Coluna 1: Endereço de entrega --- */}
        <section style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px', minHeight: '400px' }}>
          <h2>Endereço de entrega:</h2>
          
          {/* Se estiver no modo de adicionar/editar, mostra o formulário */}
          {modoEdicao && (
            <EnderecoForm
              onSave={handleSaveEndereco}
              onCancel={() => setModoEdicao(null)}
              enderecoInicial={modoEdicao === 'editar' ? enderecoSelecionado : null}
            />
          )}

          {/* Se não estiver editando e houver endereços salvos */}
          {!modoEdicao && enderecos.length > 0 && (
            <>
              {enderecos.map(endereco => (
                <div
                  key={endereco.id}
                  onClick={() => setEnderecoSelecionado(endereco)}
                  style={{
                    padding: '15px',
                    margin: '10px 0',
                    border: endereco.id === enderecoSelecionado?.id ? '2px solid #F0A500' : '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <input
                    type="radio"
                    name="endereco"
                    checked={endereco.id === enderecoSelecionado?.id}
                    onChange={() => setEnderecoSelecionado(endereco)}
                    style={{ position: 'absolute', top: '15px', left: '15px' }}
                  />
                  <div style={{ marginLeft: '30px' }}>
                    <strong style={{ display: 'block' }}>Endereço salvo</strong>
                    <span style={{ fontSize: '0.9em' }}>
                        {endereco.rua}, {endereco.numero} {endereco.complemento ? `- ${endereco.complemento}` : ''}, {endereco.bairro}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.9em' }}>
                        {endereco.cidade} - {endereco.estado}, CEP: {endereco.cep}
                    </span>
                  </div>
                  {endereco.id === enderecoSelecionado?.id && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); setModoEdicao('editar'); }} 
                        style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '12px' }}>
                      Editar
                    </button>
                  )}
                </div>
              ))}
              
              <button onClick={() => setModoEdicao('novo')} style={{ background: 'none', border: 'none', color: '#F0A500', cursor: 'pointer', marginTop: '10px', padding: 0 }}>
                + Adicionar um novo endereço
              </button>
            </>
          )}

          {/* Botão de Avançar da coluna de Endereço - Exibido apenas se não estiver editando */}
          {!modoEdicao && enderecos.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => { /* Ação de avançar - Opcional, pode ser implícito */ }}
                disabled={!enderecoSelecionado}
                style={{ backgroundColor: '#F0A500', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px', opacity: enderecoSelecionado ? 1 : 0.5 }}
              >
                Avançar
              </button>
            </div>
          )}
        </section>

        {/* --- Coluna 2: Frete --- */}
        <section style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px', opacity: showFormOnly ? 0.5 : 1, pointerEvents: showFormOnly ? 'none' : 'auto' }}>
          <h2>Frete:</h2>
          {!enderecoSelecionado && <p>Selecione ou adicione um endereço para calcular o frete.</p>}
          {enderecoSelecionado && (
            <>
              <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                Informe seu cep: <strong>{enderecoSelecionado.cep}</strong>
              </div>

              {loadingFrete && <p>Calculando opções de frete...</p>}

              {!loadingFrete && fretes.length > 0 && (
                <div>
                  {fretes.map((frete, index) => (
                    <div
                      key={index}
                      onClick={() => setFreteSelecionado(frete)}
                      style={{
                        padding: '10px',
                        margin: '5px 0',
                        border: frete.nome === freteSelecionado?.nome ? '2px solid #F0A500' : '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="frete"
                        checked={frete.nome === freteSelecionado?.nome}
                        onChange={() => setFreteSelecionado(frete)}
                        style={{ marginRight: '10px' }}
                      />
                      <strong style={{ display: 'block' }}>{frete.nome}</strong>
                      <span style={{ fontSize: '0.9em' }}>
                        Até {frete.prazo} - {formatCurrency(frete.valor)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {!loadingFrete && fretes.length === 0 && enderecoSelecionado && (
                <p style={{ color: 'orange' }}>Nenhuma opção de frete encontrada para o CEP **{enderecoSelecionado.cep}**.</p>
              )}
            </>
          )}

          {/* Botão de Avançar da coluna de Frete */}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => { /* Ação de avançar - Opcional, pode ser implícito */ }}
              disabled={!freteSelecionado}
              style={{ backgroundColor: '#F0A500', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px', opacity: freteSelecionado ? 1 : 0.5 }}
            >
              Avançar
            </button>
          </div>
        </section>

        {/* --- Coluna 3: Resumo Financeiro --- */}
        <section style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Resumo financeiro:</h2>

          <div style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '10px', display: 'flex', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
            {/* Imagem da Box (Placeholder) */}
            <div style={{ width: '60px', height: '60px', backgroundColor: '#d0d0d0', marginRight: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              📦
            </div>
            <strong>{nome_box}</strong>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Valor da box:</span> 
                <strong>{formatCurrency(valor_box)}</strong>
            </p>
            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Valor do frete:</span>
                <strong style={{ color: freteSelecionado ? 'green' : 'gray' }}>
                    {freteSelecionado ? formatCurrency(freteSelecionado.valor) : 'Aguardando frete'}
                </strong>
            </p>
            <hr style={{ border: 'none', borderTop: '2px solid #333', margin: '15px 0' }} />
            <h3 style={{ display: 'flex', justifyContent: 'space-between', margin: 0 }}>
                <span>Valor total:</span> 
                <span style={{ color: '#F0A500' }}>{formatCurrency(valorTotal)}</span>
            </h3>
          </div>

          {/* Botão Finalizar Pagamento */}
          <div style={{ marginTop: '30px' }}>
            <button
              onClick={handleFinalizarPagamento}
              disabled={!enderecoSelecionado || !freteSelecionado}
              style={{
                backgroundColor: '#F0A500',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                width: '100%',
                fontWeight: 'bold',
                fontSize: '1.1em',
                borderRadius: '4px',
                transition: 'opacity 0.2s',
                opacity: (enderecoSelecionado && freteSelecionado) ? 1 : 0.5
              }}
            >
              Finalizar pagamento
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CheckoutPrePagamento;
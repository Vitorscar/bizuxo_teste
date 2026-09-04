// js/pagamentos.js

/**
 * Cria a Ordem de Serviço e inicia o fluxo de pagamento (ex: gera QR Code Pix)
 * @param {string} demandId 
 * @param {string} proposalId 
 * @returns {Promise<object>} Dados da ordem e link/instruções de pagamento
 */
export async function criarOrdemServico(demandId, proposalId) {
  const { data, error } = await supabase.functions.invoke('criar-ordem-servico', {
    body: { demandId, proposalId }
  });
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Prestador confirma que chegou e inicia o serviço
 * @param {string} orderId 
 * @param {string} codigoInicio (4 dígitos)
 */
export async function confirmarInicioServico(orderId, codigoInicio) {
  const { data, error } = await supabase.functions.invoke('confirm-start', {
    body: { orderId, codigo: codigoInicio }
  });
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Prestador solicita a finalização e gera o código de fim
 * @param {string} orderId 
 */
export async function solicitarFinalizacao(orderId) {
  const { data, error } = await supabase.functions.invoke('request-finish', {
    body: { orderId }
  });
  if (error) throw new Error(error.message);
  return data; // Retorna { codigo_fim: "1234" }
}

/**
 * Cliente digita o código de fim para liberar o pagamento
 * @param {string} orderId 
 * @param {string} codigoFim (4 dígitos)
 */
export async function confirmarFinalizacao(orderId, codigoFim) {
  const { data, error } = await supabase.functions.invoke('confirm-finish', {
    body: { orderId, codigo: codigoFim }
  });
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Regenera um código perdido (tipo: 'inicio' ou 'fim')
 * @param {string} orderId 
 * @param {string} tipo 
 */
export async function regenerarCodigo(orderId, tipo) {
  const { data, error } = await supabase.functions.invoke('regenerate-code', {
    body: { orderId, tipo }
  });
  if (error) throw new Error(error.message);
  return data; // Retorna { novo_codigo: "5678" }
}

/**
 * Cliente ou prestador reporta um problema antes da liberação do pagamento
 * @param {string} orderId 
 * @param {string} motivo 
 */
export async function reportarDisputa(orderId, motivo) {
  const { data, error } = await supabase.functions.invoke('report-dispute', {
    body: { orderId, motivo }
  });
  if (error) throw new Error(error.message);
  return data;
}
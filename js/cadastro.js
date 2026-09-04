// ============================================
// CADASTRO.JS - Versão Final e Corrigida
// ============================================

// 1. INICIALIZAÇÃO DO SUPABASE
const SUPABASE_URL = 'https://kwshthfbhzjaxyaoiokz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_FfZrSfdOE-hqUGhBTccTIg_ww8QnWxb';
  
// Cria o cliente Supabase globalmente (só se ainda não existir)
if (!window.supabaseClient) {
    try {
        if (window.supabase && window.supabase.createClient) {
            window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase inicializado com sucesso');
        } else {
            console.error('❌ Biblioteca Supabase não carregada');
        }
    } catch (error) {
        console.error('❌ Erro ao inicializar Supabase:', error);
    }
} else {
    console.log('✅ Supabase já estava inicializado (via supabase-cliente.js)');
}

// 2. VARIÁVEIS GLOBAIS
window.currentType = 'PF';
window.selectedServices = [];
window.selectedRegions = [];

// ============================================
// 3. FUNÇÕES DE INTERFACE
// ============================================

function selectType(element, type) {
    window.currentType = type;
    document.querySelectorAll('.type-card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    
    const fieldsPF = document.getElementById('fields-pf');
    const fieldsPJ = document.getElementById('fields-pj');
    if (fieldsPF && fieldsPJ) {
        fieldsPF.style.display = type === 'PF' ? 'block' : 'none';
        fieldsPJ.style.display = type === 'PJ' ? 'block' : 'none';
    }
}

function toggleChip(element) {
    element.classList.toggle('selected');
    const serviceId = element.dataset.id;
    
    if (element.classList.contains('selected')) {
        if (!window.selectedServices.includes(serviceId)) {
            window.selectedServices.push(serviceId);
        }
    } else {
        window.selectedServices = window.selectedServices.filter(s => s !== serviceId);
    }
    updateSelectionCount();
}

function updateSelectionCount() {
    const countElement = document.getElementById('selection-count');
    if (countElement) {
        const count = window.selectedServices.length;
        if (count > 0) {
            countElement.textContent = `${count} serviço${count > 1 ? 's' : ''} selecionado${count > 1 ? 's' : ''}`;
            countElement.style.display = 'block';
            countElement.style.color = '#04572C';
        } else {
            countElement.style.display = 'none';
        }
    }
}

function adicionarRegiao() {
    const cep = document.getElementById('cep')?.value.replace(/\D/g, '') || '';
    const cidade = document.getElementById('city')?.value.trim() || '';
    const bairro = document.getElementById('neighborhood')?.value.trim() || '';
    const uf = document.getElementById('uf')?.value.trim() || '';

    if (!cidade || !bairro) {
        alert('Por favor, preencha pelo menos cidade e bairro.');
        return;
    }

    const regiao = { cep, cidade, bairro, uf };
    const regiaoExistente = window.selectedRegions.find(r => r.cidade === cidade && r.bairro === bairro);

    if (regiaoExistente) {
        alert('Esta região já foi adicionada.');
        return;
    }

    window.selectedRegions.push(regiao);
    renderizarRegioes();
    
    if (document.getElementById('cep')) document.getElementById('cep').value = '';
    if (document.getElementById('neighborhood')) document.getElementById('neighborhood').value = '';
}

function removerRegiao(index) {
    window.selectedRegions.splice(index, 1);
    renderizarRegioes();
}

function renderizarRegioes() {
    const container = document.getElementById('regions-container');
    if (!container) return;

    container.innerHTML = '';
    window.selectedRegions.forEach((regiao, index) => {
        const tag = document.createElement('div');
        tag.className = 'region-tag';
        tag.innerHTML = `
            📍 ${regiao.cidade} - ${regiao.bairro}${regiao.uf ? ' / ' + regiao.uf : ''}
            <button onclick="removerRegiao(${index})" style="background:none;border:none;color:#FF3B30;cursor:pointer;font-size:1.2rem;margin-left:4px;">×</button>
        `;
        container.appendChild(tag);
    });
}

// ============================================
// 4. MÁSCARAS DE INPUT
// ============================================

function aplicarMascaras() {
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 11);
            if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
            else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
            else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            e.target.value = v;
        });
    }

    const cnpjInput = document.getElementById('cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 14);
            if (v.length > 12) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})$/, '$1.$2.$3/$4-$5');
            else if (v.length > 8) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4})$/, '$1.$2.$3/$4');
            else if (v.length > 5) v = v.replace(/^(\d{2})(\d{3})(\d{1,3})$/, '$1.$2.$3');
            else if (v.length > 2) v = v.replace(/^(\d{2})(\d{1,3})$/, '$1.$2');
            e.target.value = v;
        });
    }

    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 11);
            if (v.length > 6) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            e.target.value = v;
        });
    }

    const cepInput = document.getElementById('zip_code') || document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 8);
            if (v.length > 5) v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
            e.target.value = v;
        });
        
        cepInput.addEventListener('blur', function() {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) buscarEndereco(cep);
        });
    }
}

// ============================================
// 5. VALIDAÇÕES
// ============================================

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    return resto === parseInt(cpf.charAt(10));
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, ''); // Remove tudo que não é dígito
    
    if (cnpj === '') return false;
    if (cnpj.length !== 14) return false;
    
    // Elimina CNPJs com todos os dígitos iguais (ex: 11.111.111/1111-11)
    if (/^(\d)\1+$/.test(cnpj)) return false;

    // Valida primeiro dígito verificador
    let soma = 0;
    let peso = 5;
    for (let i = 0; i < 12; i++) {
        soma += parseInt(cnpj.charAt(i)) * peso;
        peso--;
        if (peso < 2) peso = 9;
    }
    let resto = soma % 11;
    let dv1 = resto < 2 ? 0 : 11 - resto;
    if (parseInt(cnpj.charAt(12)) !== dv1) return false;

    // Valida segundo dígito verificador
    soma = 0;
    peso = 6;
    for (let i = 0; i < 13; i++) {
        soma += parseInt(cnpj.charAt(i)) * peso;
        peso--;
        if (peso < 2) peso = 9;
    }
    resto = soma % 11;
    let dv2 = resto < 2 ? 0 : 11 - resto;
    if (parseInt(cnpj.charAt(13)) !== dv2) return false;

    return true;
}

// ============================================
// 6. BUSCA DE ENDEREÇO (VIA CEP)
// ============================================

async function buscarEndereco(cep) {
    const cepStatus = document.getElementById('cepStatus');
    if (cepStatus) { 
        cepStatus.textContent = 'Buscando...'; 
        cepStatus.className = 'cep-status loading'; 
    }
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) throw new Error('CEP não encontrado');
        
        if (document.getElementById('city') && !document.getElementById('city').value) document.getElementById('city').value = data.localidade;
        if (document.getElementById('neighborhood') && !document.getElementById('neighborhood').value) document.getElementById('neighborhood').value = data.bairro;
        if (document.getElementById('address') && !document.getElementById('address').value) document.getElementById('address').value = data.logradouro;
        if (document.getElementById('uf') && !document.getElementById('uf').value) document.getElementById('uf').value = data.uf;
        
        if (cepStatus) { 
            cepStatus.textContent = `${data.localidade} - ${data.uf}`; 
            cepStatus.className = 'cep-status ok'; 
        }
    } catch (error) {
        if (cepStatus) { 
            cepStatus.textContent = 'CEP não encontrado'; 
            cepStatus.className = 'cep-status err'; 
        }
    }
}

// ============================================
// 7. CADASTRO FINAL
// ============================================

async function finalizarCadastro(role) {
    console.log(`Iniciando cadastro de ${role}...`);
    
    const btn = document.querySelector('.create-btn');
    if (!btn) return;
    
    if (!window.supabaseClient) {
        alert('Sistema não inicializado. Recarregue a página (Ctrl+F5).');
        return;
    }
    
    const originalText = btn.textContent;
    const isPF = window.currentType === 'PF';
    
    let nome = isPF ? (document.getElementById('full_name')?.value.trim() || '') : (document.getElementById('company_name')?.value.trim() || '');
    let documento = isPF ? (document.getElementById('cpf')?.value.replace(/\D/g, '') || '') : (document.getElementById('cnpj')?.value.replace(/\D/g, '') || '');
    let nomeFantasia = document.getElementById('trade_name')?.value.trim() || '';
    let email = document.getElementById('email')?.value.trim() || '';
    let senha = document.getElementById('senha')?.value || '';
    let whatsapp = document.getElementById('whatsapp')?.value.replace(/\D/g, '') || '';
    
    // Validações
    if (!nome) { alert('Preencha o nome.'); return; }
    if (isPF && !validarCPF(documento)) { alert('CPF inválido.'); return; }
    if (!isPF && !validarCNPJ(documento)) { alert('CNPJ inválido.'); return; }
    if (!email.includes('@')) { alert('E-mail inválido.'); return; }
    if (senha.length < 6) { alert('Senha deve ter no mínimo 6 caracteres.'); return; }
    if (role === 'prestador' && window.selectedServices.length === 0) { alert('Selecione pelo menos um serviço.'); return; }
    if (role === 'prestador' && window.selectedRegions.length === 0) { alert('Adicione pelo menos uma região de atuação.'); return; }
    
    btn.textContent = 'Criando conta...';
    btn.disabled = true;
    
    try {
        // 1. Cria o usuário na autenticação
        const { data: authData, error: authError } = await window.supabaseClient.auth.signUp({
            email: email,
            password: senha,
            options: { data: { full_name: nome, entity_type: window.currentType } }
        });
        
        if (authError) {
            console.error('❌ Erro detalhado do Supabase:', authError);
            // Traduz o erro 422 mais comum para o usuário
            let msg = authError.message;
            if (msg.includes('User already registered')) msg = 'Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.';
            if (msg.includes('Password should be at least')) msg = 'A senha deve ter pelo menos 6 caracteres.';
            throw new Error(msg);
        }
        
        if (!authData.user) throw new Error('Usuário não criado. Verifique seu e-mail para confirmação.');
        console.log('✅ Usuário criado:', authData.user.id);
        
        // 2. Prepara dados do perfil (SEM O CAMPO 'email', que causava o erro 400)
        const profileData = {
            user_id: authData.user.id,
            entity_type: window.currentType,
            is_client: role === 'cliente',
            is_provider: role === 'prestador',
            whatsapp: whatsapp,
            // Fallback inteligente para pegar o CEP seja do campo 'zip_code' ou 'cep'
            zip_code: (document.getElementById('zip_code')?.value || document.getElementById('cep')?.value)?.replace(/\D/g, '') || null,
            city: document.getElementById('city')?.value.trim() || null,
            neighborhood: document.getElementById('neighborhood')?.value.trim() || null,
            address: document.getElementById('address')?.value.trim() || null,
            uf: document.getElementById('uf')?.value.trim() || null,
            complement: document.getElementById('complement')?.value.trim() || null
        };
        
        if (isPF) {
            profileData.full_name = nome;
            profileData.cpf = documento;
        } else {
            profileData.company_name = nome;
            profileData.trade_name = nomeFantasia;
            profileData.cnpj = documento;
        }
        
        // 3. Insere o perfil no banco
        const { data: profileInsert, error: profileError } = await window.supabaseClient.from('profiles').insert(profileData).select();
        if (profileError) {
            console.error('Erro perfil:', profileError);
            throw new Error('Erro ao salvar perfil: ' + profileError.message);
        }
        console.log('✅ Perfil criado:', profileInsert);
        
        // 4. Salva as categorias (apenas prestador)
        if (role === 'prestador' && window.selectedServices.length > 0) {
            const cats = window.selectedServices.map(id => ({ provider_id: authData.user.id, category_id: parseInt(id) }));
            const { error: catError } = await window.supabaseClient.from('provider_categories').insert(cats);
            if (catError) console.warn('Aviso ao salvar serviços:', catError.message);
            else console.log('✅ Categorias salvas');
        }

        // 5. Salva as Regiões de Atuação (apenas prestador)
        if (role === 'prestador' && window.selectedRegions.length > 0) {
            const regionsToSave = window.selectedRegions.map(regiao => ({
                user_id: authData.user.id,
                city: regiao.cidade,
                neighborhood: regiao.bairro,
                zip_code: regiao.cep || null,
                uf: regiao.uf || null
            }));

            const { error: regionError } = await window.supabaseClient.from('provider_regions').insert(regionsToSave);
            if (regionError) console.warn('Aviso ao salvar regiões:', regionError.message);
            else console.log('✅ Regiões de atuação salvas com sucesso!');
        }
        
        alert('✅ Cadastro realizado com sucesso!');
        window.location.href = role === 'cliente' ? 'cliente/dashboard-cliente.html' : 'prestador/dashboard-prestador.html';
        
    } catch (error) {
        console.error('❌ Erro no cadastro:', error);
        alert('❌ Erro: ' + (error.message || 'Falha ao criar conta.'));
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// ============================================
// 8. INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 Página carregada');
    aplicarMascaras();
    updateSelectionCount();
});

// Exporta funções para uso global
window.selectType = selectType;
window.toggleChip = toggleChip;
window.finalizarCadastro = finalizarCadastro;
window.buscarEndereco = buscarEndereco;
window.adicionarRegiao = adicionarRegiao;
window.removerRegiao = removerRegiao;
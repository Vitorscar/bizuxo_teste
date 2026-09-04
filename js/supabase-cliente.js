console.log('📦 Inicializando Supabase Client...');

if (typeof window.supabase === 'undefined') {
  console.error('❌ Supabase JS library não foi carregada!');
  console.error('Verifique se o script do CDN está correto.');
} else {
  console.log('✅ Biblioteca Supabase encontrada!');

  const SUPABASE_URL = 'https://kwshthfbhzjaxyaoiokz.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_FfZrSfdOE-hqUGhBTccTIg_ww8QnWxb';

  try {
    // Cria o cliente Supabase
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // ✅ NÃO sobrescreva window.supabase — mantenha a lib intacta
    window.supabaseClient = supabaseClient;

    console.log('✅ window.supabaseClient configurado');
    console.log('✅ Supabase Client inicializado com sucesso!');

    if (!supabaseClient.auth || !supabaseClient.auth.signUp) {
      console.error('❌ ERRO CRÍTICO: O cliente Supabase não tem o método auth!');
    } else {
      console.log('✅ Cliente Supabase está funcionando corretamente!');
    }

  } catch (error) {
    console.error('❌ Erro ao criar cliente Supabase:', error);
    console.error('Detalhes:', error.message);
  }
}
const Auth = {
  _getSupabase() {
    // ✅ FORÇA O USO DA VARIÁVEL CORRETA
    const client = window.supabaseClient;
    if (!client) {
      console.error('❌ Supabase Client não encontrado. Verifique se supabase-client.js foi carregado.');
      return null;
    }
    return client;
  },

  async login(email, senha) {
    const supabase = this._getSupabase();
    if (!supabase) return { success: false, error: 'Erro de configuração. Recarregue a página.' };

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) return { success: false, error: this.traduzErro(error.message) };
      if (!data.user) return { success: false, error: 'Usuário não encontrado.' };

      const { data: perfil, error: perfilError } = await supabase
        .from('profiles')
        .select('full_name, company_name, city, entity_type, is_client, is_provider, status')
        .eq('user_id', data.user.id)
        .single();

      if (perfilError || !perfil) {
        console.error('❌ Erro ao buscar perfil:', perfilError);
        return { success: false, error: 'Não foi possível carregar seu perfil.' };
      }

      if (perfil.status === 'bloqueado') {
        await supabase.auth.signOut();
        return { success: false, error: 'Sua conta está bloqueada.' };
      }

      let destino = 'cliente/dashboard-cliente.html';
      if (perfil.is_provider) destino = 'prestador/dashboard-prestador.html';

      window.location.href = destino;
      return { success: true };
    } catch (err) {
      console.error('❌ Erro no login:', err);
      return { success: false, error: 'Erro ao fazer login.' };
    }
  },

  traduzErro(mensagem) {
    const mapa = {
      'Invalid login credentials': 'E-mail ou senha incorretos.',
      'User already registered': 'Já existe uma conta com esse e-mail.',
      'Password should be at least 6 characters': 'A senha precisa ter pelo menos 6 caracteres.',
      'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos.'
    };
    return mapa[mensagem] || mensagem;
  }
};
window.Auth = Auth;
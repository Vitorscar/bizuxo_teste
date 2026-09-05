// js/app.js

/* =============================================
   REGISTRO DO SERVICE WORKER (PWA)
============================================= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration.scope);
      })
      .catch((error) => {
        console.error('Falha ao registrar o Service Worker:', error);
      });
  });
}

/* =============================================
   BOTÃO "INSTALAR BIZUXO" (PWA)
============================================= */
let deferredPrompt;
const btnInstalar = document.getElementById('btn-instalar');

window.addEventListener('beforeinstallprompt', (e) => {
  // Previne o comportamento padrão do navegador
  e.preventDefault();
  // Salva o evento para usar depois
  deferredPrompt = e;
  // Mostra o botão de instalação
  if (btnInstalar) btnInstalar.style.display = 'block';
});

if (btnInstalar) {
  btnInstalar.addEventListener('click', async () => {
    if (deferredPrompt) {
      // Mostra o prompt de instalação
      deferredPrompt.prompt();
      // Aguarda a escolha do usuário
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('Usuário aceitou a instalação do Bizuxo');
      }
      // Limpa a variável
      deferredPrompt = null;
      btnInstalar.style.display = 'none';
    }
  });

  // Esconde o botão se o app já estiver instalado
  window.addEventListener('appinstalled', () => {
    btnInstalar.style.display = 'none';
    console.log('Bizuxo instalado com sucesso!');
  });
}

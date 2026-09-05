// Registro do Service Worker
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
// Botão de instalação
let deferredPrompt;
const btnInstalar = document.getElementById('btn-instalar');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (btnInstalar) btnInstalar.style.display = 'block';
});

if (btnInstalar) {
  btnInstalar.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('Usuário aceitou a instalação do Bizuxo');
      }
      deferredPrompt = null;
      btnInstalar.style.display = 'none';
    }
  });
}

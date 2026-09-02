// mobile-nav.js

// Função para inserir a barra de navegação automaticamente em todas as páginas
function createMobileNav() {
  const navHTML = `
    <nav class="mobile-nav" aria-label="Navegação principal">
      <a href="dashboard-cliente.html" class="mobile-nav-item" data-page="dashboard">
        <span class="nav-icon">▤</span><span>Início</span>
      </a>
      <a href="minhas-demandas.html" class="mobile-nav-item" data-page="demandas">
        <span class="nav-icon">✉</span><span>Demandas</span>
        <span class="nav-badge" id="badgeDemandas" style="display: none;">0</span>
      </a>
      <div class="mobile-nav-fab-wrapper">
        <a href="nova-demanda.html" class="mobile-nav-fab" title="Nova Demanda">+</a>
      </div>
      <a href="servicos-contratados.html" class="mobile-nav-item" data-page="servicos">
        <span class="nav-icon">🛠️</span><span>Serviços</span>
      </a>
      <a href="meu-perfil-cliente.html" class="mobile-nav-item" data-page="perfil">
        <span class="nav-icon">⚙️</span><span>Perfil</span>
      </a>
    </nav>
  `;
  document.body.insertAdjacentHTML('beforeend', navHTML);
}

// Função para marcar o link ativo com base na URL atual
function setActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'dashboard-cliente.html';
  document.querySelectorAll('.mobile-nav-item').forEach(link => {
    const page = link.getAttribute('data-page');
    if (page === 'dashboard' && currentPath === 'dashboard-cliente.html') link.classList.add('active');
    if (page === 'demandas' && currentPath.includes('demanda')) link.classList.add('active');
    if (page === 'servicos' && currentPath.includes('servico')) link.classList.add('active');
    if (page === 'perfil' && currentPath.includes('perfil')) link.classList.add('active');
  });
}

// Função toast global
function showToast(message, type = 'info') {
  // ... (mesma lógica que você já tinha)
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  createMobileNav();
  setActiveNav();
});
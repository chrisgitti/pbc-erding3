function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function loadIncludes() {
  const nodes = document.querySelectorAll('[data-include]');
  const isFileProtocol = window.location.protocol === 'file:';

  for (const node of nodes) {
    const file = node.getAttribute('data-include');
    if (!file) continue;

    if (isFileProtocol) {
      node.innerHTML = '<div class="container py-4"><div class="editor-note p-3 rounded-4">Die Include-Datei <strong>' + escHtml(file) + '</strong> ist relativ korrekt eingebunden, kann aber per <code>file:///</code> nicht geladen werden. Bitte die Seite über einen lokalen Webserver öffnen, z. B. mit <code>preview-server.ps1</code>.</div></div>';
      continue;
    }

    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error(file);
      node.innerHTML = await response.text();
    } catch (error) {
      node.innerHTML = '<div class="container py-4"><div class="editor-note p-3 rounded-4">Include konnte nicht geladen werden: <strong>' + escHtml(file) + '</strong></div></div>';
    }
  }
}

function markActiveLinks() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (href === current || (current === 'index.html' && href === './')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadIncludes();
  markActiveLinks();
});

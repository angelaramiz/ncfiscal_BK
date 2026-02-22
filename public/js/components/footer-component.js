// Footer Component - NC FiscAl
// Este componente inyecta el footer en todas las páginas

document.addEventListener('DOMContentLoaded', function() {
    // Obtener la versión del localStorage (guardada por version-checker.js)
    const currentVersion = localStorage.getItem('app_version') || '1.0.0';
    
    // Crear el HTML del footer
    const footerHTML = `
    <footer style="text-align: center; padding: 1rem; background:  #01284f; color: var(--color-white);">
        <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; flex-wrap: wrap; gap: 1rem;">
            <div>
                Derechos reservados de NC FiscAl 2026
            </div>
            <div style="font-size: 12px; opacity: 0.8;">
                v${currentVersion}
            </div>
        </div>
    </footer>
    `;
    
    // Inyectar el footer en el placeholder
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = footerHTML;
        const footerElement = wrapper.firstElementChild;
        footerPlaceholder.replaceWith(footerElement);
    }
});

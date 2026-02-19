// Footer Component - NC FiscAl
// Este componente inyecta el footer en todas las páginas

document.addEventListener('DOMContentLoaded', function() {
    // Crear el HTML del footer
    const footerHTML = `
    <footer style="text-align: center; padding: 1rem; background:  #01284f; color: var(--color-white);">
        Derechos reservados de NC FiscAl 2026
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

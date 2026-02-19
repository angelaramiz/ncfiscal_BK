// Services Navigation Component - NC FiscAl
// Este componente inyecta el menú de servicios

document.addEventListener('DOMContentLoaded', function() {
    // Detectar si estamos en index.html o en pages/
    const isIndex = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
    const isInPages = window.location.pathname.includes('/pages/');
    
    // Ajustar rutas según ubicación
    const pagesPrefix = isInPages ? './' : './pages/';
    
    // Crear el enlace de Inicio solo si NO estamos en index
    const inicioLink = (isIndex && !isInPages) ? '' : `<a href="${isInPages ? '../index.html' : './index.html'}" style="display: block; margin: 1rem 0; color: var(--color-white); text-decoration: none; font-weight: 600; transition: color 0.3s ease;" onmouseover="this.style.color='var(--color-blue-light)'" onmouseout="this.style.color='var(--color-white)'">Inicio</a>`;
    
    // Crear el HTML del menú de servicios
    const servicesNavHTML = `
    <div id="backdrop" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 50;" onclick="closeServicesMenu()"></div>
    
    <nav id="services-menu" style="display: none; position: fixed; top: 0; right: 0; height: 100vh; width: 100%; max-width: 300px; background: var(--colorcomponent); padding: 2rem 1rem; transform: translateX(100%); transition: transform 0.3s ease; z-index: 300; border-left: 4px solid var(--color-blue);">
        <button onclick="closeServicesMenu()" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: var(--color-white); font-size: 1.5rem; cursor: pointer;">✕</button>
        <h3 style="color: var(--color-blue-light); margin-bottom: 1.5rem; margin-top: 2rem;">Nuestros Servicios</h3>
        ${inicioLink}
        <a href="${pagesPrefix}asesoria-fiscal.html" style="display: block; margin: 1rem 0; color: var(--color-white); text-decoration: none; font-weight: 600; transition: color 0.3s ease;" onmouseover="this.style.color='var(--color-blue-light)'" onmouseout="this.style.color='var(--color-white)'">Asesoría Fiscal y Patrimonial</a>
        <a href="${pagesPrefix}servicios-contabilidad.html" style="display: block; margin: 1rem 0; color: var(--color-white); text-decoration: none; font-weight: 600; transition: color 0.3s ease;" onmouseover="this.style.color='var(--color-blue-light)'" onmouseout="this.style.color='var(--color-white)'">Servicios Integrados y Contabilidad</a>
        <a href="${pagesPrefix}patente-intangibles.html" style="display: block; margin: 1rem 0; color: var(--color-white); text-decoration: none; font-weight: 600; transition: color 0.3s ease;" onmouseover="this.style.color='var(--color-blue-light)'" onmouseout="this.style.color='var(--color-white)'">Patente e Intangibles</a>
        <a href="${pagesPrefix}migracion-inversion.html" style="display: block; margin: 1rem 0; color: var(--color-white); text-decoration: none; font-weight: 600; transition: color 0.3s ease;" onmouseover="this.style.color='var(--color-blue-light)'" onmouseout="this.style.color='var(--color-white)'">Migración por Inversión</a>
    </nav>
    `;

    // Insertar el menú de servicios después del header
    const body = document.body;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = servicesNavHTML;
    const header = document.querySelector('header');
    if (header) {
        header.parentNode.insertBefore(wrapper, header.nextSibling.nextSibling);
    }
});

// Funciones de control del menú de servicios
function toggleServicesMenu() {
    const menu = document.getElementById('services-menu');
    const isOpen = menu.style.transform === 'translateX(0px)';
    if (isOpen) {
        closeServicesMenu();
    } else {
        openServicesMenu();
    }
}

function openServicesMenu() {
    const menu = document.getElementById('services-menu');
    const backdrop = document.getElementById('backdrop');
    menu.style.transform = 'translateX(0)';
    menu.style.display = 'block';
    backdrop.style.display = 'block';
}

function closeServicesMenu() {
    const menu = document.getElementById('services-menu');
    const backdrop = document.getElementById('backdrop');
    menu.style.transform = 'translateX(100%)';
    backdrop.style.display = 'none';
}

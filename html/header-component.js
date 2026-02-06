// Header Component - NC FiscAl
// Este componente inyecta el header y la navegación en todas las páginas

document.addEventListener('DOMContentLoaded', function() {
    // Crear el HTML del header
    const headerHTML = `
    <header style="background-color: #01284f;">
        <div class="header-container">
            <a href="/" class="logo" style="font-family: 'PT Serif', serif; font-weight: 700; ;">NC-FiscAL</a>
            <button class="header-toggle" onclick="toggleHeader()">☰</button>
            <nav class="header-nav" id="header-nav">
                <a style="color: var(--color-orange);" href="/html/quienes-somos.html">Quiénes Somos</a>
                <a style="color: var(--color-orange);" href="/html/contactanos.html">Contáctanos</a>
                <a style="color: var(--color-orange);" href="javascript:void(0)" onclick="toggleMenu()">Servicios ▼</a>
            </nav>
        </div>
    </header>

    <div id="backdrop" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 50;" onclick="closeMenu(); closeHeader()"></div>
    
    <nav id="nav-menu" style="display: none; position: fixed; top: 0; right: 0; height: 100vh; width: 100%; max-width: 300px; background: var(--color-dark); padding: 2rem 1rem; transform: translateX(100%); transition: transform 0.3s ease; z-index: 300; border-left: 4px solid var(--color-blue);">
        <a href="/" style="display: block; margin: 1rem 0; color: var(--color-white); text-decoration: none; font-weight: 600;">Inicio</a>
        <a href="/html/asesoria-fiscal.html" style="display: block; margin: 1rem 0; color: var(--color-white); text-decoration: none; font-weight: 600;">Asesoría Fiscal y Patrimonial</a>
        <a href="/html/servicios-contabilidad.html" style="display: block; margin: 1rem 0; color: var(--color-white); text-decoration: none; font-weight: 600;">Servicios Integrados y Contabilidad</a>
        <a href="/html/patente-intangibles.html" style="display: block; margin: 1rem 0; color: var(--color-white); text-decoration: none; font-weight: 600;">Patente e Intangibles</a>
        <a href="/html/migracion-inversion.html" style="display: block; margin: 1rem 0; color: var(--color-white); text-decoration: none; font-weight: 600;">Migración por Inversión</a>
    </nav>
    `;

    // Inyectar el header al inicio del body (después de la imagen de fondo)
    const body = document.body;
    const firstChild = body.firstChild;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = headerHTML;
    body.insertBefore(wrapper.firstElementChild, firstChild.nextSibling);
    body.insertBefore(wrapper.firstElementChild, firstChild.nextSibling);
    body.insertBefore(wrapper.firstElementChild, firstChild.nextSibling);
});

// Funciones de control del menú
function toggleMenu() {
    const nav = document.getElementById('nav-menu');
    const isOpen = nav.style.transform === 'translateX(0px)';
    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    const nav = document.getElementById('nav-menu');
    const backdrop = document.getElementById('backdrop');
    nav.style.transform = 'translateX(0)';
    nav.style.display = 'block';
    backdrop.style.display = 'block';
}

function closeMenu() {
    const nav = document.getElementById('nav-menu');
    const backdrop = document.getElementById('backdrop');
    nav.style.transform = 'translateX(100%)';
    backdrop.style.display = 'none';
}

function toggleHeader() {
    const headerNav = document.getElementById('header-nav');
    const isOpen = headerNav.classList.contains('open');
    if (isOpen) {
        closeHeader();
    } else {
        openHeader();
    }
}

function openHeader() {
    const headerNav = document.getElementById('header-nav');
    const backdrop = document.getElementById('backdrop');
    headerNav.classList.add('open');
    backdrop.style.display = 'block';
}

function closeHeader() {
    const headerNav = document.getElementById('header-nav');
    const backdrop = document.getElementById('backdrop');
    headerNav.classList.remove('open');
    backdrop.style.display = 'none';
}

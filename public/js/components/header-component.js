// Header Component - NC FiscAl
// Este componente inyecta el header y la navegación en todas las páginas

document.addEventListener('DOMContentLoaded', function() {
    // Detectar si estamos en index.html o en pages/
    const isInPages = window.location.pathname.includes('/pages/');
    const indexPath = isInPages ? '../index.html' : './index.html';
    const pagesPrefix = isInPages ? './' : './pages/';
    
    // Crear el HTML del header
    const headerHTML = `
    <header style="background-color: #01284f; width: 100%; margin: 0;  box-sizing: border-box;">
        <div class="header-container">
            <a href="${indexPath}" class="logo" style="font-family: 'PT Serif', serif; font-weight: 700; color: var(--color-white); font-size: 2.5rem; text-decoration: none;">NC FiscAl</a>
            <button class="header-toggle" onclick="toggleHeader()">☰</button>
            <nav class="header-nav" id="header-nav">
                <a style="color: var(--color-orange);" href="${pagesPrefix}quienes-somos.html">Quiénes Somos</a>
                <a style="color: var(--color-orange);" href="${pagesPrefix}contactanos.html">Contáctanos</a>
                <a style="color: var(--color-orange);" href="javascript:void(0)" onclick="toggleServicesMenu()">Servicios ▼</a>
            </nav>
        </div>
    </header>
    `;

    // Inyectar el header en el placeholder
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = headerHTML;
        const headerElement = wrapper.firstElementChild;
        headerPlaceholder.replaceWith(headerElement);
    }
});

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
    headerNav.classList.add('open');
    headerNav.style.maxHeight = '300px';
}

function closeHeader() {
    const headerNav = document.getElementById('header-nav');
    headerNav.classList.remove('open');
    headerNav.style.maxHeight = '0';
}

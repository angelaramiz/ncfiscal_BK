// Background Component - NC FiscAl
// Este componente optimiza la imagen de fondo usando CSS en lugar de elementos DOM

function getBackgroundImage() {
    return '/html/src/mty.png';
}

function initializeBackground() {
    // Crear estilos CSS optimizados
    const backgroundImage = getBackgroundImage();
    const styles = document.createElement('style');
    styles.textContent = `
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('${backgroundImage}');
            background-size: cover;
            background-position: center;
            background-attachment: scroll;
            z-index: -2;
        }
        
        body::after {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 102, 204, 0.15);
            z-index: -1;
        }
    `;
    document.head.appendChild(styles);
}

// Inicializar cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBackground);
} else {
    initializeBackground();
}
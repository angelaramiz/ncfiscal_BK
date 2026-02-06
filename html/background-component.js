// Background Component - NC FiscAl
// Este componente inyecta la imagen de fondo con overlay azul en todas las páginas

document.addEventListener('DOMContentLoaded', function() {
    // Crear el HTML del fondo con overlay
    const backgroundHTML = `
        <img src="/html/src/MTY3.png" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2;">
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 102, 204, 0.15); z-index: -1;"></div>
    `;
    
    // Inyectar el fondo al inicio del body
    const body = document.body;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = backgroundHTML;
    
    // Insertar ambos elementos (imagen y overlay)
    const elements = wrapper.querySelectorAll('img, div');
    elements.forEach(el => {
        body.insertBefore(el, body.firstChild);
    });
});

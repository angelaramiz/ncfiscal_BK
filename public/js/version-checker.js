/**
 * Version Checker - Sistema de control de versión del cliente
 * Verifica UNA SOLA VEZ por carga de página si hay versión nueva disponible
 * Notifica al usuario si requiere actualizar
 */

class VersionChecker {
  constructor(options = {}) {
    this.localVersion = localStorage.getItem('app_version') || '1.0.0';
    this.apiEndpoint = options.apiEndpoint || '/api/version/check';
    this.showNotification = options.showNotification !== false; // true por defecto
    this.autoReloadDelayMs = options.autoReloadDelayMs || 10000; // 10 segundos
    this.showDelayMs = options.showDelayMs || 500; // 0.5 segundos antes de mostrar
    this.debug = options.debug || false;
    this.hasChecked = false; // Bandera para evitar múltiples verificaciones

    this.log('✓ VersionChecker inicializado');
    this.log(`Versión local: ${this.localVersion}`);
  }

  /**
   * Verifica si hay una versión nueva disponible
   * Se ejecuta UNA SOLA VEZ por carga de página
   */
  async checkForUpdates() {
    // Evitar múltiples verificaciones en la misma carga
    if (this.hasChecked) {
      this.log('Ya se verificó en esta carga de página');
      return;
    }

    this.hasChecked = true;

    try {
      this.log('🔍 Verificando actualizaciones...');

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          clientVersion: this.localVersion
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      this.log(`📥 Respuesta del servidor:`, data);

      if (data.updateAvailable) {
        this.log(`⚠️  Nueva versión disponible: ${data.latestVersion}`);
        this.handleUpdateAvailable(data);
      } else {
        this.log(`✅ Versión actualizada: ${data.latestVersion}`);
        // Actualizar versión en localStorage si está actualizada
        localStorage.setItem('app_version', data.latestVersion);
      }

      return data;
    } catch (error) {
      console.error('❌ Error verificando versión:', error);
      this.log(`❌ Error: ${error.message}`);
      return null;
    }
  }

  /**
   * Maneja cuando hay una actualización disponible
   */
  handleUpdateAvailable(data) {
    // Actualizar versión en localStorage
    localStorage.setItem('app_version', data.latestVersion);
    localStorage.setItem('last_update_check', new Date().toISOString());

    // Limpiar todos los caches del service worker
    this.clearAllCaches();

    if (this.showNotification) {
      // Mostrar notificación después del delay
      setTimeout(() => {
        this.showUpdateModal(data);
      }, this.showDelayMs);
    }
  }

  /**
   * Limpia todos los caches del service worker
   */
  async clearAllCaches() {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        this.log(`🗑️ Limpiando ${cacheNames.length} caches...`);
        
        // Eliminar todos los caches
        await Promise.all(
          cacheNames.map(cacheName => {
            this.log(`  Eliminando cache: ${cacheName}`);
            return caches.delete(cacheName);
          })
        );
        this.log('✅ Todos los caches han sido eliminados');
      }
    } catch (error) {
      this.log(`⚠️ Error limpiando caches: ${error.message}`);
    }

    // Actualizar service worker
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        this.log(`Actualizando ${registrations.length} service workers...`);
        
        registrations.forEach(async (registration) => {
          await registration.update();
          this.log(`✅ Service worker actualizado: ${registration.scope}`);
        });
      }
    } catch (error) {
      this.log(`⚠️ Error actualizando service worker: ${error.message}`);
    }
  }

  /**
   * Muestra un modal/notificación visual elegante
   */
  showUpdateModal(data) {
    // Crear overlay con animación
    const overlay = document.createElement('div');
    overlay.id = 'version-update-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      animation: fadeIn 0.3s ease-in-out;
      backdrop-filter: blur(2px);
    `;

    // Agregar animación al estilo del documento
    if (!document.getElementById('version-checker-styles')) {
      const style = document.createElement('style');
      style.id = 'version-checker-styles';
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        #version-update-modal {
          animation: slideDown 0.4s ease-out;
        }
        @media (max-width: 480px) {
          #version-update-modal {
            margin: 16px;
            max-width: calc(100% - 32px);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Crear modal con contenido
    const modal = document.createElement('div');
    modal.id = 'version-update-modal';
    modal.style.cssText = `
      background: white;
      padding: 40px;
      border-radius: 12px;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      position: relative;
    `;

    // Ícono visual
    const icon = document.createElement('div');
    icon.style.cssText = `
      font-size: 48px;
      margin-bottom: 15px;
      animation: pulse 2s infinite;
    `;
    icon.innerHTML = '✨';

    // Título
    const title = document.createElement('h2');
    title.textContent = 'Actualización Disponible';
    title.style.cssText = `
      margin: 0 0 15px;
      color: #1a1a1a;
      font-size: 24px;
      font-weight: 600;
    `;

    // Descripción
    const description = document.createElement('p');
    description.textContent = 'Se ha detectado una versión más reciente con mejoras y correcciones importantes.';
    description.style.cssText = `
      margin: 0 0 20px;
      color: #666;
      font-size: 15px;
      line-height: 1.5;
    `;

    // Comparador de versiones
    const versionBox = document.createElement('div');
    versionBox.style.cssText = `
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #51cf66;
    `;
    versionBox.innerHTML = `
      <div style="display: flex; justify-content: space-around; align-items: center;">
        <div>
          <p style="margin: 0 0 5px; font-size: 12px; color: #999; font-weight: 600;">TU VERSIÓN</p>
          <p style="margin: 0; font-size: 18px; color: #333; font-weight: bold;">${data.clientVersion}</p>
        </div>
        <div style="color: #999; font-size: 24px;">→</div>
        <div>
          <p style="margin: 0 0 5px; font-size: 12px; color: #51cf66; font-weight: 600;">NUEVA</p>
          <p style="margin: 0; font-size: 18px; color: #51cf66; font-weight: bold;">${data.latestVersion}</p>
        </div>
      </div>
    `;

    // Contador regresivo
    const countdown = document.createElement('p');
    countdown.id = 'countdown-timer';
    countdown.style.cssText = `
      margin: 15px 0 0;
      font-size: 12px;
      color: #999;
      font-weight: 500;
    `;
    const autoReloadSec = Math.floor(this.autoReloadDelayMs / 1000);
    countdown.textContent = `⏱️ Se actualizará automáticamente en ${autoReloadSec}s`;

    // Botones de acción
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 10px;
      margin-top: 25px;
    `;

    // Botón de recargar ahora
    const reloadBtn = document.createElement('button');
    reloadBtn.id = 'reload-now-btn';
    reloadBtn.textContent = '🔄 Actualizar Ahora';
    reloadBtn.style.cssText = `
      flex: 1;
      background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(81, 207, 102, 0.3);
    `;
    reloadBtn.onmouseover = () => {
      reloadBtn.style.transform = 'translateY(-2px)';
      reloadBtn.style.boxShadow = '0 6px 16px rgba(81, 207, 102, 0.4)';
    };
    reloadBtn.onmouseout = () => {
      reloadBtn.style.transform = 'translateY(0)';
      reloadBtn.style.boxShadow = '0 4px 12px rgba(81, 207, 102, 0.3)';
    };
    reloadBtn.onclick = () => {
      this.log('🔄 Usuario clickeó: Actualizar Ahora');
      
      // Limpiar caches de forma agresiva
      this.log('🗑️ Limpiando caches antes de recargar...');
      this.clearAllCaches().then(() => {
        // Forzar hard refresh después de limpiar caches
        document.body.style.opacity = '0.5';
        document.querySelectorAll('button').forEach(b => b.disabled = true);
        
        setTimeout(() => {
          this.log('♻️ Forzando hard reload (borrar cache del navegador)...');
          // Borrar cache: GET request con no-cache header
          fetch(window.location.href, { cache: 'no-store' });
          
          // Hard reload después de 300ms
          setTimeout(() => {
            window.location.href = window.location.href;
          }, 300);
        }, 300);
      });
    };

    // Botón de más tarde
    const laterBtn = document.createElement('button');
    laterBtn.id = 'reload-later-btn';
    laterBtn.textContent = 'Más Tarde';
    laterBtn.style.cssText = `
      flex: 1;
      background: #f0f0f0;
      color: #333;
      border: none;
      padding: 12px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
    `;
    laterBtn.onmouseover = () => laterBtn.style.background = '#e0e0e0';
    laterBtn.onmouseout = () => laterBtn.style.background = '#f0f0f0';
    laterBtn.onclick = () => {
      this.log('👤 Usuario pospuso la actualización');
      overlay.remove();
      clearInterval(this.countdownInterval);
    };

    // Advertencia
    const warning = document.createElement('p');
    warning.style.cssText = `
      margin: 20px 0 0;
      font-size: 12px;
      color: #999;
    `;
    warning.innerHTML = `
      ⓘ Recomendamos actualizar para disfrutar de todas las mejoras disponibles.
    `;

    // Armar el modal
    buttonContainer.appendChild(reloadBtn);
    buttonContainer.appendChild(laterBtn);

    modal.appendChild(icon);
    modal.appendChild(title);
    modal.appendChild(description);
    modal.appendChild(versionBox);
    modal.appendChild(countdown);
    modal.appendChild(buttonContainer);
    modal.appendChild(warning);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    this.log('📢 Modal de actualización mostrado');

    // Auto-reload con countdown
    let seconds = Math.floor(this.autoReloadDelayMs / 1000);
    this.countdownInterval = setInterval(() => {
      seconds--;
      const countdownEl = document.getElementById('countdown-timer');
      if (countdownEl) {
        countdownEl.textContent = `⏱️ Se actualizará automáticamente en ${seconds}s`;
      }
      if (seconds <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);

    // Auto-reload después del tiempo especificado
    setTimeout(() => {
      clearInterval(this.countdownInterval);
      // Verificar si el modal aún existe (usuario no lo cerró)
      if (document.getElementById('version-update-overlay')) {
        this.log('⏰ Auto-reload por timeout - Limpiando caches...');
        this.clearAllCaches().then(() => {
          this.log('♻️ Recargando página con cache limpio...');
          window.location.href = window.location.href;
        });
      }
    }, this.autoReloadDelayMs);
  }

  /**
   * Log condicional (solo en modo debug)
   */
  log(...args) {
    if (this.debug) {
      console.log('[VersionChecker]', ...args);
    }
  }
}

// Inicializar cuando el DOM esté listo - UNA SOLA VEZ por carga
document.addEventListener('DOMContentLoaded', () => {
  const checker = new VersionChecker({
    apiEndpoint: 'http://localhost:3000/api/version/check',
    showNotification: true,
    autoReloadDelayMs: 8000, // Recargar automáticamente después de 8 segundos
    showDelayMs: 500, // Mostrar modal después de 0.5 segundos
    debug: true // Cambiar a true para ver logs en consola
  });

  // Verificar una sola vez al cargar la página
  checker.checkForUpdates();

  // Exponerlo globalmente para acceso manual si es necesario
  window.versionChecker = checker;
});

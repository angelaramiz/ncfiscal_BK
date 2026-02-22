# 🚀 Sistema de Control de Versión con Backend API

## Arquitectura

```
┌──────────────────────┐
│   Cliente (HTML/JS)  │
│                      │
│ - Guarda versión en  │
│   localStorage       │
│ - Verifica cada 5min │
│ - Auto reload si hay │
│   versión nueva      │
└──────────────────────┘
          ↓ (POST /api/version/check)
┌──────────────────────────────────────┐
│      Backend (Express.js)            │
│                                      │
│ - GET /api/version → versión actual  │
│ - POST /api/version/check → compara  │
│ - GET /api/changelog → historial     │
│                                      │
│ Lee de: public/version.json          │
└──────────────────────────────────────┘
          ↓ (lee)
    public/version.json
```

## 📋 Instalación

### 1. Instalar dependencias

```powershell
npm install
```

Esto instala:
- **express** - Framework web
- **cors** - Permitir peticiones CORS

### 2. Iniciar el servidor

```powershell
npm start
# o
npm run dev
```

El servidor escuchará en: `http://localhost:3000`

## 🔗 Endpoints de la API

### GET /api/version
Obtiene la versión actual del sitio.

**Response:**
```json
{
  "success": true,
  "version": "1.0.1",
  "releaseDate": "2026-02-22",
  "timestamp": "2026-02-22T10:45:30.123Z"
}
```

### POST /api/version/check
Verifica si hay una versión más nueva disponible.

**Request:**
```json
{
  "clientVersion": "1.0.0"
}
```

**Response:**
```json
{
  "success": true,
  "clientVersion": "1.0.0",
  "latestVersion": "1.0.1",
  "updateAvailable": true,
  "message": "Nueva versión disponible"
}
```

### GET /api/changelog
Obtiene el historial de cambios.

**Response:**
```json
{
  "success": true,
  "changelog": [
    {
      "version": "1.0.1",
      "date": "2026-02-22T10:45:30.123Z",
      "type": "patch",
      "description": "Arreglado bug en formulario",
      "changes": []
    }
  ]
}
```

## 🔄 Workflow Completo

### 1. Hacer cambios en el código
```powershell
# Editar archivos...
git add .
```

### 2. Incrementar versión
```powershell
npm run version:patch
# o manualmente
node bump-version.js patch "Descripción del cambio"
```

Esto actualiza `public/version.json` automáticamente.

### 3. Commit y push
```powershell
git add public/version.json
git commit -m "v1.0.1: Descripción del cambio"
git push
```

### 4. El cliente automáticamente:
- ✅ Detecta la nueva versión en `public/version.json`
- ✅ Muestra notificación visual
- ✅ Recarga la página automáticamente
- ✅ Limpia el cache para obtener archivos nuevos

## ⚙️ Configuración del Cliente

El script `version-checker.js` se puede personalizar:

```javascript
const checker = new VersionChecker({
  checkInterval: 5 * 60 * 1000,  // Verificar cada 5 minutos
  apiEndpoint: '/api/version/check',
  autoReload: true,               // Recargar automáticamente
  showNotification: true,         // Mostrar modal visual
  debug: false                    // Log en consola
});
```

### Opciones disponibles:

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `checkInterval` | number | 300000 | Milisegundos entre verificaciones |
| `apiEndpoint` | string | `/api/version/check` | URL del endpoint |
| `autoReload` | boolean | true | Recargar automáticamente |
| `showNotification` | boolean | true | Mostrar notificación visual |
| `debug` | boolean | false | Logs en consola |

## 🐛 Troubleshooting

### Error: `Cannot find module 'express'`
```powershell
npm install express cors
```

### El cliente no detecta actualizaciones
1. Verificar que el servidor está corriendo: `npm start`
2. Abrir DevTools (F12) y revisar Network tab
3. Cambiar `debug: true` en `version-checker.js` para ver logs

### El cambio de versión no se refleja
1. Limpiar cache del navegador (Ctrl+Shift+Delete)
2. Forzar hard refresh (Ctrl+Shift+R)
3. O simplemente esperar a que el auto reload se active

## 📱 Implementación en Páginas Específicas

Si quieres el version checker en otras páginas, agrega esto antes del `</body>`:

```html
<script src="../js/version-checker.js"></script>
```

O crea un archivo global que se incluya en todas las páginas.

## 🔐 Seguridad (Opcional)

Para producción, considera:

1. **HTTPS** - Usar certificados SSL
2. **Rate limiting** - Limitar peticiones por IP
3. **Autenticación** - Si necesitas endpoints protegidos
4. **CORS restringido** - Solo dominios permitidos

Ejemplo con rate limiting:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100 // límite de 100 requests
});

app.use('/api/', limiter);
```

## 📊 Monitoreo

Para ver el estado en tiempo real:

```javascript
// En la consola del navegador
window.versionChecker.log('Test');
window.versionChecker.checkForUpdates(); // Verificar manualmente
```

---

**¿Necesitas algo más?** Configura el sistema paso a paso basándote en tu infraestructura 🚀

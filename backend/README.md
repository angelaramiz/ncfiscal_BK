# 🚀 Backend API - Proyecto Asesoría

Sistema de API Express.js para control de versiones y servir la aplicación web.

## 📁 Estructura

```
backend/
├── server.js              # Servidor Express principal
├── bump-version.js        # Script para versionamiento semántico
├── package.json           # Dependencias del backend
└── README.md             # Este archivo
```

## 📋 Dependencias

- **express** ^4.22.1 - Framework web
- **cors** ^2.8.6 - Middleware CORS

## 🚀 Instalación

```powershell
# Desde la raíz del proyecto
cd backend
npm install

# O desde la raíz
cd backend && npm install
```

## ▶️ Uso

### Iniciar el servidor

```powershell
npm start
# o
npm run dev
```

El servidor escuchará en: `http://localhost:3000`

### Versionamiento

Desde la carpeta backend:

```powershell
# Modo interactivo
npm run version

# Modo automático
npm run version:patch "Descripción"
npm run version:minor "Nueva funcionalidad"
npm run version:major "Cambio importante"
```

O desde la raíz del proyecto:
```powershell
cd backend && npm run version:patch "Descripción"
```

## 🔗 Endpoints disponibles

### GET /api/version
Obtiene la versión actual del sitio.

```bash
curl http://localhost:3000/api/version
```

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
Verifica si hay una versión más nueva.

```bash
curl -X POST http://localhost:3000/api/version/check \
  -H "Content-Type: application/json" \
  -d '{"clientVersion":"1.0.0"}'
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

```bash
curl http://localhost:3000/api/changelog
```

**Response:**
```json
{
  "success": true,
  "changelog": [
    {
      "version": "1.0.1",
      "date": "2026-02-22T10:45:30.123Z",
      "type": "patch",
      "description": "Descripción del cambio",
      "changes": []
    }
  ]
}
```

## 📁 Archivos servidos

El servidor sirve estáticamente los archivos de `../public` (carpeta public en raíz):

```
http://localhost:3000/          → ../public/index.html
http://localhost:3000/css/*     → ../public/css/*
http://localhost:3000/js/*      → ../public/js/*
http://localhost:3000/images/*  → ../public/images/*
```

## 🔄 Workflow recomendado

1. **Desarrollar** - Hacer cambios en `../public`
2. **Testear** - Abrir `http://localhost:3000` en el navegador
3. **Versionar** - `npm run version:patch "Descripción"`
4. **Commit** - `git add ../public/version.json && git commit -m "..."`

## 🛠️ Desarrollo

Para desarrollo con auto-reload (requiere nodemon):

```powershell
npm install --save-dev nodemon
```

Luego actualizar `package.json`:
```json
"scripts": {
  "dev": "nodemon server.js"
}
```

Y ejecutar:
```powershell
npm run dev
```

## 🐛 Troubleshooting

### Port 3000 en uso
```powershell
# Cambiar puerto
$env:PORT=3001
npm start

# O en Linux/Mac
PORT=3001 npm start
```

### CORS bloqueado
El middleware CORS ya está configurado. Si tienes problemas, verifica:
- La petición viene de un origen permitido
- El header `Content-Type: application/json` está presente

### version.json no encontrado
Asegúrate que `../public/version.json` existe:
```powershell
# Desde backend/
dir ../public/version.json
```

## 📦 Despliegue

Para producción considera:

1. **Variables de entorno** - Crear `.env`
   ```
   PORT=3000
   NODE_ENV=production
   ```

2. **Rate limiting** - Instalar `express-rate-limit`
3. **Gzip compression** - Instalar `compression`
4. **HTTPS** - Configurar con certificados SSL

Ejemplo `.env`:
```
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://ncfiscal.mx
```

---

**¿Necesitas ayuda?** Revisa [INSTALACION_BACKEND.md](../INSTALACION_BACKEND.md) para documentación completa.

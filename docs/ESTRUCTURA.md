# 📁 Estructura del Proyecto

## Layout

```
proyecto-raíz/
│
├── backend/                          # 🔵 BACKEND INDEPENDIENTE
│   ├── server.js                    # Servidor Express API
│   ├── bump-version.js              # Script de versionamiento
│   ├── package.json                 # Dependencias backend
│   ├── .gitignore                   # Ignorar node_modules
│   └── README.md                    # Documentación backend
│
├── public/                           # 🟢 FRONTEND (Archivos estáticos)
│   ├── index.html                   # Página principal
│   ├── version.json                 # Versión actual (generado automáticamente)
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── version-checker.js       # Cliente de control de versión
│   │   ├── api/
│   │   │   └── send-contact.php
│   │   ├── components/
│   │   │   ├── header-component.js
│   │   │   ├── footer-component.js
│   │   │   └── ...
│   │   └── pages/
│   └── images/
│
├── config/                           # ⚙️ CONFIGURACIÓN GENERAL
│   ├── robots.txt
│   ├── sitemap.xml
│   └── wordpress-wp-config.php
│
├── docs/                             # 📚 DOCUMENTACIÓN
│   ├── README.md
│   ├── CHANGELOG.txt
│   ├── GUIA_RAPIDA.txt
│   └── SEO_OPTIMIZATION_GUIDE.txt
│
├── package.json                      # 📦 Scripts raíz que delegan a backend
├── bump-version.js                   # Script legacy (usar desde backend/)
├── version.json                      # Legacy (la actual está en public/)
├── VERSIONAMIENTO.md                 # Documentación de versioning
├── INSTALACION_BACKEND.md            # Guía de instalación completa
├── .git/
└── .gitignore
```

## 🔄 Relación entre carpetas

### Backend (Independiente)

```
backend/
├── server.js
│   └── lee: ../public/version.json
│       sirve: ../public/* (archivos estáticos)
└── bump-version.js
    └── escribe: ../public/version.json
```

### Frontend (Estático en public/)

```
public/
├── index.html
│   └── carga: js/version-checker.js
├── js/version-checker.js
│   └── solicita: /api/version/check (al backend)
└── version.json
    └── actualizado por: ../backend/bump-version.js
```

## 🚀 Cómo usar

### Instalar todo

```powershell
# Desde la raíz
npm run install-all
```

### Iniciar servidor

```powershell
# Desde la raíz
npm start

# O directamente
cd backend && npm start
```

### Versionamiento

```powershell
# Desde la raíz (delega a backend)
npm run version:patch "Descripción"

# O directamente desde backend
cd backend && npm run version:patch "Descripción"
```

## 📋 Archivos generados automáticamente

| Archivo | Generado por | Ubicación | Propósito |
|---------|--------------|-----------|----------|
| `public/version.json` | `backend/bump-version.js` | Frontend | Cliente lee para verificar |
| `node_modules/` | npm install | Backend | Dependencies del backend |

## 🔐 .gitignore

El backend tiene su propio `.gitignore` para no versionar `node_modules/`:

```
backend/.gitignore
├── node_modules/
├── .env
├── *.log
└── ...
```

## 💡 Ventajas de esta estructura

✅ **Separación clara** - Frontend y Backend independientes  
✅ **Fácil de escalar** - Puedes expandir backend sin afectar frontend  
✅ **Mantenimiento** - Cada carpeta tiene su `package.json`  
✅ **Despliegue flexible** - Frontend puedes hostearlo estático, backend en servidor  
✅ **Colaboración** - Equipos pueden trabajar por separado  

## 🔗 Flujo de desarrollo

```
┌─────────────────────────────────────┐
│ 1. Editar código en public/         │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ 2. Hacer cambios, testear           │
│    npm start → http://localhost:3000 │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ 3. Listo para releases              │
│    npm run version:patch "..."      │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ 4. Commit cambios + version.json    │
│    git add public/version.json      │
│    git commit -m "..."              │
└─────────────────────────────────────┘
```

## 📖 Documentación por carpeta

- **backend/** → [backend/README.md](backend/README.md)
- **Versionamiento** → [VERSIONAMIENTO.md](VERSIONAMIENTO.md)
- **API completa** → [INSTALACION_BACKEND.md](INSTALACION_BACKEND.md)

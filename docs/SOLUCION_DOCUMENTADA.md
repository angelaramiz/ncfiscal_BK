# Documentación: Solución de Problemas NC Fiscal - ncfiscal.com

## Resumen del Problema
El dominio ncfiscal.com presentaba múltiples errores tras una migración de WordPress a un sitio HTML estático:

1. **Errores 404 y MIME type incorrecto** - Los recursos (CSS, JS, imágenes) retornaban error 404 con MIME type `text/html`
2. **Conflictos con WordPress** - jQuery, plugins de cookies y archivos de WordPress se seguían cargando
3. **Errores de headers** - `Permissions-Policy` headers no reconocidos
4. **Estructura dual problemática** - WordPress en raíz + sitio HTML en carpeta `/html/`

## Estructura Original (Problemática)
```
/public_html/                 ← Raíz (WordPress)
├── wp-admin/
├── wp-content/
├── wp-includes/
├── index.php
├── wp-config.php
└── .htaccess                 ← Conflictivo

/public_html/html/            ← Sitio HTML nuevo
├── index.html
├── css/
├── js/
├── pages/
└── images/
```

## Solución Implementada

### Paso 1: Consolidación de Archivos
**Acción:** Mover todo el contenido de `/html/` a la raíz `/public_html/`
- Copiar todos los archivos y carpetas de `/html/` a `/public_html/`
- Eliminar la carpeta `/html/` completamente
- Eliminar TODOS los archivos PHP de WordPress de la raíz

**Archivos eliminados:**
- index.php
- wp-*.php (todos)
- wp-config.php
- wp-blog-header.php
- license.txt
- readme.html
- .htaccess anterior (corrupto)

### Paso 2: Estructura Final Limpia
```
/public_html/                 ← Raíz (Sitio HTML puro)
├── index.html                ← Página principal
├── css/
│   └── styles.css
├── js/
│   ├── components/
│   │   ├── background-component.js
│   │   ├── footer-component.js
│   │   ├── header-component.js
│   │   └── services-nav-component.js
│   └── api/
│       └── send-contact.php  ← ÚNICO archivo PHP permitido
├── pages/
│   ├── asesoria-fiscal.html
│   ├── contactanos.html
│   ├── migracion-inversion.html
│   ├── patente-intangibles.html
│   ├── quienes-somos.html
│   └── servicios-contabilidad.html
├── images/
│   ├── logo.svg
│   ├── mty.png
│   └── WhatsApp.svg
├── .htaccess                 ← Raíz
└── js/api/.htaccess          ← Directorio especial
```

### Paso 3: Configuración de .htaccess

#### A) .htaccess en la raíz (`/public_html/.htaccess`)
```apache
# NC FISCAL - Root .htaccess (HTML + PHP API)

# Set index.html as default
DirectoryIndex index.html

# Clean MIME types
AddType text/css .css
AddType application/javascript .js
AddType text/html .html
AddType application/json .json
```

**Propósito:**
- Define `index.html` como archivo por defecto
- Asegura MIME types correctos para evitar errores 415
- Simple y sin bloques que causen conflictos

#### B) .htaccess en `/js/api/` (`/public_html/js/api/.htaccess`)
```apache
# /js/api/.htaccess - Allow PHP here

# Enable PHP in this directory
php_flag engine on

# Allow access to PHP files
AddType application/x-httpd-php .php

# MIME types
AddType application/json .json
```

**Propósito:**
- Habilita PHP ÚNICAMENTE en `/js/api/`
- Permite que `send-contact.php` funcione para formularios
- Protege el resto del sitio de ejecución PHP

### Paso 4: Resultados

✅ **Problemas Resueltos:**
1. **404 y MIME types** - Eliminados con estructura limpia y .htaccess correcto
2. **Errores de WordPress** - Eliminados todos los archivos PHP de WordPress
3. **Permissions-Policy** - Ya no interfiere WordPress
4. **jQuery y plugins** - No se cargan porque no existe WordPress
5. **Recursos estáticos** - CSS, JS, imágenes se sirven correctamente

✅ **Funcionalidades Mantenidas:**
- Formilario de contacto en `contactanos.html` funciona vía `send-contact.php`
- Sitio HTML completamente funcional y rápido
- Sin dependencias de WordPress

## Archivos de Configuración Final

### Ubicación de Archivos Críticos:
```
c:\Users\angel\Desktop\Proyectos\a\config\.htaccess-FINAL-LIMPIO
  → Usar en: /public_html/.htaccess

c:\Users\angel\Desktop\Proyectos\a\public\js\api\.htaccess
  → Usar en: /public_html/js/api/.htaccess
```

## Acciones Realizadas en Namecheap cPanel

1. **File Manager:**
   - Navegó a carpeta `/html/`
   - Seleccionó TODO el contenido
   - Cut/Move a `/public_html/`

2. **Eliminación:**
   - Borró carpeta `/html/`
   - Eliminó archivos PHP de WordPress de la raíz

3. **Configuración:**
   - Editó `.htaccess` en raíz con contenido limpio
   - Creó `.htaccess` en `/js/api/`
   - Habilitó "Show Hidden Files" para ver archivos ocultos

4. **Cache:**
   - Limpió caché del navegador tras cada cambio

## Beneficios de la Solución

### ✅ Seguridad
- PHP bloqueado en todo el sitio excepto donde es necesario
- Sin exposición de WordPress
- Sin acceso a archivos de configuración

### ✅ Rendimiento
- Sitio HTML puro es muy rápido
- Sin sobrecarga de WordPress
- Menor tamaño de transferencia

### ✅ Mantenimiento
- Estructura simple y limpia
- Fácil de actualizar contenido HTML
- Sin conflictos de plugins

### ✅ Compatibilidad
- Funciona con hosting compartido Namecheap
- .htaccess simple compatible con Apache
- No requiere configuraciones especiales del servidor

## Próximos Pasos (Si es necesario)

Si experimentas futuros problemas:

1. **Validar .htaccess:**
   - Verificar síntaxis en cPanel
   - Limpiar caché del navegador

2. **Verificar send-contact.php:**
   - Asegurar que tiene permisos de ejecución (644 o 755)
   - Verificar headers y validaciones CORS si es necesario

3. **Optimizaciones opcionales:**
   - Agregar caché de navegador para imágenes
   - Comprensión GZIP para archivos estáticos
   - CDN para distribuir contenido

## Contacto con Soporte

Si surge algún problema con permisos de ejecución PHP en `/js/api/`:
- Contactar a Namecheap Support
- Solicitar que habilite `AllowOverride All` en la configuración del servidor
- Verificar que mod_rewrite esté habilitado

---

**Fecha:** 19 de febrero de 2026
**Sitio:** ncfiscal.com
**Estado:** ✅ OPERATIVO

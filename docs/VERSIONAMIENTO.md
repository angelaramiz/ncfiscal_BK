# 📦 Sistema de Versionamiento Automático

Script para gestionar automáticamente el versionamiento semántico (major.minor.patch) del proyecto.

## 📁 Archivos creados

- **version.json** - Contiene la información de versión actual y el historial de cambios
- **bump-version.js** - Script Node.js para automatizar el incremento de versión
- **package.json** - Configuración del proyecto con scripts npm

## 🚀 Uso

### Modo interactivo (menú visual)
```bash
node bump-version.js
```
o si tienes npm configurado:
```bash
npm run version
```

### Modo rápido (con argumentos)

**Incrementar versión patch (correcciones):**
```bash
node bump-version.js patch
node bump-version.js patch "Arreglado bug en contacto"
npm run version:patch
```

**Incrementar versión minor (nuevas funciones):**
```bash
node bump-version.js minor
node bump-version.js minor "Agregado formulario de asesoría"
npm run version:minor
```

**Incrementar versión major (cambios incompatibles):**
```bash
node bump-version.js major
node bump-version.js major "Rediseño completo del sitio"
npm run version:major
```

## 📋 Versionamiento Semántico

El formato es: **MAJOR.MINOR.PATCH**

- **MAJOR** (x.0.0) - Cambios incompatibles o redesigns completos
- **MINOR** (x.x.0) - Nuevas funcionalidades compatibles
- **PATCH** (x.x.x) - Correcciones de errores y ajustes menores

## 📄 Formato de version.json

```json
{
  "version": "1.0.0",
  "name": "Proyecto Asesoría",
  "description": "Sistema de asesoría fiscal y contable",
  "releaseDate": "2026-02-22",
  "changelog": [
    {
      "version": "1.0.1",
      "date": "2026-02-22T10:30:00.000Z",
      "type": "patch",
      "description": "Arreglado bug en formulario",
      "changes": []
    }
  ]
}
```

## 🔄 Workflow recomendado

1. Realiza tus cambios en el código
2. Prueba los cambios
3. Ejecuta el script de versionamiento
4. Haz commit con los cambios y version.json actualizado
5. (Opcional) Crea un tag en Git: `git tag v1.0.1`

## 📝 Ejemplo de uso en Git

```bash
# Hacer cambios
git add .

# Aumentar versión
npm run version:patch

# Commit
git add version.json
git commit -m "v1.0.1: Arreglado bug en formulario de contacto"

# Tag (opcional)
git tag v1.0.1
git push origin main --tags
```

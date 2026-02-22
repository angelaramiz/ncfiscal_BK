#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const versionFilePath = path.join(__dirname, '..', 'public', 'version.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function readVersionFile() {
  try {
    const data = fs.readFileSync(versionFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer version.json:', error.message);
    process.exit(1);
  }
}

function writeVersionFile(versionData) {
  try {
    fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2) + '\n');
    console.log('✓ version.json actualizado exitosamente');
  } catch (error) {
    console.error('Error al escribir version.json:', error.message);
    process.exit(1);
  }
}

function incrementVersion(currentVersion, type) {
  const parts = currentVersion.split('.');
  const [major, minor, patch] = parts.map(Number);

  switch (type.toLowerCase()) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      console.error('Tipo inválido. Use: major, minor, o patch');
      process.exit(1);
  }
}

function showMenu() {
  const versionData = readVersionFile();
  const currentVersion = versionData.version;

  console.log('\n═════════════════════════════════════════');
  console.log('    VERSIONAMIENTO AUTOMÁTICO');
  console.log('═════════════════════════════════════════');
  console.log(`Versión actual: ${currentVersion}\n`);
  console.log('Seleccione el tipo de actualización:\n');
  console.log('1) Patch  - Correcciones de errores (.x.x)');
  console.log('2) Minor  - Nuevas funciones (x.x.0)');
  console.log('3) Major  - Cambios incompatibles (x.0.0)');
  console.log('4) Salir\n');

  rl.question('Ingrese su opción (1-4): ', (answer) => {
    const types = { '1': 'patch', '2': 'minor', '3': 'major', '4': 'exit' };
    const selectedType = types[answer];

    if (!selectedType) {
      console.error('Opción inválida');
      rl.close();
      return;
    }

    if (selectedType === 'exit') {
      rl.close();
      return;
    }

    rl.question('Descripción del cambio (opcional): ', (description) => {
      const newVersion = incrementVersion(currentVersion, selectedType);
      versionData.version = newVersion;
      versionData.releaseDate = new Date().toISOString().split('T')[0];

      if (!versionData.changelog) {
        versionData.changelog = [];
      }

      versionData.changelog.unshift({
        version: newVersion,
        date: new Date().toISOString(),
        type: selectedType,
        description: description || 'Sin descripción',
        changes: []
      });

      writeVersionFile(versionData);

      console.log(`\n✓ Versión actualizada: ${currentVersion} → ${newVersion}`);
      if (description) {
        console.log(`✓ Descripción: ${description}`);
      }
      console.log(`✓ Fecha: ${versionData.releaseDate}\n`);

      rl.close();
    });
  });
}

// Script rápido mediante argumentos
const args = process.argv.slice(2);
if (args.length > 0) {
  const type = args[0];
  const description = args.slice(1).join(' ');

  const versionData = readVersionFile();
  const currentVersion = versionData.version;
  const newVersion = incrementVersion(currentVersion, type);

  versionData.version = newVersion;
  versionData.releaseDate = new Date().toISOString().split('T')[0];

  if (!versionData.changelog) {
    versionData.changelog = [];
  }

  versionData.changelog.unshift({
    version: newVersion,
    date: new Date().toISOString(),
    type: type.toLowerCase(),
    description: description || 'Sin descripción',
    changes: []
  });

  writeVersionFile(versionData);

  console.log(`✓ Versión actualizada: ${currentVersion} → ${newVersion}`);
  if (description) {
    console.log(`✓ Descripción: ${description}`);
  }
  console.log(`✓ Fecha: ${versionData.releaseDate}\n`);
} else {
  // Modo interactivo
  showMenu();
}

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS para permitir solicitudes desde Go Live y localhost
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5501',
    'http://127.0.0.1:5501',
    'http://localhost:5502',
    'http://127.0.0.1:5502',
    'http://localhost:3001',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Cache-Control']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ruta al archivo de versión
const versionPath = path.join(__dirname, '..', 'public', 'version.json');

/**
 * GET /api/version
 * Retorna la versión actual del sitio
 */
app.get('/api/version', (req, res) => {
  try {
    const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
    res.json({
      success: true,
      version: versionData.version,
      releaseDate: versionData.releaseDate,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'No se pudo obtener la versión',
      message: error.message
    });
  }
});

/**
 * POST /api/version/check
 * Compara la versión del cliente con la del servidor
 * Body: { clientVersion: "1.0.0" }
 * Response: { updateAvailable: true/false, latestVersion: "1.0.1" }
 */
app.post('/api/version/check', (req, res) => {
  try {
    const { clientVersion } = req.body;

    if (!clientVersion) {
      return res.status(400).json({
        success: false,
        error: 'clientVersion es requerido'
      });
    }

    const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
    const serverVersion = versionData.version;

    const updateAvailable = compareVersions(clientVersion, serverVersion) < 0;

    res.json({
      success: true,
      clientVersion,
      latestVersion: serverVersion,
      updateAvailable,
      message: updateAvailable 
        ? 'Nueva versión disponible' 
        : 'Tu versión está actualizada'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al verificar versión',
      message: error.message
    });
  }
});

/**
 * GET /api/changelog
 * Retorna el historial de cambios
 */
app.get('/api/changelog', (req, res) => {
  try {
    const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
    res.json({
      success: true,
      changelog: versionData.changelog || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'No se pudo obtener changelog'
    });
  }
});

/**
 * Función para comparar versiones semánticas
 * Retorna: -1 si v1 < v2, 0 si v1 == v2, 1 si v1 > v2
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;

    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }

  return 0;
}

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

app.listen(PORT, () => {
  console.log(`✓ Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`✓ API disponible en http://localhost:${PORT}/api/version`);
});

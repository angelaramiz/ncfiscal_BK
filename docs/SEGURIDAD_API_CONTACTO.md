# Seguridad de API de Contacto - send-contact.php

## Medidas de Seguridad Implementadas

### 1. Headers de Seguridad HTTP
```
X-Content-Type-Options: nosniff        → Previene MIME type sniffing
X-Frame-Options: DENY                  → Previente clickjacking
X-XSS-Protection: 1; mode=block        → Protección XSS en navegadores antiguos
Strict-Transport-Security              → Fuerza HTTPS
Content-Security-Policy                → Control de recursos cargados
Access-Control headers                 → CORS limitado al mismo dominio
```

### 2. Rate Limiting
- **Máximo 5 solicitudes por IP cada 60 minutos**
- Almacenado en `/tmp/ncfiscal_rate_limit/`
- Retorna error 429 (Too Many Requests) si se excede
- Previene ataques de fuerza bruta y spam

### 3. Validación de Entrada
```php
// Campo          | Validación
// ============================================
// Nombre         | 3-100 caracteres, sanitizado
// Email          | filter_var() con FILTER_VALIDATE_EMAIL
// Teléfono       | Solo números, guiones, espacios, paréntesis, + (10-20 caracteres)
// Servicios      | 1-50 caracteres
// Mensaje        | 10-5000 caracteres
```

### 4. Sanitización
- Eliminación de espacios en blanco al inicio/final
- Conversión JSON escape characters
- Eliminación de caracteres nulos
- HTML escaping con `htmlspecialchars()`
- Validación de longitud de campos

### 5. Prevención de Header Injection
```php
// Función sanitize_header() elimina \r y \n
// Se aplica a:
// - nombre de contacto (From header)
// - cualquier otro dato que entre en headers
```

### 6. CORS (Cross-Origin Resource Sharing)
- Solo permite solicitudes desde el mismo dominio
- Valida `HTTP_ORIGIN` contra `https://ncfiscal.com`
- Bloquea solicitudes desde otros orígenes

### 7. Validación de Método HTTP
- Solo acepta POST (y OPTIONS para CORS preflight)
- Retorna 405 Method Not Allowed para otros métodos

### 8. Logging de Seguridad
Archivo: `/tmp/ncfiscal_security.log`

Se registran:
```
- Intentos fallidos de validación
- Rate limiting excedido
- Submisiones exitosas (para auditoría)
- Errores de envío
- IP del cliente
- User Agent
- Timestamp
```

Ejemplo de log:
```
[2026-02-22 10:30:45] IP: 192.168.1.100 | Type: VALIDATION | Data: Invalid email | UserAgent: Mozilla/5.0...
[2026-02-22 10:30:50] IP: 192.168.1.100 | Type: SUCCESS | Data: Contact from: user@example.com | UserAgent: Mozilla/5.0...
```

### 9. Error Handling Seguro
- No expone información sensible en respuestas de error
- Usa códigos HTTP estándar (400, 405, 429, 500)
- Respuestas JSON consistentes

### 10. Direcciones IP Registradas
- Se registra la IP del cliente en:
  - Los logs de seguridad
  - Los headers del correo (`X-Originating-IP`)
  - Cuerpo del correo recibido

## Flujo de Validación

```
1. Headers de Seguridad               ✓
2. Validación CORS                     ✓
3. Método HTTP (POST/OPTIONS)          ✓
4. Rate Limiting                       ✓
5. Obtener datos del formulario        ✓
6. Sanitizar datos                     ✓
7. Validar estructura                  ✓
8. Validar formato de campos           ✓
9. Validar longitud de campos          ✓
10. Si OK → Enviar correos             ✓
11. Registrar en log                   ✓
12. Retornar respuesta JSON            ✓
```

## Ataques Prevenidos

### ✅ Header Injection
- No es posible inyectar saltos de línea en headers
- Uso de `sanitize_header()`

### ✅ XSS (Cross-Site Scripting)
- `htmlspecialchars()` convierte `<script>` en entidades HTML
- Content-Security-Policy header bloquea inline scripts

### ✅ CSRF (Cross-Site Request Forgery)
- CORS restringido al mismo dominio
- Validación de método POST

### ✅ SQL Injection
- No se usa base de datos
- No hay consultas dinámicas

### ✅ Email Spoofing
- Validación filter_var() en email
- Headers sanitizados contra inyección

### ✅ Fuerza Bruta
- Rate limiting de 5 solicitudes por hora
- Bloqueo temporal automático

### ✅ Spam
- Rate limiting previene spam masivo
- Validación de contenido de mensaje
- Logging de todos los intentos

### ✅ DoS (Denial of Service)
- Rate limiting por IP
- Límite de tamaño de campos
- Timeout implícito de PHP

## Configuración Recomendada en .htaccess

```apache
# Protección adicional en /js/api/.htaccess
<Directory "/home/*/public_html/js/api">
    # Permitir solo XML/JSON
    <FilesMatch "\.php$">
        Header set Content-Type "application/json"
    </FilesMatch>
    
    # Deshabilitar directory listing
    Options -Indexes
    
    # Limitar tamaño de POST
    LimitRequestBody 1048576
</Directory>
```

## Archivos Generados

### Logs de Seguridad
- **Ubicación:** `/tmp/ncfiscal_security.log`
- **Contenido:** Todos los intentos de envío (exitosos y fallidos)
- **Revisión:** Revisar mensualmente para detectar patrones de ataque

### Rate Limiting
- **Ubicación:** `/tmp/ncfiscal_rate_limit/`
- **Contenido:** Un archivo por IP con timestamps de solicitudes
- **Limpieza:** Automática (se eliminan solicitudes > 60 minutos)

## Recomendaciones Adicionales

### 1. Monitorear Logs
```bash
# Ver últimas 50 líneas
tail -50 /tmp/ncfiscal_security.log

# Ver intentos fallidos
grep "VALIDATION\|FAILED" /tmp/ncfiscal_security.log

# Contar intentos por IP
grep "VALIDATION" /tmp/ncfiscal_security.log | awk '{print $4}' | sort | uniq -c
```

### 2. Configuración de cPanel
- Habilitar SPF, DKIM, DMARC para emails salientes
- Configurar limite de rate para prevenir abuse
- Monitorear logs de acceso HTTP 429

### 3. Backups
- Incluir logs de seguridad en backups regulares
- Archivar logs con más de 30 días

### 4. Alertas
Considerar agregar alertas si:
- Se excede rate limit más de 10 veces en 1 hora
- Se detecto patrón de validaciones fallidas
- Muchas solicitudes desde una misma IP

## Testing de Seguridad

### Pruebas Manuales
```bash
# Test 1: Rate limiting (5 requests max)
for i in {1..10}; do 
  curl -X POST https://ncfiscal.com/js/api/send-contact.php \
    -d "name=Test&email=test@test.com&services=test&specific-service=test&message=Test message"
done

# Test 2: HEAD method (debe fallar 405)
curl -X HEAD https://ncfiscal.com/js/api/send-contact.php

# Test 3: CORS preflight
curl -X OPTIONS -H "Origin: https://example.com" \
  https://ncfiscal.com/js/api/send-contact.php
```

## Mantenimiento

- Revisar logs semanalmente
- Limpiar archivos temporales mensualmente
- Actualizar este documento si se detectan nuevas amenazas
- Hacer backup de logs de seguridad trimestralmente

---

**Última Actualización:** 22 de febrero de 2026
**Estado:** ✅ IMPLEMENTADO

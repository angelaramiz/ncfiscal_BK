# Checklist de Seguridad - API de Contacto

## Pre-Deploy ✅

- [x] send-contact.php tiene rate limiting configurado
- [x] Validación de entrada en todos los campos
- [x] Sanitización de headers contra inyección
- [x] CORS restringido al mismo dominio
- [x] Headers de seguridad HTTP configurados
- [x] Logging de eventos de seguridad implementado
- [x] .htaccess en /js/api/ con protecciones
- [x] Métodos HTTP limitados a POST y OPTIONS
- [x] Directory listing deshabilitado
- [x] Límite de tamaño de POST establecido (5MB)
- [x] Error handling sin exposición de datos sensibles

## En Producción (Monitoreo Continuo)

### Semanal
- [ ] Revisar `/tmp/ncfiscal_security.log`
- [ ] Buscar patrones de ataque o spam
- [ ] Verificar IPs con múltiples intentos fallidos
- [ ] Revisar errores 429 (rate limit excedido)

### Mensual
- [ ] Análisis de tendencias en logs
- [ ] Limpiar logs antiguos (>30 días)
- [ ] Revisar estadísticas de submisiones exitosas
- [ ] Auditoría de seguridad interna

### Trimestral
- [ ] Backup de logs de seguridad
- [ ] Revisión de vulnerabilidades conocidas en PHP
- [ ] Actualizar send-contact.php si es necesario
- [ ] Pruebas de penetración simuladas

### Anualmente
- [ ] Auditoría de seguridad externa (si es posible)
- [ ] Revisión completa de políticas de seguridad
- [ ] Actualización de documentación
- [ ] Capacitación del equipo

## Indicadores de Compromiso

### ⚠️ Alertas Inmediatas
```
- Más de 20 intentos fallidos por IP en 1 hora
- 404 en intentos de acceso a archivos administrativos
- Patrones de SQL injection o XSS en los logs
- Cambios en permisos o estructura de archivos
- Múltiples errores 500 en corto tiempo
```

### 🔍 Investigación Recomendada
```
- IPs con rate limit excedido repetidamente
- Cambios en User-Agent sospechosos
- Patrones de caracteres extraños en submisiones
- Emails inválidos pero que pasan validación
- Mensajes muy cortos o muy largos reiteradamente
```

## Procedimiento de Respuesta

### Si se detecta ataque:

1. **Identificar**
   ```bash
   grep "VALIDATION\|FAILED" /tmp/ncfiscal_security.log | grep "IP: SOSPECHOSA"
   ```

2. **Bloquear IP (si es necesario)**
   Agregar a `/home/*/public_html/js/api/.htaccess`:
   ```apache
   <Limit POST OPTIONS>
       Order Allow,Deny
       Allow from all
       Deny from 192.168.1.100
   </Limit>
   ```

3. **Documentar**
   - Guardar logs antes de limpiar
   - Registrar detalles del incidente
   - Comunicar al equipo

4. **Limpiar**
   ```bash
   rm /tmp/ncfiscal_rate_limit/[hash_de_ip].txt
   ```

## Comandos Útiles para Administrador

### Ver actividad reciente
```bash
tail -100 /tmp/ncfiscal_security.log
```

### Contar submisiones exitosas hoy
```bash
grep "$(date +%Y-%m-%d)" /tmp/ncfiscal_security.log | grep "SUCCESS" | wc -l
```

### Ver IPs con más intentos fallidos
```bash
grep "VALIDATION\|FAILED" /tmp/ncfiscal_security.log | \
awk '{for(i=1;i<=NF;i++) if($i=="IP:") print $(i+1)}' | \
sort | uniq -c | sort -rn | head -10
```

### Buscar intentos de inyección
```bash
grep -E "(\<script|javascript:|onerror|onclick|DROP|UNION)" /tmp/ncfiscal_security.log
```

### Ver rate limit violaciones
```bash
grep "Too Many Requests\|429" /tmp/ncfiscal_security.log
```

### Estadísticas del último día
```bash
echo "=== Últimas 24 horas ==="
echo "Submisiones exitosas: $(grep -c "SUCCESS" /tmp/ncfiscal_security.log)"
echo "Validaciones fallidas: $(grep -c "VALIDATION" /tmp/ncfiscal_security.log)"
echo "Errores de envío: $(grep -c "ERROR" /tmp/ncfiscal_security.log)"
echo "Rate limits excedidos: $(grep -c "FAILED_SUBMISSION" /tmp/ncfiscal_security.log)"
```

## Configuración Adicional Recomendada

### En cPanel - Security
```
✓ AutoSSL/Let's Encrypt activo
✓ SSL/TLS enabled
✓ ModSecurity habilitado
✓ IP allowlisting para admin (si aplica)
```

### En DNS - Registros de Email
```
SPF:  "v=spf1 include:mail.ncfiscal.com ~all"
DKIM: Configurado en cPanel
DMARC: "v=DMARC1; p=quarantine; rua=mailto:admin@ncfiscal.com"
```

### En PHP.ini (solicitar a hosting)
```
php_flag display_errors Off
php_flag log_errors On
php_value error_log /home/*/logs/php_errors.log
php_value upload_max_filesize 5M
php_value post_max_size 5M
max_execution_time = 30
```

## Testing de Seguridad Periódico

### Simular ataque de validación (cada mes)
```bash
for i in {1..10}; do
  curl -X POST https://ncfiscal.com/js/api/send-contact.php \
    -d "name=<script>alert(1)</script>&email=invalid&services=test&specific-service=test&message=test"
done
# Verificar que se registre en logs de validación
```

### Test de rate limiting (cada mes)
```bash
for i in {1..10}; do
  (curl -X POST https://ncfiscal.com/js/api/send-contact.php \
    -d "name=Test&email=rate@test.com&services=fiscal&specific-service=impuestos&message=Test message ${i}") &
done
# Verificar que después del 5to intento se rechace con 429
```

## Documentación Relacionada

- `SOLUCION_DOCUMENTADA.md` - Historia completa de la solución
- `send-contact.php` - Código fuente con seguridad implementada
- `SEGURIDAD_API_CONTACTO.md` - Detalle técnico de medidas de seguridad

---

**Última Actualización:** 22 de febrero de 2026
**Responsable:** Angel
**Estado:** ✅ IMPLEMENTADO Y DOCUMENTADO

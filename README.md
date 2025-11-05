# 🤖 Bot de Verificación de Notas UTN

Bot automatizado que verifica las notas de materias en el sistema de autogestión de la UTN FRC y envía notificaciones por WhatsApp.

## 📋 Características

- ✅ Verificación automática de notas
- 📱 Notificaciones por WhatsApp usando Twilio
- 🔧 Completamente configurable por variables de entorno
- 🎯 Selección dinámica de materia y columna de nota
- 🌙 Horario de silencio (1am - 7am) para no enviar mensajes en la madrugada

## 🚀 Instalación

1. Clonar o descargar este repositorio

2. Instalar dependencias:
```bash
npm install
```

3. Crear un archivo `.env` en la raíz del proyecto (ver configuración abajo)

## ⚙️ Configuración

### Variables de Entorno

Crear un archivo `.env` con las siguientes variables:

```env
# Credenciales UTN
USUARIO=tu_usuario
PASSWORD=tu_contraseña
URL_BASE=https://a4.frc.utn.edu.ar/4

# Configuración de la materia a verificar
MATERIA=Investigación Operativa
COLUMNA_NOTA=2

# Configuración de Twilio
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
MI_WHATSAPP=whatsapp:+549XXXXXXXXXX
```

### 📱 Configuración de Twilio (WhatsApp)

1. **Crear cuenta en Twilio**:
   - Ir a [https://www.twilio.com/](https://www.twilio.com/)
   - Registrarse (ofrecen crédito gratuito para pruebas)

2. **Configurar WhatsApp Sandbox**:
   - En el dashboard de Twilio, ir a "Messaging" → "Try it out" → "Send a WhatsApp message"
   - Escanear el código QR o enviar el mensaje de activación desde tu WhatsApp
   - Anotar el número de Twilio (ej: `whatsapp:+14155238886`)

3. **Obtener credenciales**:
   - En el dashboard principal, encontrarás:
     - `Account SID` → usar en `TWILIO_ACCOUNT_SID`
     - `Auth Token` → usar en `TWILIO_AUTH_TOKEN`

4. **Configurar tu número**:
   - El número de WhatsApp debe estar en formato: `whatsapp:+549XXXXXXXXXX`
   - Ejemplo para Argentina: `whatsapp:+5493515551234`

### 📊 Configuración de Materia y Nota

- **MATERIA**: Nombre exacto de la materia como aparece en el sistema (ej: `Redes de Datos`)
- **COLUMNA_NOTA**: Número de columna de la nota que quieres verificar
  - `1` = Primera columna (1º Parc.)
  - `2` = Segunda columna (2º Parc.)
  - `3` = Tercera columna (1º Práct.)
  - etc.

## 🎮 Uso

### Ejecución única
```bash
node index.js
```

### Ejecución automática (cron/scheduler)

**En Linux/Mac con crontab:**
```bash
# Verificar cada 30 minutos
*/30 * * * * cd /ruta/al/proyecto && node index.js
```

**En Windows con Task Scheduler:**
1. Abrir "Programador de tareas"
2. Crear tarea básica
3. Configurar trigger (cada 30 minutos, por ejemplo)
4. Acción: `node.exe` con argumento `C:\ruta\al\proyecto\index.js`

**Con PM2 (Node.js process manager):**
```bash
npm install -g pm2
pm2 start index.js --name "bot-notas" --cron "*/30 * * * *"
```

## 📝 Ejemplo de Salida

```
==================================================
🔍 Verificando notas... [5/11/2025 14:30:00]
==================================================
📄 Página cargada
🔐 Login realizado
🔎 Buscando materia: Investigación Operativa
✅ Materia encontrada con ID: idCurso2025-5-2023-404-4
🖱️  Haciendo hover...
📝 Click en parciales realizado
🔎 Buscando nota en columna 2...
📋 Columna seleccionada: "2º Parc."
📊 Nota encontrada: 10
✅ WhatsApp enviado correctamente
```

## 🛠️ Tecnologías

- **Node.js** - Runtime
- **Playwright** - Automatización de navegador
- **Twilio API** - Envío de mensajes de WhatsApp
- **dotenv** - Manejo de variables de entorno

## ⚠️ Notas Importantes

- El bot respeta un horario de silencio entre 1am y 7am
- Asegúrate de tener conexión a internet estable
- Las credenciales de Twilio sandbox son para pruebas (tienen limitaciones)
- Para uso en producción, considera actualizar a una cuenta de Twilio de pago

## 🔒 Seguridad

- **NUNCA** subas el archivo `.env` a un repositorio público
- Mantén tus credenciales seguras
- Agrega `.env` al `.gitignore`

## 📄 Licencia

MIT

---

Creado con ❤️ para estudiantes de la UTN FRC

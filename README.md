# 🤖 Bot de Verificación de Notas UTN

Bot automatizado que verifica las notas de materias en el sistema de autogestión de la UTN FRC y envía notificaciones por WhatsApp usando **GitHub Actions**.

## 📋 Características

- ✅ Verificación automática de notas cada 30 minutos
- 📱 Notificaciones por WhatsApp usando Twilio
- 🤖 Ejecutado automáticamente con GitHub Actions (sin necesidad de servidor)
- 🔧 Completamente configurable por variables de entorno
- 🎯 Selección dinámica de materia y columna de nota
- 🌙 Horario de silencio (1am - 7am) para no enviar mensajes en la madrugada

## 🚀 Instalación y Configuración

### 1️⃣ Fork del Repositorio

1. Haz clic en el botón **"Fork"** en la parte superior derecha de este repositorio
2. Esto creará una copia del repositorio en tu cuenta de GitHub

### 2️⃣ Configurar Twilio (WhatsApp)

1. **Crear cuenta en Twilio**:
   - Ve a [https://www.twilio.com/](https://www.twilio.com/)
   - Regístrate (ofrecen crédito gratuito para pruebas)

2. **Configurar WhatsApp Sandbox**:
   - En el dashboard de Twilio, ve a **"Messaging"** → **"Try it out"** → **"Send a WhatsApp message"**
   - Escanea el código QR con WhatsApp o envía el mensaje de activación
   - Anota el número de Twilio (ejemplo: `whatsapp:+14155238886`)

3. **Obtener credenciales**:
   - En el dashboard principal de Twilio, encontrarás:
     - **Account SID**
     - **Auth Token**

### 3️⃣ Configurar GitHub Secrets

Ve a tu repositorio forkeado y configura los secrets:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Haz clic en **"New repository secret"** para cada uno de los siguientes:

| Secret Name | Descripción | Ejemplo |
|------------|-------------|---------|
| `USUARIO` | Tu usuario de autogestión UTN | `12345` |
| `PASSWORD` | Tu contraseña de autogestión UTN | `miContraseña123` |
| `MATERIA` | Nombre exacto de la materia a verificar | `Investigación Operativa` |
| `COLUMNA_NOTA` | Número de columna de la nota (1, 2, 3...) | `2` |
| `NOTIFICAR_SIEMPRE` | `true` = notificar cada 30 min, `false` = solo cuando cambie | `false` |
| `TWILIO_ACCOUNT_SID` | Account SID de Twilio | `ACxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Auth Token de Twilio | `xxxxxxxxxxxxx` |
| `TWILIO_WHATSAPP_FROM` | Número de WhatsApp de Twilio | `whatsapp:+14155238886` |
| `MI_WHATSAPP` | Tu número de WhatsApp | `whatsapp:+5493515551234` |

> **💡 Tip:** Para el número de WhatsApp argentino, el formato es: `whatsapp:+549` + código de área sin 0 + número

**Ejemplo completo para Argentina:**
- Número: 351-5551234
- En GitHub Secret: `whatsapp:+5493515551234`

### 4️⃣ Activar GitHub Actions

1. Ve a la pestaña **"Actions"** de tu repositorio
2. Si está deshabilitado, haz clic en **"I understand my workflows, go ahead and enable them"**
3. El workflow `check-notas.yml` se ejecutará automáticamente cada 30 minutos

### 5️⃣ Probar Manualmente (Opcional)

Para verificar que todo funciona sin esperar:

1. Ve a **Actions** → **"Verificar Notas UTN"**
2. Haz clic en **"Run workflow"** → **"Run workflow"**
3. Observa los logs para verificar que todo funcione correctamente

## 📊 Configuración de Materia y Nota

### Nombre de la Materia
- Debe ser **exactamente** como aparece en el sistema de autogestión
- Ejemplos válidos:
  - `Investigación Operativa`
  - `Redes de Datos`
  - `Sistemas Operativos`

### Número de Columna
El número corresponde a la posición de la columna en la tabla de notas:

| Columna | Descripción |
|---------|-------------|
| `1` | 1º Parcial |
| `2` | 2º Parcial |
| `3` | 1º Práctico |
| `4` | 1º Recuperatorio |
| `5` | 2º Recuperatorio |

### Modo de Notificación

El bot tiene dos modos de operación controlados por `NOTIFICAR_SIEMPRE`:

#### 🔔 `NOTIFICAR_SIEMPRE=true` (Modo Verbose)
- ✅ Envía un mensaje cada vez que se ejecuta (cada 30 minutos)
- ✅ Te mantiene informado constantemente del estado de tu nota
- ⚠️ Puede generar muchos mensajes si la nota no cambia

#### 🔕 `NOTIFICAR_SIEMPRE=false` (Modo Inteligente) - **RECOMENDADO**
- ✅ Solo envía mensaje cuando la nota **cambia**
- ✅ Solo envía mensaje cuando la nota pasa de **0 a un valor**
- ✅ No envía mensaje si la nota sigue siendo 0
- ✅ Ahorra mensajes y solo te notifica cuando hay novedades importantes
- 💾 Guarda el estado de la última nota verificada

## 📝 Ejemplos de Notificaciones por WhatsApp

### Modo `NOTIFICAR_SIEMPRE=true`
```
📋 Verificación de nota

📚 Materia: Investigación Operativa
📝 Columna: 2º Parc.
📊 Nota actual: 10

🕐 5/11/2025 14:30:00
```

### Modo `NOTIFICAR_SIEMPRE=false`

**Cuando hay un cambio de nota:**
```
🎓 ¡NOTA ACTUALIZADA!

📚 Materia: Investigación Operativa
📝 Columna: 2º Parc.
📊 Nota nueva: 10

🕐 5/11/2025 14:30:00
```

**Cuando aparece una nota nueva (de 0 a un valor):**
```
✨ ¡NUEVA NOTA DISPONIBLE!

📚 Materia: Investigación Operativa
📝 Columna: 2º Parc.
📊 Nota: 10

🕐 5/11/2025 14:30:00
```

## � Personalización del Horario

Por defecto, el bot verifica las notas cada **30 minutos**.

Para cambiar la frecuencia, edita el archivo `.github/workflows/check-notas.yml`:

```yaml
schedule:
  - cron: '*/30 * * * *'  # Cada 30 minutos
```

Ejemplos de otros horarios:
```yaml
- cron: '0 * * * *'      # Cada hora
- cron: '0 8,12,18 * * *' # A las 8am, 12pm y 6pm
- cron: '*/15 * * * *'    # Cada 15 minutos
```

> 🌐 Usa [crontab.guru](https://crontab.guru/) para generar expresiones cron personalizadas

## 🛠️ Tecnologías

- **Node.js** - Runtime
- **Playwright** - Automatización de navegador
- **Twilio API** - Envío de mensajes de WhatsApp
- **GitHub Actions** - Ejecución automática en la nube
- **dotenv** - Manejo de variables de entorno

## ⚠️ Notas Importantes

- ✅ El bot se ejecuta completamente en GitHub Actions (sin necesidad de servidor propio)
- 🌙 Respeta horario de silencio entre 1am y 7am
- 🆓 Las credenciales de Twilio sandbox son gratuitas pero tienen limitaciones
- 💰 Para uso intensivo, considera actualizar a una cuenta de Twilio de pago
- 🔋 GitHub Actions ofrece 2000 minutos gratis al mes (más que suficiente para este bot)

## 🔒 Seguridad

- ✅ Todas las credenciales se almacenan como **GitHub Secrets** (encriptados)
- ✅ Las credenciales **nunca** se exponen en los logs públicos
- ✅ El archivo `.env` está en `.gitignore` para prevenir commits accidentales
- ⚠️ **NUNCA** compartas tus secrets públicamente

## 🐛 Solución de Problemas

### El workflow no se ejecuta
- Verifica que GitHub Actions esté habilitado en tu repositorio
- Revisa la pestaña "Actions" para ver si hay errores

### No recibo notificaciones de WhatsApp
- Verifica que hayas activado el WhatsApp Sandbox de Twilio
- Confirma que el formato del número sea correcto: `whatsapp:+549...`
- Revisa los logs en GitHub Actions para ver el error específico

### Error "Materia no encontrada"
- Verifica que el nombre de la materia sea exacto (respeta mayúsculas y acentos)
- Asegúrate de estar usando el nombre como aparece en autogestión

---

Creado por [@tomimorinigo](https://github.com/tomimorinigo)
